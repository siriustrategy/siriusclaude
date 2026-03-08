# 🧠 Organização — Breno Nobre · Especialista em IA
**Empresa:** Plano Mais
**Data:** 2026-03-03
**Status:** Organização inicial (nada em execução ainda)

---

## 👤 MEU PAPEL

> **Especialista em IA & Omnichannel**
> Responsável por toda a frente de tecnologia inteligente da empresa:
> canais, automação, dados, sites e agentes de IA.

---

## 🗺️ MIND MAP — Visão Geral

```
BRENO · ESPECIALISTA EM IA
│
├── 🌐 OMNICHANNEL & CANAIS
│   ├── Landing Pages (LPs)
│   ├── Formulários (Forms)
│   ├── Sites
│   └── [futuro] Chatbot / Omnichannel HQ
│
├── 📊 DASHBOARDS & DADOS
│   ├── Dashboards internos
│   ├── Ferramentas: Looker / Power BI / SQL
│   └── Relatórios para liderança
│
├── 🤖 IA & AUTOMAÇÕES
│   ├── Agentes de IA
│   ├── Workflows automatizados
│   ├── Tasks automatizadas
│   └── Ferramentas: Dialogflow / Copilot Studio
│
├── 📚 TAREFAS IMEDIATAS (aprender/mapear)
│   ├── [T1] Entender 100% o TuoTempo
│   ├── [T2] Entender 100% o ELEV
│   └── [T3] Introduzir IA na empresa (organograma + mapeamento)
│
└── 🚨 PROJETO PRIORITÁRIO
    └── Projeto Inadimplência (automatizar cobrança)
```

---

## 🛠️ ABORDAGEM DE TRABALHO

### Como tudo será construído

**Regra principal:** Toda solução começa pelo **Claude Code + AIOS** antes de qualquer ferramenta externa.

```
FLUXO DE CONSTRUÇÃO
│
├── 1️⃣  CLAUDE CODE + AIOS (sempre primeiro)
│   ├── Criar squads de agentes customizados
│   ├── Desenvolver workflows autônomos
│   ├── Automatizações com código (Node.js / Python)
│   └── Integrações via API
│
└── 2️⃣  FERRAMENTAS EXTERNAS (quando necessário)
    ├── Looker / Power BI → visualização de dados
    ├── Dialogflow / Copilot Studio → agentes de voz/chat
    ├── RD Station / HubSpot → CRM
    └── Z-API / Twilio → disparos de mensagem
```

**Por quê essa ordem?**
- Mais controle e flexibilidade do que usar só ferramentas prontas
- Claude Code + AIOS permite criar soluções 100% customizadas
- Ferramentas externas entram apenas onde fazem mais sentido (BI, canais de mensagem, etc.)

---

## 🤖 SQUADS DE AGENTES & WORKFLOWS AUTÔNOMOS

### O que são Squads de Agentes
Grupos de agentes de IA especializados que trabalham juntos para executar tarefas complexas — cada agente tem um papel definido, como uma equipe real.

**Exemplos de squads que podem ser criados:**
- **Squad de Cobrança** → agente de detecção de inadimplência + agente de comunicação + agente de negociação
- **Squad de Atendimento** → agente de triagem + agente de resposta + agente de escalonamento
- **Squad de Dados** → agente de coleta + agente de análise + agente de relatório

### Como criar no AIOS
```bash
# Via Claude Code + AIOS
@squad-creator *criar-squad nome="cobrança"
# Ou usando o Squad Creator direto
/squad-creator
```

### Workflows Autônomos
Sequências de tarefas que rodam sozinhas, sem precisar de intervenção manual a cada passo.

**Exemplos:**
- Workflow de inadimplência: detecta → comunica → aguarda → escala → fecha
- Workflow de onboarding: recebe lead → valida dados → cria conta → envia boas-vindas
- Workflow de relatório: coleta dados → processa → gera dashboard → envia por e-mail

**Ferramentas para criar:**
1. **Claude Code + AIOS** → workflows em código (mais controle)
2. Ferramentas externas de automação → apenas quando o AIOS não for suficiente

---

## 📚 TAREFAS IMEDIATAS

### T1 — Aprender TuoTempo
**Objetivo:** Entender 100% como a ferramenta funciona
**Por quê:** Para analisar o que já estamos fazendo e o que a plataforma permite
**Resultado esperado:** Mapa de funcionalidades + oportunidades não exploradas

**Subtarefas a fazer:**
- [ ] Explorar todas as telas e funcionalidades
- [ ] Documentar o que usamos hoje
- [ ] Documentar o que NÃO usamos (mas poderíamos)
- [ ] Mapear se tem API disponível
- [ ] Identificar pontos de integração possíveis

---

### T2 — Aprender ELEV
**Objetivo:** Entender 100% como a ferramenta funciona
**Por quê:** Mesma razão — analisar uso atual vs potencial
**Resultado esperado:** Mapa de funcionalidades + oportunidades

**Subtarefas a fazer:**
- [ ] Explorar todas as telas e funcionalidades
- [ ] Documentar o que usamos hoje
- [ ] Documentar o que NÃO usamos (mas poderíamos)
- [ ] Mapear se tem API disponível
- [ ] Identificar pontos de integração possíveis

---

### T3 — Introduzir IA na Empresa
**Objetivo:** Mapear a empresa e identificar onde IA pode ajudar cada área
**Resultado esperado:** Relatório de oportunidades de IA por área/líder

