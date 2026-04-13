# PlantaoUSG — Estudo de Identidade Emocional e Storytelling

**Data:** 2026-04-11
**Autor:** Estudo de Produto / Estratégia de Experiência
**Versão:** 1.0

---

## Prefácio: O que este documento é

Este estudo não trata de estética. Trata de psicologia de produto aplicada a um contexto extremo: médico em plantão noturno, exaustão cognitiva, pressão de vida ou morte, 30 segundos para registrar um achado antes de correr para o próximo leito.

O PlantaoUSG já tem os ingredientes certos: IBM Plex Mono, fundo #000000, borders #2A2A2A, animações de entrada com stagger. Isso é correto. O que falta é a camada que transforma ferramenta em parceiro. A camada que faz com que, às 4h da manhã, quando o médico abre o app pela centésima vez naquele mês, ele sinta algo além de utilidade. Sinta que esse objeto digital foi feito para ele, por alguém que entende o que é estar onde ele está.

Este documento propõe como construir essa camada — sem trair a austeridade que o produto exige.

---

## Estado Visual Atual: Diagnóstico

Leitura do código existente revela:

**Pontos fortes já presentes:**
- `bgPrimary: '#000000'` — não é #080808 nem #0A0A0A. É preto absoluto. Escolha correta: sem ambiguidade.
- `bgElevated: '#0A0A0A'` — o card existe em elevação quase imperceptível. Isso é sofisticado.
- `borderColor: '#2A2A2A'` nos cards — borda como sugestão, não como afirmação. Respeito ao espaço.
- Stagger de 80ms por card com `Easing.out(Easing.cubic)` — entrada que respeita a atenção do usuário sem ser performática.
- `withSpring(0.97, { damping: 15, stiffness: 300 })` no press — feedback físico discreto e correto.
- `letterSpacing: 3` na categoria — o espaçamento extremo faz o texto suspirar antes de ser lido.

**Lacunas identificadas:**
- `titulo: 'Plantão USG'` — genérico. Nome de diretório, não identidade.
- `subtitle: 'ULTRASSONOGRAFIA À BEIRA-LEITO'` — descritivo, não evocativo. Explica o que é mas não por que importa.
- `indicacao: 'EM BREVE'` nos cards desabilitados — placeholder frio, oportunidade desperdiçada.
- `opacity: 0.3` nos cards indisponíveis — correto funcionalmente, mas mudo emocionalmente.
- `Radius: { md: 8 }` nos cards — `borderRadius: 10` no StyleSheet está fora do sistema de tokens. Inconsistência menor mas presente.
- Ausência de qualquer copy com personalidade. A interface fala em termos técnicos mas não tem voz.

---

## 1. Conceito Central — Três Propostas

### Conceito A: "O Olho que Não Mente"

**Manifesto:**
A sonda de ultrassom é a extensão da mão de um médico que aprendeu a enxergar através da pele. O PlantaoUSG é a extensão da mente que processa o que os olhos captam. Quando tudo ao redor é caos — alarmes, familiares, enfermeiros, residentes — existe um momento de silêncio entre a sonda e a tela. O app vive nesse momento.

**Tradução em UX:**
- Copy: sem adjetivos. Nunca "excelente", "rápido", "fácil". Somente fatos. "Protocolo E-FAST iniciado. 6 janelas." Não "Você está pronto para começar!"
- Animações: lineares ou cubic-out. Nunca bounce. Nunca elastic. O olho não quica.
- Cores: o único acento permitido é branco puro. Nunca amarelo de alerta, nunca verde de sucesso celebratório. Branco: neutro, absoluto, clínico.
- Onboarding: primeira tela é uma instrução. Não uma boas-vindas.
- Estado de loading: sem spinner. Se há latência, o cursor pisca uma vez a cada segundo. Como um monitor cardíaco em repouso.

**Emoção primária evocada:** Confiança. O médico sente que o app não vai enganá-lo. O que está na tela é o que existe. Sem ornamento.

---

### Conceito B: "Clareza sob Pressão"

**Manifesto:**
Em medicina de emergência, a competência não é saber mais — é conseguir acessar o que você sabe quando está sob pressão máxima. O PlantaoUSG não ensina ultrassom. Assume que você já sabe. Assume que suas mãos são treinadas e sua mente está sobrecarregada. Existe para reduzir o custo cognitivo de registrar o que você já viu.

