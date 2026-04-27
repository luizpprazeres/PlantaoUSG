import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calculator,
  MessageCircle,
  CheckCircle,
  Circle,
  ExternalLink,
  Lock,
  AlertTriangle,
} from 'lucide-react-native';
import {
  Colors,
  Signal,
  FontSize,
  FontFamily,
  Spacing,
  Radius,
  Motion,
} from '@/constants/theme';
import { BlinkingCursor } from '@/components/ui/BlinkingCursor';
import { Scanline } from '@/components/ui/Scanline';

// =============================================================================
// /design-system — Página viva da identidade visual Plantão USG
// Acessível via URL direta no web build (Vercel). Não exposta na navegação.
// Espelho do arquivo design-system.md na raiz do projeto.
// =============================================================================

export default function DesignSystemScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <DocHeader />

        <Section id="01" title="Identidade">
          <IdentidadeSection />
        </Section>

        <Section id="02" title="Logotipo">
          <LogotipoSection />
        </Section>

        <Section id="03" title="Tipografia">
          <TipografiaSection />
        </Section>

        <Section id="04" title="Paleta">
          <PaletaSection />
        </Section>

        <Section id="05" title="Espaçamentos">
          <EspacamentosSection />
        </Section>

        <Section id="06" title="Bordas e radius">
          <RadiusSection />
        </Section>

        <Section id="07" title="Iconografia">
          <IconesSection />
        </Section>

        <Section id="08" title="Glyphs de telemetria">
          <GlyphsSection />
        </Section>

        <Section id="09" title="Botões">
          <BotoesSection />
        </Section>

        <Section id="10" title="Cards">
          <CardsSection />
        </Section>

        <Section id="11" title="Inputs e chips">
          <InputsSection />
        </Section>

        <Section id="12" title="Animações">
          <AnimacoesSection />
        </Section>

        <Section id="13" title="Padrões de tela">
          <PadroesSection />
        </Section>

        <Section id="14" title="Do / Don't">
          <DoDontSection />
        </Section>

        <Section id="15" title="Checklist">
          <ChecklistSection />
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            plantãoUSG_ design-system v1.0 · 2026-04
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// DOC HEADER
// =============================================================================

function DocHeader() {
  return (
    <View style={styles.docHeader}>
      <View style={styles.docHeaderInner}>
        <Text style={styles.docKicker}>PLANTÃOUSG</Text>
        <View style={styles.docTitleRow}>
          <Text style={styles.docTitle}>DESIGN SYSTEM</Text>
          <BlinkingCursor size={28} blinking color={Colors.textPrimary} />
        </View>
        <Text style={styles.docSubtitle}>
          NOSTROMO · INSTRUMENTO, NÃO INTERFACE.
        </Text>
        <View style={styles.docMeta}>
          <Text style={styles.docMetaItem}>VERSÃO 1.0</Text>
          <Text style={styles.docMetaSep}>·</Text>
          <Text style={styles.docMetaItem}>2026-04</Text>
          <Text style={styles.docMetaSep}>·</Text>
          <Text style={styles.docMetaItem}>CANÔNICO</Text>
        </View>
      </View>
      <Scanline height={180} opacity={Motion.scanlineOpacity} />
    </View>
  );
}

// =============================================================================
// SECTION WRAPPER
// =============================================================================

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionId}>[{id}]</Text>
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subLabel}>{children}</Text>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

function Caption({ children }: { children: React.ReactNode }) {
  return <Text style={styles.caption}>{children}</Text>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <Text style={styles.code}>{children}</Text>;
}

// =============================================================================
// 01. IDENTIDADE
// =============================================================================

function IdentidadeSection() {
  return (
    <View>
      <Text style={styles.mantra}>"Instrumento, não interface."</Text>
      <Caption>O médico não usa um app. Ele lê um instrumento.</Caption>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>TRÊS ADJETIVOS GUIA</SubLabel>
      <View style={styles.row}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>CALIBRADO</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>DENSO</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>SILENCIOSO</Text>
        </View>
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>PRINCÍPIOS</SubLabel>
      {[
        '01 · Cada pixel serve à decisão clínica.',
        '02 · A interface é invisível.',
        '03 · Densidade > respiro. O usuário tem pressa.',
        '04 · Sem decoração: sombras, gradientes, ilustrações são proibidos.',
        '05 · Cor é dado, nunca enfeite. Apenas danger fora do core.',
        '06 · Texto em UPPERCASE é status.',
        '07 · Animação confirma, não decora. ≤ 400ms.',
        '08 · Offline é padrão.',
        '09 · Gamificação vestida de telemetria.',
        '10 · Educação tem tela própria (Curso).',
      ].map((p) => (
        <Text key={p} style={styles.principle}>
          {p}
        </Text>
      ))}
    </View>
  );
}