**Subtarefas a fazer:**
- [ ] Fazer organograma da empresa (áreas + líderes)
- [ ] Entrevistar/mapear rotina de cada líder
- [ ] Identificar ferramentas de IA por função:
  - Vendas → IA para follow-up, prospecção
  - Financeiro → IA para NFs, conciliação, relatórios
  - RH/Ops → IA para onboarding, documentos
  - Marketing → IA para conteúdo, análise
  - Atendimento → Agentes de IA / chatbot
- [ ] Apresentar proposta de adoção para liderança

**Exemplos concretos a investigar:**
- Automatizar organização de notas fiscais
- IA dentro do Google Workspace (Gmail, Docs, Sheets)
- Agente para triagem de e-mails internos
- Dashboard automático com dados das ferramentas

---

## 🚨 PROJETO INADIMPLÊNCIA

**Objetivo:** Automatizar 100% da cobrança de planos
**Contexto:** Hoje é feita 100% manualmente pelo call center
**Meta:** Zero intervenção humana na cobrança padrão

### Visão do Projeto

```
PLANO MAIS
│
├── Cliente com plano vencido / inadimplente
│   │
│   ├── [HOJE]  → Call center liga manualmente ❌ caro / lento
│   │
│   └── [FUTURO] → Sistema automatizado:
│       ├── CRM detecta inadimplência
│       ├── Dispara sequência automática (WhatsApp / Email / SMS)
│       ├── Link de checkout abre direto pro pagamento
│       └── CRM atualiza status automaticamente ✅
```

---

### Tarefas do Projeto (ainda não iniciado)

#### FASE 1 — Fundação (CRM + Dados)
- [ ] **Escolher e implementar CRM**
  - Candidato: RD Station (tem API, integrável)
  - Alternativas: HubSpot, Pipedrive
  - Critérios: API aberta, integração WhatsApp, automação de fluxos
- [ ] Mapear de onde vêm os dados de clientes hoje (TuoTempo? Planilha? ELEV?)
- [ ] Definir como o CRM vai receber novos clientes automaticamente

#### FASE 2 — Checkout
- [ ] **Criar página de Checkout**
  - Link direto para pagamento do plano
  - Identificação automática do cliente (CPF/email)
  - Ao pagar → CRM atualiza status automaticamente
  - Tecnologias: gateway de pagamento (Stripe / PagSeguro / Asaas)

#### FASE 3 — Estratégia de Disparo
- [ ] **Desenhar fluxo de comunicação**
  - Dia 0 (vencimento): Lembrete amigável
  - Dia +3: Segundo lembrete + link de checkout
  - Dia +7: Aviso de risco de cancelamento
  - Dia +15: Última chance + oferta de negociação
  - Dia +30: Protocolo de cancelamento
- [ ] Escolher canais: WhatsApp (principal) + Email + SMS
- [ ] Definir ferramenta de disparo (ex: Twilio, Z-API, WPPConnect)

#### FASE 4 — Agentes de IA
- [ ] **Desenhar agente de cobrança**
  - Responde dúvidas sobre o plano
  - Negocia parcelas / desconto dentro de regras definidas
  - Escala para humano apenas em casos complexos
- [ ] Definir plataforma: Dialogflow / Copilot Studio / outra
- [ ] Integrar agente com CRM (lê e escreve dados)

---

### Stack Técnica (a definir)

| Componente | Candidato | Status |
|------------|-----------|--------|
| CRM | RD Station | A avaliar |
| Gateway de pagamento | Asaas / Stripe | A avaliar |
| Disparo WhatsApp | Z-API / Twilio | A avaliar |
| Agente de IA | Dialogflow / Copilot Studio | A avaliar |
| Checkout page | A definir | A criar |
| Dashboard de inadimplência | Power BI / Looker | A definir |

---

## 📅 SEQUÊNCIA SUGERIDA (quando for executar)

```
AGORA (aprender)
├── → Aprender TuoTempo
└── → Aprender ELEV

DEPOIS (planejar)
├── → Organograma da empresa
├── → Mapa de oportunidades de IA por área
└── → Definir CRM (decisão estratégica)

PROJETO (executar)
├── Fase 1: CRM + integração de dados
├── Fase 2: Página de checkout
├── Fase 3: Estratégia de disparo
└── Fase 4: Agente de IA de cobrança
```

---

## 🔧 FERRAMENTAS QUE APARECEM NO RADAR

| Ferramenta | Categoria | Uso |
|------------|-----------|-----|
| TuoTempo | Gestão | Ferramenta atual (a aprender) |
| ELEV | Gestão | Ferramenta atual (a aprender) |
| RD Station | CRM | Projeto Inadimplência |
| Claude Code + AIOS | **Base** | **Tudo começa aqui** |
| Squads AIOS | Agentes autônomos | Criação de squads customizados |
| Dialogflow | IA / Agente | Agente de cobrança (externo) |
| Copilot Studio | IA / Agente | Alternativa ao Dialogflow (externo) |
| Looker | BI | Dashboards (externo, após AIOS) |
| Power BI | BI | Dashboards (externo, após AIOS) |
| Google Workspace | Produtividade | IA para a empresa |

---

*Documento criado por Orion (AIOS Master) · 2026-03-03*
*Status: Organização inicial — nenhuma execução iniciada*