**Tradução em UX:**
- Hierarquia de informação radical: o que o médico precisa tomar uma ação fica em tamanho `display: 28px`. O que é contexto fica em `caption: 12px`. Não há meio-termo.
- Navegação: máximo dois toques para qualquer ação principal. Três toques é falha de design.
- Copy nos estados de erro: sem emojis, sem desculpas. "Sem conexão. Laudo salvo localmente. Sincronizará ao reconectar." Informação, não reconforto.
- Protocolo desabilitado: não "em breve". "Não disponível nesta versão." Seco, honesto, sem promessa implícita de timeline.
- O app nunca pergunta se o usuário tem certeza de algo. Confia na decisão do médico.

**Emoção primária evocada:** Competência. O médico usa o app e sente que sua própria competência foi amplificada, não substituída. O app é um bisturi, não uma muleta.

---

### Conceito C: "Plantonista" (recomendado — ver Seção 7)

**Manifesto:**
Há uma linguagem que só existe entre médicos de plantão. "O paciente do leito 4 é uma pesadona." "Esse E-FAST está ruim." "Chama o cirurgião." Frases curtas. Peso enorme. O PlantaoUSG fala essa língua. Não é um app de saúde genérico com a etiqueta de emergência colada. É uma ferramenta forjada no plantão, pelo plantão, para o plantão. Conhece o protocolo RUSH de cor. Sabe o que é uma janela acústica ruim. Não precisa explicar.

**Manifesto (versão curta, para uso interno):**
Feito por alguém que já estava acordado às 3h da manhã por obrigação. Para alguém que ainda está.

**Tradução em UX:**
- Terminologia: sempre a usada em UTI/emergência. "Janela subxifóidea", não "visão do coração por baixo". "Derrame pericárdico", não "líquido ao redor do coração".
- Copy da interface usa contrações e elipses que refletem a linguagem interna dos médicos: "Achados: —" (travessão como ausência, não "sem achados").
- O app sabe em que momento do dia o usuário está: cabecalho às 23h→7h exibe apenas o protocolo mais recente aberto — sem navegação desnecessária. Você acabou de acordar, você sabe o que precisa.
- Histórico de laudos apresentado como prontuário pessoal: "Você laudou 47 exames nos últimos 90 dias." Não "você usou o app 47 vezes".
- Quando o laudo é gerado, o copy não é "Laudo gerado com sucesso!" — é "Laudo disponível para revisão."

**Emoção primária evocada:** Pertencimento. O médico sente que o app foi feito para ele especificamente. Não para um "profissional de saúde" abstrato. Para alguém que conhece a diferença entre ecocardiografia de emergência e ecocardiografia convencional, e que essa diferença custa vidas.

---

## 2. Mascote ou Símbolo

### Proposta 1: O Ponto de Interrogação Nulo — ●

**Descrição:** O caractere ● (bala, bullet, ponto cheio) usado como elemento semântico. Não como decoração. Como sinal de estado ativo de leitura — o "olho aberto" do médico sobre o paciente.

**Aparece onde:**
- Antes do nome do protocolo ativo: `● E-FAST` — significa "em execução agora"
- No cursor do campo de observações: `● ` piscando a 1fps (lento, como respiração, não como ansiedade)
- No header quando há laudo gerado mas não revisado: `Plantão USG ●` — sinalizando atenção pendente sem urgência

**Como seria animado:** O ● do header pulsa com `opacity` entre 1.0 e 0.4, ciclo de 2 segundos. Não pisca — respira. Implementação: `withRepeat(withSequence(withTiming(0.4, {duration: 1000}), withTiming(1, {duration: 1000})), -1)`.

**Por que funciona no contexto dark/monospace:** O IBM Plex Mono tem o ● bem definido. Em fundo #000000, um ● branco com pulsação lenta é hipnótico na medida certa. Remete ao pulso do monitor, ao som do sonar do ultrassom. É tecnológico sem ser digital-decorativo.

---

### Proposta 2: A Linha de Varredura

**Descrição:** Uma linha horizontal de 1px de altura, #FFFFFF com opacity 0.15, que atravessa elementos de UI verticalmente do topo ao fundo em momentos específicos — loading de protocolo, geração de laudo. Como o feixe de varredura de um ultrassom.

