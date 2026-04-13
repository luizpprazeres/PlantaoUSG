/**
 * HtmlRenderer — renderizador nativo de HTML básico para React Native.
 * Suporta: p, strong, em, br, table, tr, td, th, div, h1-h4, ul, li.
 * Não usa WebView — parse manual de tags.
 */
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface HtmlRendererProps {
  html: string;
  style?: object;
}

type Token =
  | { type: 'text'; content: string }
  | { type: 'tag'; name: string; closing: boolean; selfClose: boolean; attrs: Record<string, string> };

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end === -1) { tokens.push({ type: 'text', content: html.slice(i) }); break; }
      const raw = html.slice(i + 1, end).trim();
      const closing = raw.startsWith('/');
      const selfClose = raw.endsWith('/');
      const tagBody = raw.replace(/^\//, '').replace(/\/$/, '').trim();
      const spaceIdx = tagBody.search(/\s/);
      const name = spaceIdx === -1 ? tagBody.toLowerCase() : tagBody.slice(0, spaceIdx).toLowerCase();
      const attrsStr = spaceIdx === -1 ? '' : tagBody.slice(spaceIdx);
      const attrs: Record<string, string> = {};
      const attrRe = /(\w[\w-]*)(?:=["']([^"']*)["'])?/g;
      let m: RegExpExecArray | null;
      while ((m = attrRe.exec(attrsStr)) !== null) {
        attrs[m[1]] = m[2] ?? '';
      }
      tokens.push({ type: 'tag', name, closing, selfClose, attrs });
      i = end + 1;
    } else {
      const next = html.indexOf('<', i);
      const content = next === -1 ? html.slice(i) : html.slice(i, next);
      if (content) tokens.push({ type: 'text', content });
      if (next === -1) break;
      i = next;
    }
  }
  return tokens;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

type RenderNode =
  | { kind: 'text'; content: string; bold: boolean; italic: boolean }
  | { kind: 'br' }
  | { kind: 'block'; tag: string; children: RenderNode[] }
  | { kind: 'table'; rows: { isHeader: boolean; cells: RenderNode[][] }[] };

function buildTree(tokens: Token[]): RenderNode[] {
  let idx = 0;

  function parseNodes(stopAt?: string): RenderNode[] {
    const nodes: RenderNode[] = [];
    let bold = false;
    let italic = false;

    while (idx < tokens.length) {
      const tok = tokens[idx];

      if (tok.type === 'text') {
        const decoded = decodeEntities(tok.content);
        if (decoded.trim() || decoded.includes(' ')) {
          nodes.push({ kind: 'text', content: decoded, bold, italic });
        }
        idx++;
        continue;
      }

      // tag token
      if (tok.closing) {
        if (stopAt && tok.name === stopAt) { idx++; break; }
        idx++;
        continue;
      }

      if (tok.name === 'br' || tok.selfClose) {
        nodes.push({ kind: 'br' });
        idx++;
        continue;
      }

      if (tok.name === 'strong' || tok.name === 'b') {
        bold = true; idx++;
        nodes.push(...parseNodes('strong'));
        nodes.push(...parseNodes('b'));
        bold = false;
        continue;
      }

      if (tok.name === 'em' || tok.name === 'i') {
        italic = true; idx++;
        nodes.push(...parseNodes('em'));
        nodes.push(...parseNodes('i'));
        italic = false;
        continue;
      }

      if (tok.name === 'table') {
        idx++;
        const rows: { isHeader: boolean; cells: RenderNode[][] }[] = [];
        while (idx < tokens.length) {
          const t = tokens[idx];
          if (t.type === 'tag' && t.closing && t.name === 'table') { idx++; break; }
          if (t.type === 'tag' && !t.closing && (t.name === 'tr')) {
            idx++;
            const cells: RenderNode[][] = [];
            let isHeader = false;
            while (idx < tokens.length) {
              const tc = tokens[idx];
              if (tc.type === 'tag' && tc.closing && tc.name === 'tr') { idx++; break; }
              if (tc.type === 'tag' && !tc.closing && (tc.name === 'td' || tc.name === 'th')) {
                if (tc.name === 'th') isHeader = true;
                idx++;
                cells.push(parseNodes(tc.name));
              } else { idx++; }
            }
            if (cells.length) rows.push({ isHeader, cells });
          } else { idx++; }
        }
        nodes.push({ kind: 'table', rows });
        continue;
      }

      const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li'];
      if (blockTags.includes(tok.name)) {
        idx++;
        const children = parseNodes(tok.name);
        nodes.push({ kind: 'block', tag: tok.name, children });
        continue;
      }

      idx++;
    }
    return nodes;
  }

  return parseNodes();
}

function RenderNodes({ nodes }: { nodes: RenderNode[] }): React.ReactElement {
  const elements: React.ReactElement[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.kind === 'text') {
      elements.push(
        <Text key={i} style={[s.text, node.bold && s.bold, node.italic && s.italic]}>
          {node.content}
        </Text>
      );
      continue;
    }

    if (node.kind === 'br') {
      elements.push(<Text key={i}>{'\n'}</Text>);
      continue;
    }

    if (node.kind === 'table') {
      elements.push(
        <ScrollView
          key={i}
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          style={s.tableScroll}
        >
          <View style={s.table}>
            {node.rows.map((row, ri) => (
              <View key={ri} style={[s.tableRow, row.isHeader && s.tableHeaderRow]}>
                {row.cells.map((cell, ci) => (
                  <View key={ci} style={s.tableCell}>
                    <RenderNodes nodes={cell} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
      continue;
    }

    if (node.kind === 'block') {
      const { tag, children } = node;
      if (tag === 'p') {
        elements.push(
          <Text key={i} style={s.paragraph}>
            <RenderNodes nodes={children} />
          </Text>
        );
      } else if (tag === 'h1' || tag === 'h2') {
        elements.push(
          <Text key={i} style={s.h2}><RenderNodes nodes={children} /></Text>
        );
      } else if (tag === 'h3' || tag === 'h4') {
        elements.push(
          <Text key={i} style={s.h3}><RenderNodes nodes={children} /></Text>
        );
      } else if (tag === 'li') {
        elements.push(
          <View key={i} style={s.li}>
            <Text style={s.liDot}>·</Text>
            <Text style={s.liText}><RenderNodes nodes={children} /></Text>
          </View>
        );
      } else {
        elements.push(
          <View key={i}><RenderNodes nodes={children} /></View>
        );
      }
    }
  }

  return <>{elements}</>;
}

export function HtmlRenderer({ html, style }: HtmlRendererProps) {
  const tokens = tokenize(html);
  const tree = buildTree(tokens);
  return (
    <View style={style}>
      <RenderNodes nodes={tree} />
    </View>
  );
}

const s = StyleSheet.create({
  text: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  bold: {
    fontFamily: 'IBMPlexMono_700Bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  paragraph: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    lineHeight: 20,
    marginBottom: 8,
  },
  h2: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 15,
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  h3: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 13,
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 6,
  },
  li: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
    paddingLeft: 8,
  },
  liDot: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: '#555',
    lineHeight: 20,
  },
  liText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    lineHeight: 20,
    flex: 1,
  },
  tableScroll: {
    marginVertical: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderRow: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    minWidth: 100,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
});
