# Plano de Implementação — Arquitetura LLM em 4 Camadas (L1-L4)

> **Pré-requisito:** Ler `docs/architecture.md` (seção 7 — Arquitetura de IA).
> **Data:** 2026-04-27
> **Status:** EM EXECUÇÃO
> **Owner técnico:** Luiz Paulo

## Objetivo

Reduzir dependência de LLM externo, latência percebida e custo operacional do Plantão USG, mantendo (ou melhorando) a qualidade clínica do laudo e do tira-dúvidas. Maximizar funcionamento **offline** — coerente com o contexto real do médico em plantão (internet instável, aparelho modesto).

**Meta agregada:** ≥85% das interações resolvidas sem chamada a LLM externo após estabilização das 4 camadas.

---

## Princípios

1. **Camada por camada** — cada release entrega uma camada estável e mensurável.
2. **Telemetria desde o dia 1** — sem `layer_resolved` analytics, não aprendemos.
3. **Sem regressão clínica** — toda saída de L1/L2 passa por revisão do criador (Luiz Paulo) antes de ir a produção.
4. **Sem mudança de UI no caminho feliz** — usuário não precisa saber que existe arquitetura em camadas.
5. **Fallback seguro** — qualquer camada que falhe transfere para a próxima sem erro visível.

---

## Fase 0 — Trocar modelo LLM (mecânico, baixo risco)

**Escopo:** Substituir `gpt-4o-mini` por `gpt-4.1-mini` em ambos endpoints.

**Arquivos:**
- `api/gerar-laudo.ts` (linha do `model:`)
- `api/tira-duvidas.ts` (linha do `model:`)

**Validação:**
- Teste manual de 1 laudo BLUE e 1 pergunta no chat.
- Confirmar que `response_format: json_object` continua suportado em `gpt-4.1-mini` (sim).

**Saída:** PR único, commit `chore(llm): migrate to gpt-4.1-mini`.

**Status:** ⏳ A executar imediatamente após este plano.

---

## Fase 1 — L1 Determinístico

### 1.1 Motor de templating de laudo

**Objetivo:** Para o caminho "só chips + limitações + observações curtas", gerar `{extenso, objetivo}` 100% no device, sem chamada de rede.

**Arquitetura sugerida:**

```
src/services/laudo/
├── tipos.ts                    # Tipos compartilhados
├── motorL1.ts                  # gerarLaudoLocal(inputBruto): LaudoGerado | null
├── decisao.ts                  # devePassarParaL4(input): boolean
├── prosa/
│   ├── desambiguar.ts          # remove redundância de localização
│   ├── agruparAchados.ts       # agrupa "normal" bilateral, etc.
│   └── conectores.ts           # vocabulário clínico ("além disso", "associado a")
├── adapters/
│   ├── blue.ts                 # adapter BLUE (protótipo)
│   ├── efast.ts
│   ├── cardiac.ts
│   ├── rush.ts
│   ├── vexus.ts
│   └── obstetrico.ts
├── tecnica.ts                  # gera seção TÉCNICA
├── impressao.ts                # gera seção IMPRESSÃO
├── referencias.ts              # mapeia protocolo → top 2 refs (de referencias/artigos.ts)
└── disclaimer.ts               # constante
```

**Regra de roteamento (`decisao.ts`):**

Passa para L4 se **qualquer** das condições for verdadeira:
- `observacoes.length > 280`
- `observacoes` contém termos não-canônicos (heurística simples)
- usuário marcou flag "preciso de laudo extenso integrado" (futuro)

Caso contrário, gera local com L1.

**Output esperado por adapter:**
- `extenso`: 4 seções (TÉCNICA / ACHADOS / IMPRESSÃO / REFERÊNCIAS) + disclaimer.
- `objetivo`: parágrafo único `"POCUS [SIGLA] (data): ..."`.

**Critérios de aceitação L1:**
- 100% dos chips de cada protocolo cobertos.
- Saída lado a lado vs. `gpt-4.1-mini` indistinguível em **80%+** dos casos para revisor clínico (Luiz Paulo).
- Tempo médio < 50ms no device.
- Janelas vazias **omitidas**, nunca como "não avaliada".
- Sem redundância de localização (regra crítica do system prompt atual).

**Etapas (ordem):**