**Aparece onde:**
- Durante o processamento do laudo pela IA: a linha varre a tela de cima para baixo uma vez, lentamente (800ms), depois o laudo aparece.
- Na tela inicial ao abrir o app pela primeira vez no dia: varredura única de orientação.

**Como seria animado:** `translateY` de `-screenHeight` a `+screenHeight` em 800ms com `Easing.linear`. Subtil o suficiente para ser subconsciente.

**Por que funciona:** A varredura é o gesto fundamental do ultrassom. O médico move a sonda e o feixe varre o tecido. O app espelhando esse gesto é uma continuidade do instrumento físico para o digital. Não precisa ser explicado — é sentido.

---

### Proposta 3: O Traço-Âncora — A Linha de 20px

**Descrição:** O `divisor` já existente no `ProtocoloCard` — `width: 20, height: 0.5, backgroundColor: '#2A2A2A'` — elevado a símbolo do produto. Essa linha aparece em todos os momentos de transição e separação semântica do app. Ela não é decorativa: é a marca do PlantaoUSG.

**Elevação proposta:**
- Cor: `#3A3A3A` (ligeiramente mais visível que o atual `#2A2A2A`)
- Aparece antes de seções de achados no laudador
- Aparece como separador entre laudo gerado e assinatura
- Usada consistentemente como elemento tipográfico de pausa — como o travessão em literatura

**Por que funciona:** O elemento já existe no código. Elevar sua consciência semântica é zero custo de implementação e cria continuidade visual sistêmica. A linha de 20px é pequena o suficiente para ser humilde mas consistente o suficiente para ser reconhecível.

**Recomendação:** Combinar Proposta 1 (●) com Proposta 3 (traço-âncora). O ● como símbolo ativo, o traço como elemento estrutural recorrente.

---

## 3. Storytelling de Onboarding

**Premissa de design:** O onboarding do PlantaoUSG não explica o que o app faz. O médico que chega aqui já sabe o que é POCUS. O onboarding estabelece o contrato entre o app e o usuário. Três telas. Máximo 40 palavras por tela.

---

### Tela 1 — Declaração de Propósito

```
╔════════════════════════════════════╗
║                                    ║
║                                    ║
║          Plantão USG               ║
║          ──────────────            ║
║                                    ║
║   Para o médico que não tem        ║
║   tempo a perder.                  ║
║                                    ║
║   Registre achados de POCUS        ║
║   e gere laudos estruturados       ║
║   em segundos.                     ║
║                                    ║
║   Nada mais.                       ║
║                                    ║
║                                    ║
║          [ CONTINUAR ]             ║
║                                    ║
╚════════════════════════════════════╝
```

**Emoção evocada:** Alívio de reconhecimento. "Finalmente algo que não me trata como idiota." A frase "nada mais" é o coração da tela. Ela diz: eu sei que você está ocupado. Eu sei que você não quer onboarding.

**Tom:** Declarativo. Sem ponto de exclamação. Sem promessa de transformação.

---

### Tela 2 — Contrato de Uso

```
╔════════════════════════════════════╗
║                                    ║
║   Como funciona:                   ║
║   ──────────────                   ║
║                                    ║
║   1. Selecione o protocolo.        ║
║   2. Registre os achados.          ║
║   3. Revise o laudo gerado.        ║
║   4. Assine.                       ║
║                                    ║
║   O laudo é uma sugestão.          ║
║   A responsabilidade é sua.        ║
║   Como sempre foi.                 ║
║                                    ║
║                                    ║
║          [ CONTINUAR ]             ║
║                                    ║
╚════════════════════════════════════╝
```

**Emoção evocada:** Respeito pela autonomia. "O laudo é uma sugestão. A responsabilidade é sua." Esta frase é diferente de qualquer disclamer jurídico genérico. Ela fala ao médico como colega, não como usuário de software. Diz: eu sei que você é o profissional aqui. Eu sou a ferramenta.

**Tom:** Igualitário. A frase "como sempre foi" fecha com peso emocional genuíno. Não há nada novo no fato de que médicos são responsáveis por seus pacientes. O app apenas reconhece isso em voz alta.

---

### Tela 3 — Início sem cerimônia

