# Epic 02: Viral Intelligence
**Status:** Backlog
**Priority:** Alta — diferencial competitivo principal
**Squad:** squad-viral-intelligence

## Visão do Epic
A ferramenta que transforma profissionais de marketing em criadores de conteúdo estratégico.
Não é só "ver o que está viral" — é entender o porquê, prever o que vem por aí e ter um
briefing pronto para usar na marca na hora certa.

## User Stories

### Story 02.01: Viral Feed
**Como** profissional de marketing,
**Quero** ver os conteúdos mais virais do dia, semana e mês em YouTube, TikTok e Instagram,
**Para** ficar sempre atualizado sobre o que está funcionando nas redes sociais.

**Acceptance Criteria:**
- [ ] Feed com tabs: Hoje / Semana / Mês
- [ ] Filtro por plataforma (YouTube, TikTok, Instagram, Todos)
- [ ] Filtro por categoria (cultural, música, evento, comportamento, estética)
- [ ] Cards de trend com: thumbnail, título, plataformas, velocidade, relevância para marca
- [ ] Indicador de urgência (NOW / ESTA SEMANA / ESTE MÊS)
- [ ] Atualizado automaticamente toda segunda-feira + manualmente sob demanda

### Story 02.02: Why It Worked
**Como** profissional de marketing,
**Quero** entender o porquê cada conteúdo viralizou,
**Para** aprender e replicar os elementos que funcionam.

**Acceptance Criteria:**
- [ ] Botão "Por que viralizou" em cada trend do feed
- [ ] Análise mostra: gatilho emocional, elementos estruturais, contexto cultural, timing
- [ ] Linguagem simples e didática (não técnica)
- [ ] Fórmula de replicação sugerida
- [ ] "Risco se demorar" (o que acontece se usar depois do pico)

### Story 02.03: Trend Predictor
**Como** profissional de marketing,
**Quero** saber quais trends estão por vir com antecedência,
**Para** preparar conteúdo antes de todo mundo e surfar a onda no momento certo.

**Acceptance Criteria:**
- [ ] Seção "Próximas Trends" com previsões de 2-4 semanas à frente
- [ ] Eventos calendáricos já mapeados (Copa, eleições, Carnaval, Black Friday, etc.)
- [ ] Sinais fracos detectados (trends nascendo em nichos antes de escalar)
- [ ] Nível de confiança da previsão (baixo/médio/alto)
- [ ] Timeline de quando preparar o conteúdo

### Story 02.04: Trend Adapter — Brief para Minha Marca
**Como** profissional de marketing,
**Quero** receber um briefing pronto de como aplicar cada trend na minha marca específica,
**Para** não perder tempo pensando e ir direto para a criação.

**Acceptance Criteria:**
- [ ] Botão "Como usar na minha marca" em cada trend
- [ ] Brief gerado em < 15 segundos
- [ ] Brief inclui: conceito, formato sugerido, hook, direção visual, CTA
- [ ] Indica fit com a marca (score 0-10)
- [ ] Alerta se trend tem risco para a marca (política, polêmica, etc.)
- [ ] Botão direto "Criar este conteúdo" que alimenta o workflow de criação

### Story 02.05: Trend Alerts
**Como** profissional de marketing,
**Quero** ser notificado quando uma nova trend emergente é detectada,
**Para** agir rápido enquanto ainda é early adopter.

**Acceptance Criteria:**
- [ ] Notificação in-app quando trend emergente é detectada
- [ ] Urgência clara: "Esta trend vai durar X horas no pico"
- [ ] Configurável: usuário escolhe quais categorias receber alertas
- [ ] Máximo 2 alertas por dia para não poluir

## Dependências
- squad-brand-guardian (Brand Memory ativa para calcular relevância)
- Epic 09 (créditos)

## Definition of Done
- [ ] Viral Feed sendo atualizado semanalmente
- [ ] Análise "Why It Worked" funcionando
- [ ] Briefings de adaptação gerados em < 15s
- [ ] Integração com Creative Studio e Content Factory para criação direta