| # | Subtarefa | Arquivos | Estimativa |
|---|---|---|---|
| 1.1.1 | Criar tipos + esqueleto + decisao.ts | `services/laudo/tipos.ts`, `motorL1.ts`, `decisao.ts` | 1h |
| 1.1.2 | Adapter BLUE como protótipo | `adapters/blue.ts` + utilitários `prosa/*` | 3h |
| 1.1.3 | Integrar com `services/llmClient.gerarLaudo` (tenta L1, fallback L4) | `llmClient.ts` | 30min |
| 1.1.4 | Testes manuais comparativos BLUE — Luiz Paulo aprova | — | revisão clínica |
| 1.1.5 | Adapter eFAST | `adapters/efast.ts` | 2h |
| 1.1.6 | Adapter Cardíaco | `adapters/cardiac.ts` | 2h |
| 1.1.7 | Adapter RUSH | `adapters/rush.ts` | 2h |
| 1.1.8 | Adapter VExUS | `adapters/vexus.ts` | 2h |
| 1.1.9 | Adapter Obstétrico | `adapters/obstetrico.ts` | 2h |
| 1.1.10 | Telemetria PostHog `layer_resolved: "l1"` / `"l4"` | `utils/analytics.ts` + chamadores | 30min |

### 1.2 FAQ exata para tira-dúvidas

**Objetivo:** Responder perguntas exatas/quase-exatas sem chamada de rede.

**Arquitetura:**

```
src/services/duvidas/
├── tipos.ts
├── motorL1Duvidas.ts                  # buscarRespostaExata(pergunta): string | null
├── faq/
│   ├── index.ts                       # FAQ_CANONICA: FaqEntry[]
│   ├── pulmonar.ts
│   ├── cardiac.ts
│   ├── trauma.ts
│   ├── valores-ref.ts
│   ├── tecnica.ts
│   └── tags.ts                        # mapeamento keyword → entry
└── normalizador.ts                    # lowercase, sem acento, sem stopwords
```

**Estratégia de matching:**
- Normalização: lowercase, remove acentos/pontuação, stopwords PT-BR.
- 1ª passada: matching exato por hash → resposta direta.
- 2ª passada: matching por tags (cada FaqEntry tem `tags: string[]` e `keywords: string[]`).
- Falhou → entrega para L2.

**Quantitativo:**
- Curadoria inicial: **150 perguntas** canônicas (cobertura de baseline).
- Crescimento: novas perguntas que falharem em L1 e L2 e tiverem boa resposta em L4 viram candidatas para próxima release.

**Etapas:**

| # | Subtarefa | Arquivos | Estimativa |
|---|---|---|---|
| 1.2.1 | Esqueleto + tipos + normalizador | `services/duvidas/*` | 1h |
| 1.2.2 | Curadoria FAQ inicial (150 entradas) — usar NotebookLM como ferramenta de apoio | `faq/*.ts` | 8-12h (curadoria clínica) |
| 1.2.3 | Integrar com `tirarDuvida` (tenta L1, fallback L4) | `llmClient.ts` | 30min |
| 1.2.4 | Telemetria | — | 15min |

---

## Fase 2 — L2 Embedding semântico no device

**Objetivo:** Para perguntas reformuladas que escapam do matching exato.

**Decisão técnica:**
- **Caminho recomendado:** chamar endpoint barato de embedding (gpt-4.1 family ou `text-embedding-3-small`, ~US$ 0.00002/req) **apenas** para a pergunta do usuário. Embeddings das FAQs ficam pré-computados no bundle.
- **Caminho alternativo (avaliar):** MiniLM ONNX local via `onnxruntime-react-native` — 25MB extras no bundle, zero rede. Decidir após benchmark de iPhone 11.

**Arquivos:**
```
src/services/duvidas/
├── motorL2Duvidas.ts            # similaridadeCosseno + busca top-k
└── faq/embeddings.json          # { faqId: number[] } — gerado em build-time
scripts/
└── gerar-embeddings-faq.ts      # script Node — roda em build, popula embeddings.json
```

**Threshold:** similaridade ≥ 0.85 → resposta da FAQ; abaixo, vai para L3/L4.

**Etapas:**

| # | Subtarefa | Estimativa |
|---|---|---|
| 2.1 | Script de geração de embeddings em build-time | 2h |
| 2.2 | Integração no app (busca + threshold) | 2h |
| 2.3 | Bench de tempo no iPhone 11 (decidir local vs endpoint) | 1h |
| 2.4 | Telemetria L2 | 15min |