```
╔════════════════════════════════════╗
║                                    ║
║                                    ║
║                                    ║
║                                    ║
║         Identificação              ║
║         ──────────────             ║
║                                    ║
║   CRM (opcional)                   ║
║   ┌──────────────────────────┐     ║
║   │ _                        │     ║
║   └──────────────────────────┘     ║
║                                    ║
║   Usado apenas para assinar        ║
║   laudos. Não há cadastro.         ║
║                                    ║
║          [ COMEÇAR ]               ║
║          [ Pular por enquanto ]    ║
║                                    ║
╚════════════════════════════════════╝
```

**Emoção evocada:** Confiança mútua. "Não há cadastro." É uma declaração de respeito à privacidade que vai na direção oposta a todo SaaS de saúde existente. O médico entende imediatamente: este app não quer meus dados. Quer me ajudar.

**Tom:** Transparente. O campo é opcional. O botão "Pular por enquanto" usa "por enquanto" — deixa a porta aberta sem insistir.

**Nota de implementação:** Se o médico pular o CRM, o laudo ainda pode ser gerado mas aparece com `[assinatura pendente]`. Isso cria tensão saudável sem bloqueio.

---

## 4. Micro-Copy com Personalidade

A voz do PlantaoUSG é: **intensivista experiente que fala rápido, usa jargão correto, não enfeita, e respeita quem ouve.**

Não é rude. É preciso. Como uma prescrição bem escrita.

---

### Estado vazio de janelas de POCUS

**Atual (provável):** `Sem alteração` ou `—`

**Proposto:** `—` (apenas o travessão)

**Justificativa:** O travessão em laudos médicos significa "não avaliado" ou "dentro da normalidade dependendo do contexto". O médico sabe o que significa. Escrever "sem alteração" é redundante. O travessão é mais honesto — diz "nada foi inserido aqui", que pode significar normal, não examinado, ou intencional. O médico decide. O app não decide por ele.

**Alternativa para campos que precisam de mais contexto:** `não examinado` — em minúsculas, sem ponto. É um estado, não uma frase.

---

### Placeholder do campo de observações

**Atual (provável):** `Adicione observações...` ou `Observações adicionais`

**Proposto:** `achados adicionais, técnica, limitações`

**Justificativa:** Três categorias de informação que um médico experiente naturalmente quer registrar mas que laudos automáticos frequentemente omitem. O placeholder não é instrução — é memória. Lembra o médico do que pode querer adicionar. Sem artigos, sem verbos. Lista como prontuário.

---

### Mensagem de erro de rede

**Atual (provável):** `Erro de conexão. Tente novamente.` ou algo genérico.

**Proposto:**
```
Sem conexão.
Laudo salvo localmente.
Sincroniza automaticamente.
```

**Justificativa:** Três linhas, três fatos. Nenhuma promessa de quando vai funcionar. Nenhuma desculpa. Nenhum emoji de nuvem com raio. O médico precisa saber: (1) o problema, (2) que seus dados estão seguros, (3) que vai se resolver sem intervenção. Esse copy entrega as três informações em quatro palavras cada.

**Nota:** "Sincroniza automaticamente" — sem "quando possível", sem "em breve". O presente simples expressa certeza funcional.

---

### Título da tela de resultado do laudo

**Atual (provável):** `Laudo Gerado` ou `Seu Laudo`

**Proposto:** `Laudo disponível`

**Justificativa:** "Gerado" é passivo-técnico. "Seu" é possessivo e condescendente num contexto médico. "Disponível" é funcional e neutro — o laudo existe e pode ser acessado. Implica ação necessária do médico (revisão, assinatura) sem exigir.

**Variante com ●:** `● Laudo disponível` — o ● indica que há algo que precisa de atenção. Consistente com o sistema de símbolos proposto.

---

### Footer / créditos

**Atual:** `Parceria LaudoUSG →`

**Análise:** O copy atual funciona como call-to-action comercial disfarçado de footer. Isso é correto estrategicamente mas a seta `→` parece UI, não copy. O médico pode confundir com navegação.

**Proposto:** `PlantaoUSG · LaudoUSG` — ponto médio como separador. Sem seta. Sem "parceria". A presença de ambos os nomes juntos comunica a relação sem precisar nomear. Quem sabe, sabe. Quem não sabe, não precisa.