// =============================================================================
// 02. LOGOTIPO
// =============================================================================

function LogotipoSection() {
  return (
    <View>
      <SubLabel>VARIAÇÃO A — APENAS WORDMARK</SubLabel>
      <View style={styles.logoCanvas}>
        <Text style={styles.logoWordmark}>plantãoUSG</Text>
      </View>
      <Caption>Mono-peso 500 · letterSpacing −0.5 · IBM Plex Mono</Caption>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>VARIAÇÃO A + D — WORDMARK + CURSOR PISCANTE</SubLabel>
      <View style={styles.logoCanvas}>
        <View style={styles.logoRow}>
          <Text style={styles.logoWordmark}>plantãoUSG</Text>
          <BlinkingCursor size={32} blinking glyph="_" />
        </View>
      </View>
      <Caption>
        Cursor piscando (600ms on / 600ms off · linear). Uso: splash + /design-system.
      </Caption>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>VARIAÇÃO A + D ESTÁTICO — HEADER DA HOME</SubLabel>
      <View style={styles.logoCanvas}>
        <View style={styles.logoRow}>
          <Text style={styles.logoWordmark}>plantãoUSG</Text>
          <BlinkingCursor size={32} blinking={false} glyph="_" />
        </View>
      </View>
      <Caption>Cursor estático aceso. Uso: header Home.</Caption>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>LOCKUP COM BASELINE</SubLabel>
      <View style={styles.logoCanvas}>
        <View style={styles.logoRow}>
          <Text style={styles.logoWordmark}>plantãoUSG</Text>
          <BlinkingCursor size={32} blinking={false} glyph="_" />
        </View>
        <Text style={styles.logoBaseline}>POCUS · LAUDOS · EMERGÊNCIA</Text>
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>INVERSÃO — TEMA CURSO (BRANCO)</SubLabel>
      <View style={[styles.logoCanvas, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.logoWordmark, { color: '#000000' }]}>
          plantãoUSG
        </Text>
        <Text
          style={[
            styles.logoBaseline,
            { color: '#1a1a1a', marginTop: Spacing.xs },
          ]}
        >
          POCUS · LAUDOS · EMERGÊNCIA
        </Text>
      </View>
      <Caption>Sem cursor. Uso: Curso, contexto impresso.</Caption>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>MONOGRAMA</SubLabel>
      <View style={styles.row}>
        <View style={styles.monogramBox}>
          <Text style={styles.monogramText}>pUSG</Text>
        </View>
      </View>
      <Caption>Favicon, ícone PWA, badge interna.</Caption>
    </View>
  );
}

// =============================================================================
// 03. TIPOGRAFIA
// =============================================================================

function TipografiaSection() {
  const samples: { token: string; size: number; weight: string }[] = [
    { token: 'display · 28', size: FontSize.display, weight: 'bold' },
    { token: 'title · 22', size: FontSize.title, weight: 'bold' },
    { token: 'heading · 20', size: FontSize.heading, weight: 'semibold' },
    { token: 'body · 16', size: FontSize.body, weight: 'regular' },
    { token: 'read · 15 (sans)', size: FontSize.read, weight: 'regular' },
    { token: 'label · 14', size: FontSize.label, weight: 'medium' },
    { token: 'caption · 12', size: FontSize.caption, weight: 'regular' },
    { token: 'micro · 10', size: FontSize.micro, weight: 'medium' },
  ];

  return (
    <View>
      <SubLabel>FAMÍLIA — IBM PLEX MONO</SubLabel>
      <Caption>UI · 90% do app</Caption>
      <View style={{ height: Spacing.md }} />
      {samples.map((s) => {
        const isReadSample = s.token.includes('sans');
        const fontFamily = isReadSample
          ? FontFamily.sans.regular
          : (FontFamily.mono as Record<string, string>)[s.weight];
        return (
          <View key={s.token} style={styles.typeRow}>
            <Text style={styles.typeToken}>{s.token.toUpperCase()}</Text>
            <Text
              style={{
                fontFamily,
                fontSize: s.size,
                color: Colors.textPrimary,
              }}
            >
              Aa Bb 0123 → laudo gerado
            </Text>
          </View>
        );
      })}

      <View style={{ height: Spacing.lg }} />

      <SubLabel>FAMÍLIA — IBM PLEX SANS</SubLabel>
      <Caption>Apenas body de leitura no Curso</Caption>
      <View style={{ height: Spacing.md }} />
      <View style={styles.sansSample}>
        <Text style={styles.sansSampleText}>
          A síndrome BLUE descreve perfis ecográficos pulmonares à beira do
          leito. Cada perfil corresponde a um padrão de linhas A ou B,
          deslizamento pleural e consolidações específicas — guiando a
          hipótese diagnóstica em segundos.
        </Text>
      </View>
      <Caption>IBM Plex Sans 400 · 15px · lineHeight 1.55 · #1a1a1a sobre #FFFFFF</Caption>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>NÚMEROS — TABULAR FIGURES</SubLabel>
      <View style={styles.numbersRow}>
        <Text style={styles.bigNumber}>128</Text>
        <Text style={styles.bigNumber}>045</Text>
        <Text style={styles.bigNumber}>912</Text>
      </View>
      <Caption>fontVariant: ['tabular-nums'] · alinhamento perfeito de algarismos</Caption>
    </View>
  );
}

