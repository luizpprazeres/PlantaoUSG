# Plantão USG — Arquitetura e Produto

## Visão do Produto

**Plantão USG** é um assistente clínico de POCUS (Point-of-Care Ultrasound) voltado para médicos que trabalham em contexto de emergência. O app gera laudos estruturados a partir de achados sonográficos selecionados pelo médico, com linguagem clínica precisa e natural — sem substituir a avaliação formal de ultrassonografia.

O projeto nasceu de uma demanda real dos usuários do **LaudoUSG**, a plataforma de laudos de ultrassonografia já em uso por médicos brasileiros. O Plantão USG é a extensão mobile dessa experiência, adaptada para o ritmo e as necessidades da sala vermelha e da UTI.

---

## Público-Alvo

- **Perfil:** Médicos emergencistas, intensivistas, residentes de medicina de emergência e medicina intensiva
- **Faixa etária:** 25–45 anos
- **Contexto de uso:** Sala de emergência, sala vermelha, UTI, leito de pronto-socorro
- **Característica:** Alta carga cognitiva no momento do uso — o app deve ser rápido, direto e confiável
- **Relação com o produto:** Profissionais que já usam POCUS no dia a dia mas precisam de apoio na documentação e tomada de decisão clínica

---

## Funcionalidades Principais

### 1. Laudador por Protocolo
O núcleo do app. O médico seleciona um protocolo POCUS (eFAST, BLUE, RUSH, Cardíaco, VExUS, Obstétrico), preenche as janelas ecográficas com achados padronizados, e gera um laudo estruturado via IA.

**Fluxo:**
```
Home → selecionar protocolo → Laudador (janelas + achados) → gerar laudo → Resultado (laudo extenso + versão prontuário + PDF)
```

**Protocolos disponíveis:** eFAST, BLUE, RUSH, Cardíaco, VExUS, Obstétrico
**Em desenvolvimento:** Vascular, Acessos guiados

### 2. Calculadoras Clínicas
Ferramentas de cálculo rápido para uso à beira do leito:
- PAM, qSOFA, débito cardíaco
- Obstétricas: IG por CCN (Hadlock), IG por DMSG (Robinson & Fleming), ILA (Phelan)

### 3. Tira-Dúvidas (POCUS · AI)
Chat com IA especializado em POCUS. Responde perguntas técnicas sobre protocolos, interpretação de achados e condutas clínicas.

### 4. Curso
Módulos didáticos de POCUS com storytelling, esquemas visuais em HTML e linguagem adaptada para médicos com pouco tempo. Fundo branco para diferenciação visual e melhor legibilidade de conteúdo.

### 5. Vídeos
Curadoria de recursos externos (plataformas, cursos, atlases, podcasts) para estudo aprofundado de POCUS.

### 6. Progresso (dentro de Preferências)
Gamificação clínica com níveis de competência (I–IV), marcos progressivos e certificados desbloqueáveis. Todos os dados são locais (SQLite), sem leaderboard, sem dados enviados a servidores externos.

### 7. Histórico
Laudos gerados anteriormente, acessíveis offline.

---

## Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| Framework | Expo SDK 52 + Expo Router (file-based routing) |
| Linguagem | TypeScript (strict) |
| Banco de dados | Drizzle ORM + expo-sqlite (SQLite local) |
| API / IA | OpenAI GPT-4o-mini via Vercel Edge Functions |
| Hospedagem | Vercel (API routes em `api/`) |
| Fonte | IBM Plex Mono (400, 500, 600, 700) |
| Animações | react-native-reanimated |
| Ícones | lucide-react-native |
| PDF | expo-print + expo-sharing (build nativo apenas) |
| Analytics | Interno (sem dados pessoais) |
| LGPD | Todos os laudos e dados de progresso ficam 100% no dispositivo |

---

## Estrutura de Arquivos