---

## Fase 3 — L3 Cache semântico server-side

**Objetivo:** Aprender com perguntas reais que chegam ao L4.

**Stack:** Upstash Redis (free tier suficiente no início).

**Arquivos:**
```
api/
├── lib/
│   ├── cache.ts                # get/set + TTL + similaridade
│   └── embedding.ts            # wrapper text-embedding-3-small
├── tira-duvidas.ts             # nova lógica: L3 → L4
└── gerar-laudo.ts              # L3 opcional para texto livre recorrente
```

**Fluxo:**
1. Recebe pergunta → gera embedding → busca top-k no Redis por similaridade (vetor armazenado).
2. Hit ≥ 0.85 → devolve resposta cacheada.
3. Miss → chama `gpt-4.1-mini` → grava `{embedding, pergunta, resposta, hits++}` no Redis com TTL 90 dias.

**Limpeza:** entradas com hits=1 e idade>30 dias são candidatas a poda. Entradas com hits>10 são candidatas a virar FAQ canônica (L1).

**Etapas:**

| # | Subtarefa | Estimativa |
|---|---|---|
| 3.1 | Setup Upstash + variáveis de ambiente Vercel | 30min |
| 3.2 | Implementar `cache.ts` + busca por similaridade | 3h |
| 3.3 | Integrar em `tira-duvidas.ts` | 1h |
| 3.4 | Dashboard simples (script CLI) — top hits, perguntas frequentes | 2h |
| 3.5 | Telemetria L3 | 15min |

---

## Fase 4 — L4 Endurecimento

Já é o estado atual com gpt-4.1-mini. Nesta fase:
- Reduzir tokens do system prompt (mover regras estáveis para fine-tune ou prompt cache).
- Adicionar `metadata` ao request com `layer_attempted` para análise.
- Considerar fine-tune quando volume mensal > 10k laudos.

---

## Telemetria — eventos novos

```
layer_resolved {
  fonte: 'gerar-laudo' | 'tira-duvidas',
  layer: 'l1' | 'l2' | 'l3' | 'l4',
  tempo_ms: number,
  protocolo?: string,
  motivo_fallback?: string  // só quando vai para L4
}
```

**Dashboard:** começar simples no PostHog free tier. Métrica chave: `(L1+L2+L3)/total`.

---

## Cronograma proposto

| Marco | O que entrega | Pré-requisito |
|---|---|---|
| M0 (hoje) | Modelo migrado para gpt-4.1-mini | — |
| M1 (semana 1) | L1 BLUE pronto, validado clinicamente | M0 |
| M2 (semana 2-3) | Demais 5 adapters L1 + FAQ inicial 150 entradas | M1 |
| M3 (semana 4) | L2 ativo (embeddings on-device ou via endpoint) | M2 |
| M4 (semana 5) | L3 ativo (Upstash) | M3 |
| M5 | Telemetria estabilizada, primeiro relatório de hit-rate | M4 |
| M6 | Iteração: FAQs novas alimentadas por dados reais | M5 |

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Templating L1 fica "robotizado" demais | Lado-a-lado obrigatório com gpt-4.1-mini antes de ativar; revisão clínica do criador |
| Curadoria de FAQ muito extensa | Versão MVP com 50 entradas; iterar por dados reais |
| Embeddings em build-time quebram CI | Script idempotente + checksum no JSON |
| Upstash custo escapa | Free tier (10k req/dia) cobre primeiros milhares de usuários; alertas configurados |
| Bug em L1 retorna laudo errado para usuário | Fallback transparente para L4 em qualquer exception |

---

## O que **não** fazer neste ciclo

- Não embutir SLM (Phi/Llama) — descartado em decisão arquitetural.
- Não usar Apple Foundation Models — adiar para 2027.
- Não criar UI nova para "modo offline" — invisível ao usuário.
- Não tocar em tela de `Resultado` (typewriter, tabs continuam iguais).
- Não mexer no design system.

---

## Como retomar este plano

```
"Leia docs/architecture.md e docs/plans/2026-04-27-llm-architecture-l1-l4.md.
Continue da próxima subtarefa não concluída."
```

---

## Log de execução

- **2026-04-27** — Plano criado. Próximo passo: Fase 0 (migração modelo).