// =============================================================================
// 04. PALETA
// =============================================================================

function PaletaSection() {
  const core: { name: string; hex: string; use: string }[] = [
    { name: 'bgPrimary', hex: Colors.bgPrimary, use: 'Fundo principal' },
    { name: 'bgElevated', hex: Colors.bgElevated, use: 'Cards / superfícies' },
    { name: 'bgInput', hex: Colors.bgInput, use: 'Inputs / tags' },
    { name: 'borderSubtle', hex: Colors.borderSubtle, use: 'Bordas suaves' },
    { name: 'borderDefault', hex: Colors.borderDefault, use: 'Bordas padrão' },
    { name: 'textMuted', hex: Colors.textMuted, use: 'Texto baixa ênfase' },
    { name: 'textSecondary', hex: Colors.textSecondary, use: 'Texto secundário' },
    { name: 'textPrimary', hex: Colors.textPrimary, use: 'Texto principal' },
  ];

  return (
    <View>
      <SubLabel>CORE MONOCROMÁTICO</SubLabel>
      <View style={styles.swatchGrid}>
        {core.map((c) => (
          <View key={c.name} style={styles.swatch}>
            <View style={[styles.swatchColor, { backgroundColor: c.hex }]} />
            <View style={styles.swatchInfo}>
              <Text style={styles.swatchName}>{c.name.toUpperCase()}</Text>
              <Text style={styles.swatchHex}>{c.hex}</Text>
              <Text style={styles.swatchUse}>{c.use}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>SIGNAL — APENAS DANGER</SubLabel>
      <View style={styles.swatch}>
        <View
          style={[
            styles.swatchColor,
            { backgroundColor: Signal.danger },
          ]}
        />
        <View style={styles.swatchInfo}>
          <Text style={styles.swatchName}>SIGNAL · DANGER</Text>
          <Text style={styles.swatchHex}>{Signal.danger}</Text>
          <Text style={styles.swatchUse}>
            Risco clínico real apenas. Nunca destaque genérico.
          </Text>
        </View>
      </View>

      <View style={{ height: Spacing.md }} />
      <View style={styles.dangerRule}>
        <AlertTriangle size={14} color={Colors.emergencyRed} />
        <Text style={styles.dangerRuleText}>
          NOSTROMO: NENHUM OUTRO SIGNAL COLOR. SEM WARN, OK OU INFO.
        </Text>
      </View>
    </View>
  );
}

// =============================================================================
// 05. ESPAÇAMENTOS
// =============================================================================

function EspacamentosSection() {
  const tokens: [string, number][] = [
    ['xs', Spacing.xs],
    ['sm', Spacing.sm],
    ['md', Spacing.md],
    ['base', Spacing.base],
    ['lg', Spacing.lg],
    ['xl', Spacing.xl],
    ['2xl', Spacing['2xl']],
    ['3xl', Spacing['3xl']],
  ];

  return (
    <View>
      {tokens.map(([name, value]) => (
        <View key={name} style={styles.spacingRow}>
          <Text style={styles.spacingLabel}>
            {name.toUpperCase()} · {value}
          </Text>
          <View style={[styles.spacingBar, { width: value * 4 }]} />
        </View>
      ))}
    </View>
  );
}

// =============================================================================
// 06. RADIUS
// =============================================================================

function RadiusSection() {
  const tokens: [string, number][] = [
    ['none', Radius.none],
    ['micro', Radius.micro],
    ['sm', Radius.sm],
    ['md', Radius.md],
  ];

  return (
    <View>
      <View style={styles.radiusRow}>
        {tokens.map(([name, value]) => (
          <View key={name} style={styles.radiusItem}>
            <View
              style={[
                styles.radiusBox,
                { borderRadius: value },
                name === 'md' && styles.radiusBoxAvoid,
              ]}
            />
            <Text style={styles.radiusName}>
              {name.toUpperCase()} · {value}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ height: Spacing.sm }} />
      <Caption>md (8) é o limite — evitar. Preferir none (0) em quase tudo.</Caption>
    </View>
  );
}

// =============================================================================
// 07. ÍCONES
// =============================================================================

function IconesSection() {
  const icons: {
    name: string;
    Icon: typeof Calculator;
    size: number;
    use: string;
  }[] = [
    { name: 'ArrowLeft', Icon: ArrowLeft, size: 20, use: 'Nav' },
    { name: 'Calculator', Icon: Calculator, size: 15, use: 'Card compacto' },
    { name: 'MessageCircle', Icon: MessageCircle, size: 15, use: 'Card compacto' },
    { name: 'CheckCircle', Icon: CheckCircle, size: 16, use: 'Lista / marco' },
    { name: 'Circle', Icon: Circle, size: 16, use: 'Lista pendente' },
    { name: 'ExternalLink', Icon: ExternalLink, size: 14, use: 'Tag link externo' },
    { name: 'Lock', Icon: Lock, size: 14, use: 'Tag bloqueado' },
    { name: 'AlertTriangle', Icon: AlertTriangle, size: 16, use: 'Risco clínico' },
  ];

  return (
    <View>
      <View style={styles.iconGrid}>
        {icons.map(({ name, Icon, size, use }) => (
          <View key={name} style={styles.iconCell}>
            <View style={styles.iconBox}>
              <Icon
                size={size}
                color={
                  name === 'AlertTriangle'
                    ? Colors.emergencyRed
                    : Colors.textPrimary
                }
                strokeWidth={1.5}
              />
            </View>
            <Text style={styles.iconName}>{name}</Text>
            <Text style={styles.iconMeta}>
              {size}px · {use}
            </Text>
          </View>
        ))}
      </View>
      <Caption>Biblioteca: lucide-react-native · stroke 1.5 sempre</Caption>
    </View>
  );
}

// =============================================================================
// 08. GLYPHS DE TELEMETRIA
// =============================================================================

function GlyphsSection() {
  return (
    <View>
      <SubLabel>NÍVEIS DE COMPETÊNCIA</SubLabel>
      <View style={styles.row}>
        {['[I]', '[II]', '[III]', '[IV]'].map((n) => (
          <View key={n} style={styles.levelChip}>
            <Text style={styles.levelText}>{n}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>BARRAS SEGMENTADAS DE PROGRESSO</SubLabel>
      {[
        { full: 0, label: '0 de 5 — não iniciado' },
        { full: 2, label: '2 de 5 — em progresso' },
        { full: 3, label: '3 de 5 — em progresso' },
        { full: 5, label: '5 de 5 — completo' },
      ].map((bar) => (
        <View key={bar.label} style={styles.progressRow}>
          <Text style={styles.progressBar}>
            <Text style={styles.progressFull}>
              {'▮'.repeat(bar.full)}
            </Text>
            <Text style={styles.progressEmpty}>
              {'▯'.repeat(5 - bar.full)}
            </Text>
          </Text>
          <Text style={styles.progressLabel}>{bar.label.toUpperCase()}</Text>
        </View>
      ))}

      <View style={{ height: Spacing.lg }} />

      <SubLabel>STATUS DE ITEM</SubLabel>
      {[
        { glyph: '◉', label: 'COMPLETO' },
        { glyph: '●', label: 'EM PROGRESSO' },
        { glyph: '○', label: 'PENDENTE' },
      ].map((s) => (
        <View key={s.label} style={styles.statusRow}>
          <Text style={styles.statusGlyph}>{s.glyph}</Text>
          <Text style={styles.statusLabel}>{s.label}</Text>
        </View>
      ))}

      <View style={{ height: Spacing.lg }} />

      <SubLabel>TENDÊNCIAS</SubLabel>
      <View style={styles.row}>
        <Text style={styles.trend}>▲ +12%</Text>
        <Text style={styles.trend}>▼ −8%</Text>
        <Text style={styles.trend}>─ 0%</Text>
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>STATUS ENTRE COLCHETES</SubLabel>
      <View style={styles.row}>
        {['[OK]', '[PENDENTE]', '[BLOQUEADO]', '[NÍVEL III]', '[PROCESSANDO...]'].map(
          (s) => (
            <View key={s} style={styles.bracket}>
              <Text style={styles.bracketText}>{s}</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}

// =============================================================================
// 09. BOTÕES
// =============================================================================

function BotoesSection() {
  return (
    <View>
      <SubLabel>PRIMARY — AÇÃO CONFIRMATÓRIA</SubLabel>
      <ButtonRow>
        <BtnPrimary>GERAR LAUDO</BtnPrimary>
        <BtnPrimary disabled>GERAR LAUDO</BtnPrimary>
        <BtnPrimary loading>GERAR LAUDO</BtnPrimary>
      </ButtonRow>

      <View style={{ height: Spacing.md }} />

      <SubLabel>GHOST — AÇÃO SECUNDÁRIA</SubLabel>
      <ButtonRow>
        <BtnGhost>VER HISTÓRICO</BtnGhost>
        <BtnGhost disabled>VER HISTÓRICO</BtnGhost>
      </ButtonRow>

      <View style={{ height: Spacing.md }} />

      <SubLabel>LINK — NAVEGAÇÃO INLINE</SubLabel>
      <ButtonRow>
        <BtnLink>ver detalhes</BtnLink>
      </ButtonRow>

      <View style={{ height: Spacing.md }} />

      <SubLabel>DANGER — DESTRUTIVO</SubLabel>
      <ButtonRow>
        <BtnDanger>APAGAR LAUDO</BtnDanger>
      </ButtonRow>
    </View>
  );
}

function ButtonRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.buttonRow}>{children}</View>;
}

function BtnPrimary({
  children,
  disabled,
  loading,
}: {
  children: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btnPrimary,
        disabled && styles.btnDisabled,
        pressed && styles.btnPressed,
      ]}
    >
      <Text style={styles.btnPrimaryText}>
        {loading ? '[PROCESSANDO...]' : children}
      </Text>
    </Pressable>
  );
}

function BtnGhost({
  children,
  disabled,
}: {
  children: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.btnGhost,
        disabled && styles.btnDisabled,
        pressed && styles.btnPressed,
      ]}
    >
      <Text style={styles.btnGhostText}>{children}</Text>
    </Pressable>
  );
}

function BtnLink({ children }: { children: string }) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Text
        style={[
          styles.btnLinkText,
          pressed && { textDecorationLine: 'underline' },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function BtnDanger({ children }: { children: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btnDanger, pressed && styles.btnPressed]}
    >
      <Text style={styles.btnDangerText}>{children}</Text>
    </Pressable>
  );
}

// =============================================================================
// 10. CARDS
// =============================================================================

function CardsSection() {
  return (
    <View>
      <SubLabel>CARD DE PROTOCOLO — AÇÃO PRIMÁRIA (COM BORDA)</SubLabel>
      <View style={styles.cardPrimary}>
        <View style={styles.cardPrimaryHeader}>
          <Text style={styles.cardPrimaryCategory}>POCUS</Text>
          <Text style={styles.cardPrimaryStatus}>[OK]</Text>
        </View>
        <Text style={styles.cardPrimaryName}>BLUE</Text>
        <Text style={styles.cardPrimaryDesc}>
          Pulmonar à beira do leito
        </Text>
      </View>

      <View style={{ height: Spacing.md }} />

      <SubLabel>CARD SECUNDÁRIO — AÇÃO LATERAL (SEM BORDA)</SubLabel>
      <View style={styles.cardSecondary}>
        <Calculator size={15} color={Colors.textMuted} strokeWidth={1.5} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardSecondaryName}>CALCULADORAS</Text>
          <Text style={styles.cardSecondaryDesc}>
            PAM, qSOFA, débito cardíaco...
          </Text>
        </View>
      </View>

      <View style={{ height: Spacing.md }} />

      <SubLabel>CARD DE CERTIFICADO — GAMIFICAÇÃO</SubLabel>
      <View style={styles.cardCert}>
        <Text style={styles.cardCertKicker}>CERTIFICADO DE COMPETÊNCIA</Text>
        <Text style={styles.cardCertName}>BLUE</Text>
        <View style={styles.cardCertMeta}>
          <Text style={styles.cardCertLevel}>[NÍVEL III]</Text>
          <Text style={styles.cardCertDate}>2026-04-27</Text>
        </View>
        <Text style={styles.cardCertId}>BLUE/2026-04/CR-1294</Text>
      </View>
    </View>
  );
}

// =============================================================================
// 11. INPUTS E CHIPS
// =============================================================================

function InputsSection() {
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <SubLabel>INPUT DE TEXTO</SubLabel>
      <TextInput
        placeholder="Digite o achado..."
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[
          styles.input,
          focus && { borderColor: Colors.borderDefault },
        ]}
      />

      <View style={{ height: Spacing.lg }} />

      <SubLabel>CHIPS / TAGS</SubLabel>
      <View style={styles.row}>
        {['ECOGÊNICO', 'HIPOECOICO', 'ANECOICO', 'HOMOGÊNEO'].map((t) => (
          <View key={t} style={styles.chip}>
            <Text style={styles.chipText}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: Spacing.md }} />

      <SubLabel>CHIPS COM ÍCONE</SubLabel>
      <View style={styles.row}>
        <View style={[styles.chip, styles.chipWithIcon]}>
          <ExternalLink size={10} color={Colors.textMuted} strokeWidth={1.5} />
          <Text style={styles.chipText}>EXTERNO</Text>
        </View>
        <View style={[styles.chip, styles.chipWithIcon]}>
          <Lock size={10} color={Colors.textMuted} strokeWidth={1.5} />
          <Text style={styles.chipText}>BLOQUEADO</Text>
        </View>
      </View>
    </View>
  );
}

// =============================================================================
// 12. ANIMAÇÕES
// =============================================================================

function AnimacoesSection() {
  return (
    <View>
      <SubLabel>INVENTÁRIO APROVADO</SubLabel>
      {[
        ['CARD ENTRY STAGGER', '300ms · out(cubic) · delay = i × 80ms'],
        ['PRESS FEEDBACK', '80ms · linear · opacity 1→0.7'],
        ['SCREEN TRANSITION', '200ms · fade'],
        ['COUNTER COUNT-UP', '600ms · out(quad)'],
        ['MARCO UNLOCK PULSE', '400ms · out(cubic) · 1×'],
        ['CURSOR BLINK', '600ms on / 600ms off · linear'],
        ['SCANLINE SWEEP', '1200ms · linear · ~8% opacity'],
      ].map(([name, spec]) => (
        <View key={name} style={styles.motionRow}>
          <Text style={styles.motionName}>{name}</Text>
          <Text style={styles.motionSpec}>{spec}</Text>
        </View>
      ))}

      <View style={{ height: Spacing.lg }} />

      <SubLabel>DEMONSTRAÇÃO — SCANLINE</SubLabel>
      <View style={styles.scanlineDemo}>
        <Text style={styles.scanlineDemoText}>HEADER · ÁREA DE VARREDURA</Text>
        <Scanline height={80} opacity={Motion.scanlineOpacity} />
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>DEMONSTRAÇÃO — CURSOR PISCANTE</SubLabel>
      <View style={styles.cursorDemo}>
        <Text style={styles.cursorDemoText}>plantãoUSG</Text>
        <BlinkingCursor size={20} blinking />
      </View>
    </View>
  );
}

// =============================================================================
// 13. PADRÕES DE TELA
// =============================================================================

function PadroesSection() {
  return (
    <View>
      <SubLabel>HEADER DE TELA</SubLabel>
      <View style={styles.screenHeader}>
        <ArrowLeft size={20} color={Colors.textPrimary} strokeWidth={1.5} />
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={styles.screenHeaderTitle}>HISTÓRICO</Text>
          <Text style={styles.screenHeaderSub}>LAUDOS GERADOS</Text>
        </View>
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>EMPTY STATE</SubLabel>
      <View style={styles.emptyState}>
        <Text style={styles.emptyGlyph}>◉ NENHUM LAUDO</Text>
        <Text style={styles.emptyDesc}>
          Gere seu primeiro laudo a partir da home.
        </Text>
        <View style={{ height: Spacing.md }} />
        <BtnPrimary>+ GERAR LAUDO</BtnPrimary>
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>LOADING STATE</SubLabel>
      <View style={styles.loadingState}>
        <Text style={styles.loadingText}>[PROCESSANDO...]</Text>
      </View>

      <View style={{ height: Spacing.lg }} />

      <SubLabel>ERROR STATE</SubLabel>
      <View style={styles.errorState}>
        <Text style={styles.errorTag}>[FALHA]</Text>
        <Text style={styles.errorText}>
          Não foi possível gerar o laudo. Verifique a conexão.
        </Text>
      </View>
    </View>
  );
}

// =============================================================================
// 14. DO / DON'T
// =============================================================================

function DoDontSection() {
  const items: { ok: string; bad: string }[] = [
    {
      ok: 'Preto absoluto #000 como fundo',
      bad: 'Cinza escuro como fundo',
    },
    {
      ok: 'emergencyRed apenas para risco clínico',
      bad: 'emergencyRed para destaque genérico',
    },
    { ok: 'Glyphs [III], ▮▮▮▯▯', bad: 'Medalhas, troféus, estrelas' },
    { ok: 'Animação ≤ 400ms', bad: 'Animação > 400ms (decorativa)' },
    {
      ok: 'mono.bold + tabular-nums em métricas',
      bad: 'mono.regular em números',
    },
    {
      ok: '[PROCESSANDO...] como loading',
      bad: 'Spinner ou skeleton',
    },
    {
      ok: 'Sans só no body do Curso',
      bad: 'Sans em qualquer outro lugar',
    },
  ];

  return (
    <View>
      {items.map((it) => (
        <View key={it.ok} style={styles.dodontRow}>
          <View style={[styles.dodontCol, styles.dodontOk]}>
            <Text style={styles.dodontTag}>DO</Text>
            <Text style={styles.dodontText}>{it.ok}</Text>
          </View>
          <View style={[styles.dodontCol, styles.dodontBad]}>
            <Text style={[styles.dodontTag, { color: Colors.emergencyRed }]}>
              DON'T
            </Text>
            <Text style={styles.dodontText}>{it.bad}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// =============================================================================
// 15. CHECKLIST
// =============================================================================

function ChecklistSection() {
  const items: string[] = [
    'Usa apenas tokens de theme.ts',
    'Usa apenas IBM Plex Mono (Sans só no body do Curso)',
    'borderRadius ≤ 4 em cards e inputs',
    'Sem sombras / elevation',
    'Sem gradientes',
    'Header com ArrowLeft + título UPPERCASE',
    'SafeAreaView edges top',
    'ScrollView com paddingBottom: Spacing.xl',
    'Ícones lucide com strokeWidth 1.5',
    'Sem emojis (exceto onboarding e Curso)',
    'Funciona offline',
    'Estados de botão: default / pressed / disabled / loading',
    "Números com fontVariant: ['tabular-nums']",
    'Animações ≤ 400ms (exceto loops aprovados)',
    'Cursor e scanline ausentes em telas clínicas',
  ];

  return (
    <View>
      {items.map((item, i) => (
        <View key={item} style={styles.checkRow}>
          <Text style={styles.checkGlyph}>○</Text>
          <Text style={styles.checkText}>
            <Text style={styles.checkIndex}>
              {String(i + 1).padStart(2, '0')}{' '}
            </Text>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingBottom: Spacing['2xl'] },

  // doc header
  docHeader: {
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    overflow: 'hidden',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  docHeaderInner: {
    zIndex: 1,
  },
  docKicker: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 3,
    marginBottom: Spacing.xs,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  docSubtitle: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    letterSpacing: 2.5,
    marginTop: Spacing.sm,
  },
  docMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  docMetaItem: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  docMetaSep: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },

  // section
  section: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionId: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontFamily: FontFamily.mono.semibold,
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  sectionBody: {},
  subLabel: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  code: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgInput,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  // identidade
  mantra: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.title,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  pill: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  principle: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // logotipo
  logoCanvas: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoWordmark: {
    fontFamily: FontFamily.mono.medium,
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  logoBaseline: {
    fontFamily: FontFamily.mono.regular,
    fontSize: 9,
    color: Colors.textPrimary,
    letterSpacing: 2.5,
    marginTop: Spacing.xs,
  },
  monogramBox: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },

  // tipografia
  typeRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  typeToken: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  sansSample: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.base,
  },
  sansSampleText: {
    fontFamily: FontFamily.sans.regular,
    fontSize: FontSize.read,
    color: '#1a1a1a',
    lineHeight: 23,
  },
  numbersRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  bigNumber: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },

  // paleta
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  swatch: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    width: '100%',
  },
  swatchColor: {
    width: 56,
    minHeight: 56,
    borderRightWidth: 1,
    borderRightColor: Colors.borderSubtle,
  },
  swatchInfo: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'center',
  },
  swatchName: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.micro,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  swatchHex: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  swatchUse: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dangerRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.emergencyRed,
    padding: Spacing.sm,
  },
  dangerRuleText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.micro,
    color: Colors.emergencyRed,
    letterSpacing: 1.5,
  },

  // espaçamentos
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  spacingLabel: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    width: 90,
  },
  spacingBar: {
    height: 6,
    backgroundColor: Colors.textPrimary,
  },

  // radius
  radiusRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  radiusItem: {
    alignItems: 'center',
  },
  radiusBox: {
    width: 56,
    height: 56,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  radiusBoxAvoid: {
    borderColor: Colors.emergencyRed,
  },
  radiusName: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },

  // ícones
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconCell: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgElevated,
    marginBottom: Spacing.xs,
  },
  iconName: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.micro,
    color: Colors.textPrimary,
  },
  iconMeta: {
    fontFamily: FontFamily.mono.regular,
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // glyphs
  levelChip: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  levelText: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  progressRow: {
    paddingVertical: Spacing.xs,
  },
  progressBar: {
    fontFamily: FontFamily.mono.bold,
    fontSize: 18,
    letterSpacing: 2,
  },
  progressFull: { color: Colors.textPrimary },
  progressEmpty: { color: Colors.borderDefault },
  progressLabel: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  statusGlyph: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  statusLabel: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  trend: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  bracket: {},
  bracketText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },

  // botões
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  btnPrimaryText: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.label,
    color: Colors.bgPrimary,
    letterSpacing: 1,
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  btnGhostText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  btnLinkText: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
  },
  btnDanger: {
    borderWidth: 1,
    borderColor: Colors.emergencyRed,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  btnDangerText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.label,
    color: Colors.emergencyRed,
    letterSpacing: 1,
  },
  btnPressed: { opacity: 0.7 },
  btnDisabled: { opacity: 0.4 },

  // cards
  cardPrimary: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.md,
  },
  cardPrimaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardPrimaryCategory: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  cardPrimaryStatus: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.micro,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  cardPrimaryName: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cardPrimaryDesc: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  cardSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgElevated,
    padding: Spacing.md,
  },
  cardSecondaryName: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  cardSecondaryDesc: {
    fontFamily: FontFamily.mono.regular,
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  cardCert: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    padding: Spacing.base,
  },
  cardCertKicker: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2.5,
  },
  cardCertName: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.title,
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
  cardCertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  cardCertLevel: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cardCertDate: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  cardCertId: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: Spacing.sm,
  },

  // inputs
  input: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    borderRadius: Radius.sm,
  },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  chipWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  chipText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },

  // animações
  motionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  motionName: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.micro,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  motionSpec: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },
  scanlineDemo: {
    height: 80,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanlineDemoText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  cursorDemo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    justifyContent: 'center',
  },
  cursorDemoText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },

  // padrões
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  screenHeaderTitle: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  screenHeaderSub: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyGlyph: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  emptyDesc: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingState: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FontFamily.mono.medium,
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  errorState: {
    borderWidth: 1,
    borderColor: Colors.emergencyRed,
    padding: Spacing.md,
  },
  errorTag: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.label,
    color: Colors.emergencyRed,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },

  // do/don't
  dodontRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dodontCol: {
    flex: 1,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  dodontOk: {
    borderColor: Colors.borderDefault,
  },
  dodontBad: {
    borderColor: Colors.borderSubtle,
    opacity: 0.7,
  },
  dodontTag: {
    fontFamily: FontFamily.mono.bold,
    fontSize: FontSize.micro,
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  dodontText: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  // checklist
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  checkGlyph: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
  checkText: {
    flex: 1,
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  checkIndex: {
    color: Colors.textMuted,
    fontFamily: FontFamily.mono.regular,
    letterSpacing: 1,
  },

  // footer
  footer: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FontFamily.mono.regular,
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
});