```
plantao-usg/
├── app/                        # Telas (Expo Router)
│   ├── index.tsx               # Home
│   ├── laudador/[protocolo].tsx # Tela de preenchimento
│   ├── resultado.tsx           # Laudo gerado
│   ├── calculadoras/           # Calculadoras
│   ├── curso/                  # Módulos de curso
│   ├── historico.tsx           # Laudos anteriores
│   ├── preferencias/           # Identificação médica + progresso + sobre
│   ├── tira-duvidas.tsx        # Chat POCUS AI
│   └── videos/                 # Recursos externos
├── api/                        # Edge functions (Vercel)
│   ├── gerar-laudo.ts          # Geração de laudo via OpenAI
│   └── tira-duvidas.ts         # Chat POCUS AI
├── src/
│   ├── components/             # Componentes reutilizáveis
│   ├── constants/theme.ts      # Tokens de design (cores, fontes, espaçamentos)
│   ├── data/                   # Dados estáticos (protocolos, cursos, vídeos, refs)
│   ├── hooks/                  # Custom hooks (useLaudos, useMedico, useEstatisticas...)
│   ├── stores/                 # Zustand stores
│   └── utils/                  # Utilitários (gerarPDF, analytics, marcos)
└── architecture.md             # Este arquivo
```

---

## Fluxo de Geração de Laudo

```
1. Médico seleciona protocolo na Home
2. LaudadorStore.iniciar(protocolo) inicializa o estado
3. Médico percorre janelas ecográficas, selecionando achados
4. Ao confirmar, POST para /api/gerar-laudo com:
   - protocolo, janelas preenchidas, dados do médico
5. OpenAI GPT-4o-mini gera:
   - Laudo extenso (TÉCNICA, ACHADOS, IMPRESSÃO, REFERÊNCIAS — máx. 2)
   - Versão para prontuário (texto corrido, objetivo)
6. Laudo salvo no SQLite local (Drizzle)
7. ResultadoScreen exibe com opções: copiar, compartilhar, exportar PDF
```

---

## Regras Clínicas no System Prompt

- ACHADOS: prosa clínica natural, sem redundância de localização
  - ERRADO: `"Pleural direito: derrame pleural direito moderado"`
  - CERTO: `"Derrame pleural direito moderado"` ou `"Pleural direito: derrame de moderada monta"`
- REFERÊNCIAS: exatamente 2, em formato Vancouver simplificado
- Laudo é documento de suporte à documentação clínica — não substitui avaliação formal
- Disclaimers obrigatórios: responsabilidade clínica é do médico; Resolução CFM nº 2.314/2022

---

## O que NÃO fazer

- **Não adicionar cores** ao tema (o design é intencionalmente monocromático — preto/branco/cinza)
- **Não usar fontes diferentes de IBM Plex Mono** — identidade visual depende da uniformidade
- **Não criar leaderboards ou rankings** — contexto clínico exige seriedade
- **Não enviar laudos ou dados do paciente para servidores** — LGPD e sigilo médico
- **Não fazer o app parecer um jogo** — a gamificação usa linguagem clínica (Nível I–IV, certificados, marcos)
- **Não sobrecarregar o fluxo principal** — o médico está sob pressão; cada toque deve ter propósito
- **Não adicionar animações pesadas** — Reanimated para entrada de cards, nada mais
- **Não usar emojis nas telas clínicas** — emojis são permitidos apenas em onboarding e curso
- **Não criar dependências de rede para funcionalidades core** — laudos e calculadoras devem funcionar offline
- **Não substituir avaliação formal de ultrassonografia** — o app é complementar, focado (POCUS)
- **Não criar telas com mais de uma responsabilidade clara** — cada rota tem um propósito único

---

## Convenções de Código

- Arquivos de tela: `app/[rota]/index.tsx` (pasta) ou `app/rota.tsx` (arquivo)
- Componentes: PascalCase, arquivo único com styles no final via `StyleSheet.create`
- Dados estáticos: `src/data/[domínio]/index.ts` + tipos separados em `tipos.ts`
- Hooks: `use` prefix, sempre retornam objeto nomeado (nunca array sem contexto)
- Stores: Zustand com `useLaudadorStore`, `usePreferences`
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`)