**Alternativa se o link precisa ser clicável:** `Desenvolvido com LaudoUSG` — em `textMuted` (#525252), menor. Não compete com nada.

---

### Copy dos cards desabilitados

**Atual:** `EM BREVE`

**Proposto:** `em desenvolvimento`

**Justificativa:** "EM BREVE" em caixa alta parece marketing. "em desenvolvimento" em caixa baixa parece honestidade. A diferença é psicológica: "EM BREVE" cria expectativa e pode frustrar. "em desenvolvimento" diz que é um processo, não uma promessa de data.

**Alternativa mais crua:** Apenas `—` (mesmo travessão dos campos vazios). Consistência semântica: o travessão significa "não disponível agora". Mais austero, talvez austero demais para um card inteiro.

---

### Header da tela inicial

**Atual:** `Plantão USG` / `ULTRASSONOGRAFIA À BEIRA-LEITO`

**Proposto — título:** `PlantaoUSG` (sem espaço — trata-se de um nome próprio, não duas palavras)

**Proposto — subtítulo:** `POCUS · LAUDOS · EMERGÊNCIA`

**Justificativa:** O subtítulo atual descreve a tecnologia. O proposto descreve o contexto de uso. Três palavras em caixa alta com ponto médio — formato de especificação técnica, não slogan. O médico vê as três palavras e pensa: "sim, é exatamente isso que estou fazendo aqui."

---

## 5. Momentos Emocionais na Jornada

### Momento 1: Primeiro laudo gerado

**Qual o momento:** Médico completa o preenchimento do protocolo pela primeira vez e toca em "Gerar laudo".

**O que acontece atualmente:** Provavelmente transição de tela com resultado textual.

**O que poderia acontecer:**
1. A tela de resultado não aparece de uma vez. O laudo se materializa linha por linha de cima para baixo, em velocidade de leitura confortável (aproximadamente 30 palavras por segundo). Não é efeito de "digitação" — cada linha simplesmente existe com `opacity: 0` e faz `withDelay` escalonado.
2. Vibração curta e precisa: um pulso de 40ms quando o laudo completa a renderização. Não é celebração. É confirmação física. Como o clique de um stethoscope colocado sobre a mesa.
3. O copy abaixo do laudo: `Revise antes de assinar.` — não "parabéns", não "laudo gerado com sucesso". Uma instrução. Porque o médico sabe que laudos de IA precisam ser revisados.

**Por que importa:** O primeiro laudo é o momento em que o médico decide se vai confiar no app. Se o resultado aparecer abruptamente, parece um sistema antigo. Se aparecer com materialização gradual, parece inteligência processando. O haptic de confirmação cria memória muscular — o médico vai associar aquela vibração a "laudo pronto" e responder a ela automaticamente.

---

### Momento 2: Abertura do app às 3h da manhã (décima vez no mês)

**Qual o momento:** Usuário recorrente abre o app no meio da madrugada.

**O que acontece atualmente:** Tela inicial normal. Stagger de cards.

**O que poderia acontecer:**
O app detecta que são 23h-6h e que o usuário tem histórico de uso. O header não exibe todos os protocolos imediatamente — exibe apenas o último protocolo usado (ou os dois mais usados pelo usuário) em destaque, com o resto em `opacity: 0.4`. Ao primeiro scroll, os outros aparecem.

Isso não é personalização invasiva. É reconhecimento de contexto. O app diz silenciosamente: "você está cansado. Sei o que você geralmente precisa. Aqui está."

**Implementação:** `AsyncStorage` com timestamp do último protocolo usado. Se hora atual entre 23h-6h, reordena o array `TODOS` colocando o último usado em primeiro, com um flag `highlighted: true` que aplica `opacity: 1` ao invés de 1 normal para os outros (que ficam em 0.5).

**Por que importa:** Reconhecimento sem necessidade de configuração. O médico nunca pediu personalização. O app simplesmente aprendeu. Isso é o oposto de um app que pede para você personalizar sua experiência. É um colega que lembra o que você pede.

---

### Momento 3: Achado crítico registrado

**Qual o momento:** Médico marca uma janela com achado significativo — derrame pericárdico, pneumotórax, ausência de sliding pleural, IVC colabada.

**O que acontece atualmente:** Provavelmente o campo é preenchido e nada especial acontece.

**O que poderia acontecer:**
Quando um achado de alta gravidade é registrado (definido por uma lista de strings-gatilho nas respostas do laudador), a borda do card do achado muda de `#2A2A2A` para `#4A4A4A` — apenas ligeiramente mais brilhante. Não vermelho. Não amarelo. Apenas mais presente.

Ao gerar o laudo, se há achados críticos, o título muda de `● Laudo disponível` para `● Laudo com achados críticos. Revise com atenção.`

**Sem alarme. Sem cor vermelha. Apenas mais peso.**

**Por que importa:** O médico de UTI convive com alertas vermelhos o dia inteiro. Um alerta vermelho no app seria ruído. Mas um leve aumento de presença visual — a borda ligeiramente mais brilhante — é percebido subconscientemente como gravidade sem criar ansiedade artificial. É a diferença entre gritar e falar mais devagar.

---

### Momento 4: Reabertura de laudo antigo

**Qual o momento:** Médico vai ao histórico, abre um laudo de três semanas atrás do mesmo paciente.

**O que acontece atualmente:** Provavelmente exibe o laudo.

**O que poderia acontecer:**
No topo do laudo histórico, em `textMuted` (#525252), aparece o contexto:
```
E-FAST · 14 mar 2026 · 02:47
```
Protocolo, data, horário. Sem mais. O médico que laudou às 02:47 sabe o que estava acontecendo naquele momento. Não precisa de mais contexto. A hora é o contexto.

**Por que importa:** Timestamp de madrugada em um laudo de emergência carrega peso emocional real. "02:47" diz: havia urgência. O médico que vê isso semanas depois se lembra do plantão. O app cria uma narrativa clínica pessoal — não por design explícito, mas por precisão de dados.

---

### Momento 5: Centésimo laudo

**Qual o momento:** Médico gera seu 100º laudo no app.

**O que acontece atualmente:** Nada.

**O que poderia acontecer:**
Nada na hora. Zero fanfarra. Zero notificação.

Na próxima abertura do app (no dia seguinte, ou em 6 horas), uma única linha aparece abaixo do header, em `textMuted` (#525252), tamanho `micro: 10`:

```
100 exames laudados.
```

Não "parabéns por 100 exames!", não "você é um especialista!". Apenas o fato. Depois de 5 segundos, desaparece. Não volta.

**Por que importa:** Médicos de UTI são treinados para desconfiar de eufemismos e exageros. Um "parabéns" por usar um app parece infantil. Mas um fato — "100 exames laudados" — tem peso diferente. É evidência de prática. É portfólio. O médico olha para aquilo e pensa: "100 exames. Isso é significativo." O app não precisa dizer que é significativo. O médico sabe.

---

## 6. Retenção e Recorrência

A premissa é: **o app não deve tentar criar hábito. Deve ser bom o suficiente para que o hábito se forme naturalmente.** A tentação de adicionar streaks, notificações e badges é real e completamente errada para este contexto. Um médico que recebe uma notificação push às 2h da manhã dizendo "você não laudou hoje!" vai deletar o app.

---

### Mecanismo 1: O Portfólio Clínico Silencioso

**O que é:** A tela de histórico não é apenas uma lista de laudos. É um registro clínico pessoal. Ao longo do tempo, acumula evidência de prática.

**Como funciona:**
- Histórico exibe total de exames por protocolo: `E-FAST: 34 · Blue Protocol: 12 · RUSH: 8`
- Estatística de achados mais frequentes: `Derrame pleural: 8 ocorrências nos últimos 90 dias`
- Não é gamificação. É epidemiologia pessoal. O médico pode usar isso para refletir sobre a casística do seu serviço.

**Por que retém:** Nenhum outro lugar guarda esse dado. O prontuário eletrônico do hospital não consolida "laudos de POCUS do Dr. X". Esse app guarda. O médico não vai deletar o repositório da sua prática.

---

### Mecanismo 2: A Assinatura como Identidade

**O que é:** O laudo gerado pelo app inclui o CRM do médico, data e hora. Isso cria uma assinatura digital — informal, mas consistente.

**Como retém:**
- Quando o médico imprime ou compartilha um laudo, o rodapé tem: `PlantaoUSG · CRM [número] · [data] [hora]`
- Com o tempo, colegas que recebem esses laudos reconhecem o formato. "Esse laudo é do sistema do Plantão USG." O app se torna identidade profissional.
- Compartilhamento de laudo é mecanismo de distribuição orgânica. O médico que recebe um laudo formatado pergunta de onde veio.

**Por que retém:** Identidade profissional é poderosa. Se o app virar o padrão de laudos de POCUS de um serviço, o médico não abandona porque seria abandonar a identidade do serviço.

---

### Mecanismo 3: O Protocolo como Referência

**O que é:** Dentro de cada protocolo do laudador, há uma seção de referência clínica — os valores de corte, as definições, os critérios diagnósticos. Não é tutoriais. É tabela de referência rápida.

**Exemplo:** No Blue Protocol, antes de registrar os achados, o médico pode deslizar para ver:
```
Perfil A: sem B-lines predominantes → pneumonia improvável
Perfil B: B-lines difusas → edema pulmonar
Perfil C: consolidação anterior → pneumonia
```

**Por que retém:** Mesmo o médico experiente às vezes quer confirmar um critério. Se o app é o lugar mais rápido para encontrar isso, ele abre o app. Mesmo quando não está laudando. Isso cria abertura do app fora do contexto de uso primário — e cria o hábito de associar "preciso de referência de POCUS" com "abrir PlantaoUSG".

---

## 7. Recomendação Final: Conceito Escolhido e Roadmap Emocional

### Conceito Recomendado: "Plantonista"

**Por que este conceito:**

Os três conceitos propostos não são mutuamente excludentes. "O Olho que Não Mente" define a filosofia visual. "Clareza sob Pressão" define a filosofia de UX. Mas "Plantonista" define a **voz** — e voz é o que cria identidade emocional de longo prazo.

O medical device clássico tem UX de "Clareza sob Pressão". O sistema hospitalar tem UX de "O Olho que Não Mente". O que nenhum deles tem é uma voz que fale como médico para médico.

"Plantonista" pressupõe fluência. Não explica o que é uma sonda. Não celebra quando você termina uma tarefa. Usa o jargão correto sem aspas. Trata o usuário como par.

Isso é diferenciador real. E é sustentável — porque é verdade. O app foi feito por quem conhece o contexto. A voz deve refletir isso.

**Princípios do conceito "Plantonista" para guiar decisões:**
1. Nunca use um adjetivo onde um substantivo serve.
2. Nunca celebre o óbvio.
3. Use terminologia clínica sem glossário.
4. O silêncio é comunicação: um travessão diz mais que "sem alteração".
5. Timestamp é narrativa: 03:17 conta uma história.

---

### Símbolo Recomendado

**Combinação: ● (ponto ativo) + traço de 20px (âncora estrutural)**

O ● em contextos de estado ativo/atenção pendente. O traço de 20px como separador semântico recorrente em todos os contextos de laudos, protocolos e resultados. Dois elementos simples, coerentes com IBM Plex Mono, sem custo de novos assets.

---

### Roadmap Emocional — 3 Fases

#### Fase 1: Copy e Micro-copy (Sem código novo, apenas strings)

**Duração estimada:** 1-2 dias de trabalho
**Impacto:** Alto. Copy é a camada mais direta de identidade.

Mudanças específicas:

| Local | De | Para |
|-------|----|----|
| `Header title` | `Plantão USG` | `PlantaoUSG` |
| `Header subtitle` | `ULTRASSONOGRAFIA À BEIRA-LEITO` | `POCUS · LAUDOS · EMERGÊNCIA` |
| `Card desabilitado` | `EM BREVE` | `em desenvolvimento` |
| `Campo de observações placeholder` | *(genérico)* | `achados adicionais, técnica, limitações` |
| `Laudo gerado título` | *(genérico)* | `● Laudo disponível` |
| `Erro de rede` | *(genérico)* | `Sem conexão.\nSalvo localmente.\nSincroniza automaticamente.` |
| `Footer` | `Parceria LaudoUSG →` | `PlantaoUSG · LaudoUSG` |
| `Estado vazio de janela` | `Sem alteração` ou vazio | `—` |
| `Nav link histórico` | `HISTÓRICO` | `LAUDOS` (mais direto ao ponto) |
| `Copy de laudo com achado crítico` | *(genérico)* | `● Laudo com achados críticos. Revise com atenção.` |

**Onboarding:** Implementar as 3 telas propostas na Seção 3.

---

#### Fase 2: Símbolo + Momentos-Chave Animados

**Duração estimada:** 1-2 semanas de desenvolvimento
**Impacto:** Médio-alto. Cria memória emocional nos momentos de maior impacto.

Implementações específicas:

1. **● no header com pulsação** quando há laudo não revisado.
   - `withRepeat(withSequence(withTiming(0.4, {duration: 1000}), withTiming(1, {duration: 1000})), -1)`
   - Aparece apenas quando há ação pendente. Não como ornamento permanente.

2. **Materialização de laudo linha por linha:**
   - Array de linhas do laudo
   - `withDelay(index * 50, withTiming(1, {duration: 200}))` por linha
   - Haptic de 40ms ao completar

3. **Linha de varredura ao processar laudo:**
   - `translateY` de `-height` para `+height` em 800ms, `Easing.linear`
   - `opacity: 0.1` — quase invisível, mas perceptível
   - Aparece apenas uma vez, durante o processamento

4. **Traço de 20px elevado a #3A3A3A** em todos os contextos de laudo e protocolo.

5. **Context-aware header:** Se hora entre 23h-6h e usuário tem histórico, destacar último protocolo usado.

---

#### Fase 3: Onboarding + Retenção

**Duração estimada:** 2-3 semanas de desenvolvimento
**Impacto:** Baixo a médio no curto prazo, alto no longo prazo.

Implementações específicas:

1. **Onboarding de 3 telas** (ver Seção 3) para first-time users:
   - Detecção de primeiro uso via `AsyncStorage`
   - Sem animações excessivas — fade simples entre telas
   - Campo de CRM opcional salvo localmente

2. **Portfólio clínico na tela de histórico:**
   - Contador de exames por protocolo
   - Timestamp exibido no formato `HH:mm · DD MMM YYYY`
   - Sem gráficos, sem dashboards — apenas números

3. **Milestone silencioso dos 100 laudos:**
   - Exibir uma vez, 5 segundos, `textMuted`, sumir para sempre

4. **Referência clínica in-protocol:**
   - Tab ou drawer dentro de cada protocolo com critérios diagnósticos
   - Navegação zero-clique para quem sabe o que quer

5. **Assinatura do laudo:**
   - Rodapé padronizado: `PlantaoUSG · CRM [nro] · [timestamp]`
   - Formato copiável/compartilhável consistente

---

## Apêndice A: Vocabulário Proibido

Palavras e frases que nunca devem aparecer no PlantaoUSG:

| Proibido | Por que | Alternativa |
|----------|---------|-------------|
| "Parabéns!" | Condescendente | (silêncio) ou fato neutro |
| "Seja bem-vindo!" | Genérico demais | Instrução direta |
| "Fácil e rápido" | Promessa de marketing | (não mencionar) |
| "Seu laudo" | Possessivo infantil | "o laudo" ou apenas "Laudo" |
| "Em breve!" | Promessa sem compromisso | "em desenvolvimento" |
| "Tente novamente" | Passivo | Informação do estado atual |
| "Sucesso!" | Celebração de ação trivial | Fato confirmado |
| "Olá, Dr. [nome]" | Intimidade artificial | (sem saudação) |
| "Você fez X vezes" | Gamificação | "X exames laudados" |
| "Não se preocupe" | Patronizing | Informação objetiva |

---

## Apêndice B: Vocabulário Recomendado

Termos e construções que reforçam a voz "Plantonista":

| Contexto | Usar |
|----------|------|
| Confirmação | "disponível", "registrado", "salvo" |
| Instrução | "revise", "selecione", "registre" |
| Estado vazio | `—` (travessão) |
| Erro | Problema + fato do estado + o que vai acontecer |
| Timestamp | `HH:mm` em primeiro lugar — hora é o contexto mais importante |
| Achados | Terminologia ICD/POCUS sem adaptação leiga |
| Protocolo | Nome técnico completo: "E-FAST", "Blue Protocol", "RUSH" |
| Navegação | Verbos de ação médica: "laudar", "registrar", "revisar" |

---

## Apêndice C: Referências de tom

Para calibrar a voz do PlantaoUSG durante a escrita de copy, as referências certas são:

**Correto:**
- Manual de terapia intensiva — linguagem direta, sem ornamento
- Prescrição médica — ação + dose + via + frequência. Zero adjetivo.
- Relatório de caso clínico — fatos em sequência, sem interpretação emocional explícita

**Incorreto:**
- App de fitness ("Você está arrasando!")
- SaaS de produtividade ("Simplifique seu fluxo de trabalho!")
- App de meditação ("Respire. Você consegue.")
- Qualquer coisa com ponto de exclamação em estado de sucesso

---

*Documento gerado em 2026-04-11 como parte do estudo de identidade emocional e estratégia de produto do PlantaoUSG.*
