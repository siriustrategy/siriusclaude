# Projeto Inadimplência — Plano Mais
## Product Requirements Document (PRD)
**Versão:** 1.0
**Data:** 2026-03-09
**Autor:** Orion (AIOS Master) — Sirius Strategy
**Status:** Aprovado para desenvolvimento

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-09 | 1.0 | Versão inicial aprovada | Orion / Breno Nobre |

---

## 1. Goals and Background Context

### 1.1 Goals

- Automatizar 100% do processo de cobrança da Plano Mais, da pré-vencimento ao diagnóstico pós-D+150
- Implementar agente IA no WhatsApp que converte inadimplentes em pagadores, tirando dúvidas e oferecendo benefícios
- Criar dashboard centralizado para gestores e atendentes com visão completa do pipeline de cobrança
- Disponibilizar CRM rico por lead: dados pessoais, histórico de interações, score de reputação e risco de churn
- Implementar sistema de campanhas manuais com personalização via IA baseada em dados do CRM
- Oferecer análise financeira detalhada com insights de IA, custo de operação e projeção de receita recuperável
- Criar página de checkout via Asaas com valor regularizado, descontos por fase e opções de parcelamento
- Construir base multi-canal (WhatsApp hoje, Email/RCS no futuro) com arquitetura extensível

### 1.2 Background Context

A Plano Mais Assistencial possui um processo de cobrança realizado por call center e atendentes humanos via WhatsApp. O volume de inadimplentes é expressivo e o processo manual é lento, inconsistente e caro. Já existe uma régua de cobrança bem definida (7 fases, 150 dias, descontos progressivos de 0% a 20%) e dois playbooks documentados — um para automações e um para atendentes humanos — que serão a base de toda a lógica do sistema.

O Projeto Inadimplência nasce para digitalizar e automatizar esse processo de ponta a ponta: um bot no WhatsApp cuida da régua automática, os atendentes humanos entram apenas quando necessário, gestores têm visão total do pipeline, e a IA enriquece tudo com personalização baseada em dados do CRM (ex: lead com filhos recebe mensagem sobre pediatras do plano). O resultado esperado é aumento significativo na taxa de recuperação de inadimplentes, redução do custo operacional e rastreabilidade completa do processo.

---

## 2. Requisitos Funcionais (FR)

### Autenticação e Perfis

- **FR01:** O sistema deve suportar dois perfis de acesso: **Gestor** (acesso total) e **Atendente** (acesso restrito a chat, CRM e informações básicas)
- **FR02:** Login via email + senha com autenticação segura (Supabase Auth)
- **FR03:** Gestores podem criar, editar e desativar contas de atendentes
- **FR04:** Atendentes têm perfil de atuação: A (negociação), B (retenção) ou C (diagnóstico/empatia)
- **FR05:** Sistema de notificações in-app: atendentes e gestores recebem alertas em tempo real dentro do dashboard

### CRM — Gestão de Leads

- **FR06:** Cada lead tem ficha completa: nome, telefone, email, CPF, plano, valor mensalidade, data vencimento, status, dias de atraso, valor em aberto
- **FR07:** Dados pessoais enriquecidos: idade, cidade, bairro, tem pet, tem dependentes, número de dependentes, profissão
- **FR08:** Sistema de notas manuais: atendentes e gestores podem adicionar notas a qualquer momento
- **FR09:** Tags por lead (ex: "tem filhos", "dificuldade financeira", "quer cancelar", "sênior")
- **FR10:** Histórico completo de interações: todas as mensagens trocadas (bot e humanos), com timestamp e remetente
- **FR11:** Score de Reputação (0–100): calculado com base no histórico de pagamentos, tempo de atraso e comportamento
- **FR12:** Score de Risco de Churn: classificado como baixo/médio/alto, com fatores explicativos visíveis
- **FR13:** Busca e filtros avançados: por status, fase de cobrança, score, atendente, período, tags
- **FR14:** Importação de leads via planilha (CSV/XLSX) com mapeamento de campos
- **FR15:** Exportação de leads e dados em CSV para análise externa

### Motor de Cobrança (Régua Automática)

- **FR16:** Implementação da régua de 7 fases conforme playbook:
  - Fase 0 (PRÉ): D-3 e D-0 — 0% desconto
  - Mês 1: D+1 a D+30 — 0% desconto
  - Mês 2: D+31 a D+60 — 0% desconto
  - Mês 3: D+61 a D+90 — 5% desconto (48h de validade)
  - Mês 4: D+91 a D+120 — 15% desconto + parcelamento até 3x
  - Mês 5: D+121 a D+150 — 20% desconto (não acumula)
  - Pós D+150: Diagnóstico com 6 fluxos de encerramento
- **FR17:** Cálculo automático diário de dias_atraso e fase_atual por lead
- **FR18:** Regras de anti-abuso: desconto de fase anterior não acumula; Mês 3 tem validade de 48h
- **FR19:** Atendente do perfil correto é sugerido/notificado conforme a fase do lead
- **FR20:** Gestor pode configurar parâmetros da régua (percentuais, prazos) via painel admin
- **FR21:** Registro auditável de todos os descontos concedidos (quem aprovou, quando, valor)

### n8n — Automações (6 Workflows)

- **FR22:** **WF1 — Scheduler Diário:** Executa às 08:00, recalcula dias_atraso e fase de todos os leads ativos, distribui para demais workflows
- **FR23:** **WF2 — Disparo por Fase:** Monta contexto com dados do CRM, personaliza mensagem via template, dispara via WhatsApp API no horário ótimo do lead
- **FR24:** **WF3 — Agente Conversacional:** Recebe respostas do lead, detecta intenção via LLM (pagar/duvida/cancelar/silencio/problema), executa árvore de decisão, escalona para atendente quando necessário
- **FR25:** **WF4 — Receptor de Pagamentos:** Webhook Asaas, atualiza status do lead no Supabase, notifica atendente/gestor no dashboard, registra pagamento e desconto utilizado
- **FR26:** **WF5 — Campanhas Manuais:** Recebe segmentação e template, personaliza por lead via IA, dispara em lotes de 50 com intervalo para evitar bloqueio do WhatsApp
- **FR27:** **WF6 — Diagnóstico Pós-D+150:** Encerra processo de cobrança, coleta motivo, aplica tag de encerramento, atualiza status, registra para análise
- **FR28:** Todos os workflows registram custo estimado de cada operação (disparo, LLM call, webhook) na tabela de custos

### Agente IA WhatsApp

- **FR29:** Agente responde automaticamente às mensagens do lead usando contexto do CRM (nome, plano, fase, valor, dados pessoais)
- **FR30:** Personalização profunda: leads com filhos recebem mensagens sobre pediatras; leads com pets sobre veterinários; etc.
- **FR31:** Árvore de decisão baseada na intenção detectada:
  - "vou pagar" → link de checkout + confirmação
  - "dúvida sobre plano" → responde com benefícios
  - "quero cancelar" → dispara flag urgente + notifica atendente B
  - "não consigo pagar" → empatia + sugere parcelamento (se disponível na fase)
  - "silêncio 5+ dias" → notifica gestor para revisão
- **FR32:** Agente sabe quando parar e escalonar para atendente humano (regras da matriz de escalação do playbook)
- **FR33:** Tom de voz adaptado por faixa etária do lead (configurado no prompt, não hardcoded)
- **FR34:** Prompt do agente é configurável via painel admin (gestor pode atualizar sem código)

### Chat Dashboard

- **FR35:** Interface em tempo real mostrando todas as conversas ativas (bot e humanas)
- **FR36:** Indicador visual por conversa: status (bot ativo / atendente ativo / aguardando / encerrada), fase de cobrança, score do lead
- **FR37:** Atendente pode assumir qualquer conversa do bot a qualquer momento com um clique ("Assumir Conversa")
- **FR38:** Ao assumir, bot para de responder automaticamente naquela conversa
- **FR39:** Atendente pode devolver a conversa ao bot ou encerrá-la
- **FR40:** Filtros no chat: por status, atendente, fase, score, prioridade
- **FR41:** Notificações in-app para atendentes: "Lead João acabou de abrir a mensagem", "Lead Marta diz que quer cancelar — URGENTE"
- **FR42:** Notificações in-app para gestores: "Aprovação de desconto solicitada por [Atendente]", "Lead Platinum inadimplente no Mês 4 — ação necessária"
- **FR43:** Sistema de aprovação de desconto pelo app: gestor recebe notificação interna, abre modal com contexto do lead e clica Aprovar/Negar

### Campanha Manager

- **FR44:** Gestor cria campanha manual com: nome, filtros de segmentação, template de mensagem, agendamento
- **FR45:** Filtros de segmentação baseados em campos do CRM: fase, bairro, tem filhos, tem pet, faixa etária, valor em aberto, score de risco
- **FR46:** Builder de template: texto com variáveis ([nome], [valor], [plano]), botões de ação, link, imagem ou documento
- **FR47:** Geração de conteúdo por IA: gestor descreve a campanha, IA gera sugestões de template baseadas no contexto e nos dados do CRM
- **FR48:** Pré-visualização personalizada com dados reais de 3 leads da segmentação antes de enviar
- **FR49:** Disparo controlado em lotes de 50, com intervalo configurável (padrão: 30s entre lotes)
- **FR50:** Histórico de campanhas com métricas: enviados, entregues, lidos, responderam, pagaram, custo total
- **FR51:** Arquitetura multi-canal preparada: WhatsApp hoje, Email e RCS futuramente (canal configurável por template)

### Analytics & BI

- **FR52:** Dashboard financeiro: total cobrado, total arrecadado, taxa de conversão geral e por fase, ticket médio recuperado
- **FR53:** Funil de cobrança: leads por fase (quantos estão em cada mês da régua)
- **FR54:** Motivos de cancelamento e inadimplência: gráfico de Pareto dos motivos registrados
- **FR55:** Relatório preditivo de receita recuperável: "Neste mês, R$ X são recuperáveis. A IA projeta R$ Y (Z%)"
- **FR56:** Insights de IA: padrões identificados, anomalias, sugestões de ação (ex: "leads de Bangu no Mês 3 têm 42% menos conversão — revisar abordagem")
- **FR57:** Performance por atendente: taxa de conversão, tempo médio de atendimento, NPS pós-conversa
- **FR58:** Filtros por período, plano, atendente, fase, cidade/bairro
- **FR59:** Exportação de relatórios em PDF e CSV

### Cost Tracker

- **FR60:** Registro automático de todos os custos de operação: custo por disparo WhatsApp, custo por chamada de LLM, custo de API Asaas, custo de infraestrutura
- **FR61:** Custo total da operação por dia, semana e mês
- **FR62:** Custo por lead (total investido em cada inadimplente)
- **FR63:** Custo por campanha
- **FR64:** ROI da operação: valor recuperado vs. custo total investido
- **FR65:** Painel de custos visível apenas para gestor
- **FR66:** Alertas automáticos quando custo diário excede limite configurado

### Checkout Asaas

- **FR67:** Página de checkout pública acessível via link único por lead (token seguro)
- **FR68:** Exibe: nome do plano, valor total em aberto, desconto aplicado automaticamente (conforme fase), valor final
- **FR69:** Opções de parcelamento disponíveis condicionalmente:
  - Mês 1 e 2: pagamento à vista apenas
  - Mês 4: 2x ou 3x sem juros
  - Mês 5: 3x sem juros
- **FR70:** Aceita: PIX, cartão de crédito, boleto (conforme configuração Asaas)
- **FR71:** Ao confirmar pagamento (webhook Asaas), lead é atualizado no CRM automaticamente e bot envia confirmação via WhatsApp
- **FR72:** Design idêntico ao checkout do memorialmais.com.br (baseado no projeto Figma existente)
- **FR73:** Link de checkout é gerado dinamicamente pelo agente IA e atendentes e enviado no WhatsApp

### Inteligência Preditiva

- **FR74:** Score de Risco Preditivo: IA calcula, antes do vencimento, a probabilidade de inadimplência com base no histórico do lead e padrões similares
- **FR75:** Alerta preventivo para gestor: "Atenção: 23 leads têm alto risco de inadimplência no próximo ciclo"
- **FR76:** Timing inteligente de disparo: sistema aprende o horário em que cada lead historicamente responde e usa esse horário nos próximos disparos
- **FR77:** Score de Reputação atualizado automaticamente após cada evento (pagamento, resposta, atraso)
- **FR78:** Blacklist automática: leads que atingem D+150 sem nenhuma interação são classificados como "perdidos" e o processo é encerrado automaticamente com tag diagnóstico
- **FR79:** Painel de leads de alto risco no dashboard do gestor

### Auditoria & Compliance

- **FR80:** Toda ação no sistema é registrada: usuário, timestamp, ação, entidade afetada
- **FR81:** Log de todas as mensagens enviadas e recebidas (incluindo pelo bot)
- **FR82:** Registro de descontos concedidos com rastreabilidade completa (quem aprovou, quando, fase, lead)
- **FR83:** Histórico imutável de status do lead (não pode ser deletado, apenas adicionado)
- **FR84:** Export de logs de auditoria para gestor em CSV

---

## 3. Requisitos Não-Funcionais (NFR)

- **NFR01:** Segurança — RLS (Row Level Security) no Supabase: atendente vê apenas seus próprios leads e conversas; gestor vê tudo
- **NFR02:** Segurança — Tokens de checkout por lead com expiração de 7 dias e renovação automática
- **NFR03:** Segurança — Variáveis sensíveis (keys de API, tokens) em variáveis de ambiente, nunca hardcoded
- **NFR04:** Segurança — Autenticação JWT com refresh token; sessão expira em 24h
- **NFR05:** Performance — Dashboard carrega em < 2s; chat em tempo real com latência < 500ms via Supabase Realtime
- **NFR06:** Performance — Scheduler diário processa até 10.000 leads sem timeout (execução em background via n8n)
- **NFR07:** Disponibilidade — Sistema deve estar disponível 99,5% do tempo em horário comercial
- **NFR08:** Escalabilidade — Banco de dados com índices otimizados para queries de listagem e filtro de leads
- **NFR09:** UX — Design baseado em Sirius Academy com cores oficiais Plano Mais; responsivo para desktop e mobile
- **NFR10:** UX — Atendente consegue assumir conversa em 1 clique; aprovação de desconto em < 30 segundos
- **NFR11:** Auditoria — 100% das ações críticas (pagamento, desconto, encerramento) devem ser auditáveis
- **NFR12:** LGPD — Dados pessoais armazenados com finalidade registrada; dados de leads cancelados podem ser anonimizados após 1 ano

---

## 4. User Interface Design Goals

### 4.1 Visão Geral de UX

Interface profissional e objetiva para um time de cobrança. Prioridade máxima para velocidade de ação: o atendente precisa ver o contexto do lead e agir em segundos. O gestor precisa de visão macro do pipeline sem cliques desnecessários. Sem distrações, sem elementos decorativos excessivos — cada pixel serve uma função.

### 4.2 Paradigmas de Interação

- **Sidebar navigation** fixa: Chat, CRM, Campanhas, Analytics, Custos, Configurações
- **Tela de chat** domina a interface (similar ao Memorial Mais / agente de suporte)
- **Cards de lead** com status e score visíveis sem abrir a ficha
- **Notificações in-app** como badge + dropdown de alertas no header
- **Modais** para ações rápidas: assumir conversa, aprovar desconto, adicionar nota

### 4.3 Telas Principais

| Tela | Descrição |
|------|-----------|
| Login | Email + senha. Dois perfis: Gestor e Atendente |
| Dashboard Gestor | KPIs, funil de cobrança, preditivo, alertas, leads de alto risco |
| Chat Unificado | Todas as conversas ao vivo, assumir/devolver ao bot, notificações |
| CRM — Lista | Tabela de leads com filtros, busca, score, fase |
| CRM — Ficha | Dados completos do lead, histórico, notas, timeline |
| Campanha Manager | Criação, segmentação, template builder, disparos |
| Analytics | Financeiro, conversão, motivos, insights IA, performance |
| Custo de Operação | Visão completa de ROI e custos por lead/campanha/canal |
| Checkout | Página pública com pagamento Asaas (design Memorial Mais) |
| Admin / Config | Régua de cobrança, prompt do agente, usuários, limites |

### 4.4 Branding

Cores oficiais Plano Mais:
```
Navy:     #002073  → backgrounds principais, headers
Blue:     #0D3DCC  → botões primários, links
Teal:     #50F7E8  → destaques, badges ativos, neon glow
Magenta:  #E81B8F  → alertas urgentes, CTA crítico
White:    #FFFFFF  → fundo de cards
Dark:     #282828  → texto principal
```

Design system: baseado em `sirius-academy/app/globals.css` com classes `glass-card`, `btn-primary`, `input-field`, etc., adaptadas com as cores Plano Mais.

Neon details: badges de status ativo, indicadores de conversa ao vivo e leads urgentes pulsam suavemente em teal (#50F7E8).

### 4.5 Plataformas Alvo

Web Responsive (prioridade desktop para atendentes e gestores; mobile para acesso pontual do gestor)

---

## 5. Technical Assumptions

### 5.1 Repository Structure

Monorepo dentro de `/Users/bn/siriusclaude/plano-mais/`

```
plano-mais/
├── app/                    # Next.js frontend + API routes
│   ├── (auth)/             # Login
│   ├── (dashboard)/        # Área autenticada
│   │   ├── chat/           # Chat dashboard
│   │   ├── crm/            # CRM de leads
│   │   ├── campanhas/      # Campanha Manager
│   │   ├── analytics/      # BI e analytics
│   │   ├── custos/         # Cost tracker
│   │   └── admin/          # Configurações
│   ├── checkout/[token]/   # Página pública de checkout
│   └── api/                # API routes (webhooks, auth, etc.)
├── components/             # Componentes reutilizáveis
├── contexts/               # Context providers
├── lib/                    # Supabase client, utils
├── types/                  # TypeScript types
├── n8n/                    # Configurações e templates dos 6 workflows
│   ├── workflows/          # JSONs exportados do n8n
│   └── docs/               # Documentação de cada workflow
├── docs/                   # Documentação do projeto
│   ├── PRD.md              # Este arquivo
│   └── stories/            # Stories de desenvolvimento
└── supabase/
    └── migrations/         # SQL de migrations do banco
```

### 5.2 Service Architecture

**Monolith** (Next.js App Router) com:
- Frontend: Next.js 14+ com App Router
- Backend: Next.js API Routes para endpoints internos
- Realtime: Supabase Realtime para chat ao vivo
- Automação: n8n externo (self-hosted ou cloud) comunicando via webhooks
- Database: Supabase (PostgreSQL + RLS + Auth)

### 5.3 Stack Técnica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 14 (App Router) | Padrão dos projetos Sirius |
| UI/Styling | Tailwind CSS + design system Sirius | Consistência visual |
| Realtime | Supabase Realtime | Chat ao vivo sem infraestrutura extra |
| Database | Supabase (PostgreSQL) | Já usado nos projetos Sirius; RLS nativo |
| Auth | Supabase Auth | JWT + roles nativo |
| Automação | n8n | Já especificado no playbook |
| WhatsApp | Evolution API ou Z-API | APIs brasileiras, suporte a bot |
| IA Agente | Claude (Anthropic) | Melhor qualidade de conversa em PT-BR |
| Pagamento | Asaas | API brasileira, PIX nativo, já usado |
| Animações | Framer Motion | Padrão Sirius (neon glow, transitions) |

### 5.4 Testing Requirements

- Unit tests para: motor de cobrança (cálculo de fases), cálculo de score, geração de links de checkout
- Integration tests para: webhooks Asaas, fluxo de pagamento
- Manual testing para: chat ao vivo, fluxo de assumir conversa, aprovação de desconto

---

## 6. Banco de Dados — Schema Completo

### Tabelas Principais

```sql
-- Usuários do sistema (gestores e atendentes)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  role TEXT NOT NULL CHECK (role IN ('gestor', 'atendente_senior', 'atendente_junior')),
  perfil_atendimento TEXT CHECK (perfil_atendimento IN ('A', 'B', 'C')),
  ativo BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads (inadimplentes)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Identificação
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  cpf TEXT,
  -- Plano
  plano TEXT NOT NULL,
  valor_mensalidade DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  -- Status de cobrança
  status TEXT NOT NULL DEFAULT 'inadimplente'
    CHECK (status IN ('ativo', 'inadimplente', 'cancelado', 'arquivado', 'pago')),
  dias_atraso INTEGER DEFAULT 0,
  valor_em_aberto DECIMAL(10,2) DEFAULT 0,
  fase_cobranca TEXT DEFAULT 'mes1'
    CHECK (fase_cobranca IN ('pre', 'mes1', 'mes2', 'mes3', 'mes4', 'mes5', 'pos')),
  -- Dados pessoais enriquecidos
  idade INTEGER,
  cidade TEXT,
  bairro TEXT,
  cep TEXT,
  profissao TEXT,
  tem_pet BOOLEAN DEFAULT false,
  num_pets INTEGER DEFAULT 0,
  tem_dependentes BOOLEAN DEFAULT false,
  num_dependentes INTEGER DEFAULT 0,
  idades_dependentes JSONB DEFAULT '[]',
  -- Scores
  score_reputacao INTEGER DEFAULT 50 CHECK (score_reputacao BETWEEN 0 AND 100),
  risco_churn TEXT DEFAULT 'medio' CHECK (risco_churn IN ('baixo', 'medio', 'alto')),
  -- Relacionamentos
  atendente_responsavel_id UUID REFERENCES usuarios(id),
  -- Desconto atual
  desconto_ativo_percentual DECIMAL(5,2) DEFAULT 0,
  desconto_ativo_validade TIMESTAMPTZ,
  -- Arquivamento
  motivo_arquivamento TEXT,
  tag_arquivamento TEXT,
  -- Timing inteligente
  horario_preferido_resposta TIME,
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  notas_count INTEGER DEFAULT 0,
  ultima_interacao TIMESTAMPTZ,
  ultima_mensagem_enviada TIMESTAMPTZ,
  data_entrada TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notas do CRM
CREATE TABLE notas_crm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Histórico de status do lead (imutável)
CREATE TABLE historico_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  fase_anterior TEXT,
  fase_nova TEXT,
  motivo TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversas (thread WhatsApp)
CREATE TABLE conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('BOT', 'HUMANO', 'MISTO')),
  atendente_id UUID REFERENCES usuarios(id),
  status TEXT NOT NULL DEFAULT 'aberta'
    CHECK (status IN ('aberta', 'fechada', 'pausada', 'transferida')),
  motivo_encerramento TEXT,
  inicio TIMESTAMPTZ DEFAULT now(),
  fim TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mensagens
CREATE TABLE mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID NOT NULL REFERENCES conversas(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  remetente TEXT NOT NULL CHECK (remetente IN ('BOT', 'LEAD', 'ATENDENTE')),
  conteudo TEXT NOT NULL,
  tipo TEXT DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagem', 'audio', 'documento', 'template', 'botao')),
  timestamp TIMESTAMPTZ DEFAULT now(),
  status_entrega TEXT DEFAULT 'enviado'
    CHECK (status_entrega IN ('enviado', 'entregue', 'lido', 'falhou')),
  custo_estimado DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Descontos concedidos
CREATE TABLE descontos_concedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  percentual DECIMAL(5,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('MES3', 'MES4', 'MES5', 'MANUAL')),
  data_concessao TIMESTAMPTZ DEFAULT now(),
  data_expiracao TIMESTAMPTZ,
  utilizado BOOLEAN DEFAULT false,
  data_utilizacao TIMESTAMPTZ,
  aprovado_por UUID REFERENCES usuarios(id),
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pagamentos recebidos (via webhook Asaas)
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  valor_original DECIMAL(10,2) NOT NULL,
  desconto_aplicado DECIMAL(5,2) DEFAULT 0,
  valor_final DECIMAL(10,2) NOT NULL,
  data_pagamento TIMESTAMPTZ NOT NULL,
  tipo TEXT DEFAULT 'total' CHECK (tipo IN ('total', 'parcela')),
  numero_parcela INTEGER DEFAULT 1,
  total_parcelas INTEGER DEFAULT 1,
  metodo TEXT CHECK (metodo IN ('pix', 'cartao', 'boleto')),
  asaas_payment_id TEXT UNIQUE,
  campanha_id UUID,
  fase_cobranca_momento TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Templates de mensagem
CREATE TABLE templates_mensagem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('cobranca', 'lembrete', 'oferta', 'confirmacao', 'diagnostico', 'campanha')),
  conteudo TEXT NOT NULL,
  variaveis TEXT[] DEFAULT '{}',
  tem_midia BOOLEAN DEFAULT false,
  url_midia TEXT,
  tipo_midia TEXT,
  tem_botoes BOOLEAN DEFAULT false,
  botoes JSONB DEFAULT '[]',
  aprovado_whatsapp BOOLEAN DEFAULT false,
  criado_por UUID REFERENCES usuarios(id),
  gerado_por_ia BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campanhas de disparo
CREATE TABLE campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  filtros JSONB NOT NULL DEFAULT '{}',
  template_id UUID REFERENCES templates_mensagem(id),
  canal TEXT DEFAULT 'whatsapp' CHECK (canal IN ('whatsapp', 'email', 'rcs')),
  agendado_para TIMESTAMPTZ,
  iniciado_em TIMESTAMPTZ,
  finalizado_em TIMESTAMPTZ,
  status TEXT DEFAULT 'rascunho'
    CHECK (status IN ('rascunho', 'agendada', 'ativa', 'pausada', 'finalizada', 'cancelada')),
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  total_leads INTEGER DEFAULT 0,
  total_enviados INTEGER DEFAULT 0,
  total_entregues INTEGER DEFAULT 0,
  total_lidos INTEGER DEFAULT 0,
  total_respondidos INTEGER DEFAULT 0,
  total_pagaram INTEGER DEFAULT 0,
  custo_total DECIMAL(10,2) DEFAULT 0,
  gerado_por_ia BOOLEAN DEFAULT false,
  prompt_ia TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Resultados de campanha por lead
CREATE TABLE resultados_campanha (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID NOT NULL REFERENCES campanhas(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  enviado BOOLEAN DEFAULT false,
  entregue BOOLEAN DEFAULT false,
  lido BOOLEAN DEFAULT false,
  respondeu BOOLEAN DEFAULT false,
  pagou BOOLEAN DEFAULT false,
  custo_disparo DECIMAL(10,6) DEFAULT 0,
  timestamp_envio TIMESTAMPTZ,
  timestamp_leitura TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Custos de operação
CREATE TABLE custos_operacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL CHECK (tipo IN ('disparo_whatsapp', 'api_llm', 'api_asaas', 'infra', 'outro')),
  quantidade INTEGER DEFAULT 1,
  custo_unitario DECIMAL(10,6) NOT NULL,
  custo_total DECIMAL(10,4) NOT NULL,
  referencia_tipo TEXT,
  referencia_id UUID,
  lead_id UUID REFERENCES leads(id),
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notificações in-app
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  lida_em TIMESTAMPTZ,
  lead_id UUID REFERENCES leads(id),
  conversa_id UUID REFERENCES conversas(id),
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  acao_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Links de checkout
CREATE TABLE checkout_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  token TEXT UNIQUE NOT NULL,
  valor_em_aberto DECIMAL(10,2) NOT NULL,
  desconto_percentual DECIMAL(5,2) DEFAULT 0,
  valor_final DECIMAL(10,2) NOT NULL,
  opcoes_parcelamento JSONB DEFAULT '[]',
  valido_ate TIMESTAMPTZ NOT NULL,
  utilizado BOOLEAN DEFAULT false,
  utilizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scores e predições
CREATE TABLE scores_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  score_reputacao INTEGER NOT NULL,
  score_risco_churn DECIMAL(5,4) NOT NULL,
  classificacao_risco TEXT NOT NULL,
  fatores JSONB DEFAULT '{}',
  calculado_em TIMESTAMPTZ DEFAULT now(),
  valido_ate TIMESTAMPTZ
);

-- Diagnósticos pós-D+150
CREATE TABLE diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  tag_encerramento TEXT NOT NULL,
  motivo_principal TEXT NOT NULL,
  motivo_secundario TEXT,
  sentimento TEXT CHECK (sentimento IN ('positivo', 'neutro', 'negativo')),
  quer_voltar BOOLEAN DEFAULT false,
  prazo_retorno TEXT,
  atendente_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auditoria
CREATE TABLE auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  acao TEXT NOT NULL,
  entidade_tipo TEXT NOT NULL,
  entidade_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Epic List

| # | Epic | Objetivo | Deps |
|---|------|----------|------|
| 01 | Foundation & Design System | Setup Next.js, auth com roles, DB completo, layout base | — |
| 02 | CRM — Central de Leads | Ficha de lead, listagem, filtros, notas, score de reputação | 01 |
| 03 | Motor de Cobrança | Régua automática, cálculo de fases, anti-abuso, histórico | 01 |
| 04 | n8n — 6 Workflows | Scheduler, disparo, agente IA, webhook pagamento, campanhas, diagnóstico | 01, 03 |
| 05 | Chat Dashboard | Conversas ao vivo, assumir/devolver, notificações in-app, aprovação de desconto | 01, 02 |
| 06 | Campanha Manager | Criação de campanha, segmentação CRM, template builder, IA geradora | 01, 02 |
| 07 | Analytics & BI | Dashboard financeiro, funil, insights IA, preditivo de receita | 01, 02, 03 |
| 08 | Cost Tracker | Registro de custos, custo por lead/campanha, ROI, alertas | 01, 04, 06 |
| 09 | Checkout Asaas | Página pública de pagamento, parcelamento, webhook confirmação | 01, 03 |
| 10 | Inteligência Preditiva | Score de churn, timing inteligente, blacklist, alertas preditivos | 01, 02, 03 |

---

## 8. Epic Details

---

### Epic 01: Foundation & Design System

**Objetivo:** Criar a base do projeto com Next.js configurado no design Plano Mais, autenticação com roles gestor/atendente, layout da aplicação e todas as tabelas do banco de dados com RLS ativo.

#### Story 1.1 — Setup do Projeto e Design System

Como desenvolvedor,
quero um projeto Next.js configurado com Tailwind, TypeScript e design system Plano Mais,
para ter a base visual pronta para todos os outros componentes.

**Acceptance Criteria:**
1. Projeto Next.js 14 criado em `/Users/bn/siriusclaude/plano-mais/app/`
2. Tailwind configurado com as cores Plano Mais como tokens (navy, blue, teal, magenta)
3. CSS globals com classes: `glass-card`, `btn-primary`, `btn-danger`, `input-field`, `badge-status`, `nav-item`
4. Fonte Inter ou equivalente configurada
5. Neon glow pulsante implementado para elementos de destaque (teal #50F7E8)
6. Página `/` redireciona para `/login`
7. `npm run dev` sobe sem erros

#### Story 1.2 — Autenticação com Roles

Como usuário do sistema,
quero fazer login com email e senha e ser redirecionado conforme meu perfil,
para acessar somente as funcionalidades do meu papel.

**Acceptance Criteria:**
1. Supabase Auth configurado e conectado
2. Tabela `usuarios` criada com campos: id, nome, email, role, perfil_atendimento, ativo
3. Página `/login` funcional com email + senha
4. Após login: gestor vai para `/dashboard`, atendente vai para `/chat`
5. Middleware protege todas as rotas de `/dashboard/*`, `/chat/*`, `/crm/*`
6. Logout limpa sessão e redireciona para `/login`
7. Gestor não vê erro ao acessar rotas de atendente e vice-versa (redirect correto)

#### Story 1.3 — Layout Base da Aplicação

Como usuário autenticado,
quero uma interface com sidebar e header fixos,
para navegar entre os módulos sem perder contexto.

**Acceptance Criteria:**
1. Sidebar com ícones SVG (sem emoji): Chat, CRM, Campanhas, Analytics, Custos (apenas gestor), Admin (apenas gestor)
2. Header com: nome do usuário, badge de role, ícone de notificações com contador de não lidas
3. Sidebar colapsa em mobile (menu hamburguer)
4. Rota ativa destacada na sidebar com cor azul (#0D3DCC)
5. Layout renderiza corretamente em 1280px+ (desktop primário)
6. Atendente não vê: Campanhas, Analytics, Custos, Admin na sidebar

#### Story 1.4 — Banco de Dados Completo (Migrations)

Como sistema,
quero todas as tabelas criadas no Supabase com RLS ativo,
para que os dados sejam armazenados de forma segura desde o início.

**Acceptance Criteria:**
1. Todas as tabelas do schema deste PRD criadas via migration SQL
2. RLS ativo em todas as tabelas
3. Policy `leads`: gestor vê todos; atendente vê apenas leads onde `atendente_responsavel_id = auth.uid()`
4. Policy `conversas` e `mensagens`: mesma lógica de acesso por atendente_id
5. Policy `notificacoes`: usuário vê apenas suas próprias notificações
6. Tabela `auditoria`: insert-only, sem update/delete via RLS
7. Índices criados: `leads(status)`, `leads(fase_cobranca)`, `leads(dias_atraso)`, `mensagens(conversa_id)`, `notificacoes(usuario_id, lida)`
8. Migration executa sem erros: `supabase db push`

---

### Epic 02: CRM — Central de Leads

**Objetivo:** Implementar a central de gestão de leads com listagem filtrada, ficha completa, notas, histórico de interações e score de reputação — dando a gestores e atendentes visibilidade total sobre cada inadimplente.

#### Story 2.1 — Listagem de Leads com Filtros

Como gestor ou atendente,
quero ver todos os meus leads em uma lista com filtros rápidos,
para priorizar quem precisa de atenção agora.

**Acceptance Criteria:**
1. Rota `/crm` exibe tabela de leads
2. Colunas visíveis: Nome, Plano, Dias de Atraso, Fase, Score, Status, Atendente, Última Interação
3. Filtros: Status, Fase, Score de Risco, Atendente, Tags
4. Busca por nome, telefone ou CPF
5. Ordenação clicável em todas as colunas
6. Paginação de 25 leads por página
7. Indicador de risco: vermelho (alto), amarelo (médio), verde (baixo) — SVG, sem emoji
8. Gestor vê todos os leads; atendente vê apenas seus leads

#### Story 2.2 — Ficha Completa do Lead

Como gestor ou atendente,
quero ver todos os dados de um lead em uma única tela,
para ter contexto completo antes de interagir.

**Acceptance Criteria:**
1. Rota `/crm/[id]` exibe ficha do lead
2. Seção "Dados Pessoais": nome, telefone, email, CPF, plano, valor mensalidade, data vencimento
3. Seção "Cobrança": dias de atraso, valor em aberto, fase atual, desconto disponível, link de checkout
4. Seção "Perfil": idade, cidade, bairro, tem pet, tem dependentes, profissão
5. Seção "Scores": score de reputação (barra visual 0-100), risco de churn (badge colorido) com fatores explicativos
6. Seção "Tags": tags existentes + botão para adicionar nova tag
7. Seção "Atendente responsável": campo de atribuição com dropdown de atendentes
8. Botão "Abrir Chat" navega para a conversa ativa do lead no Chat Dashboard

#### Story 2.3 — Notas e Histórico de Interações

Como atendente ou gestor,
quero adicionar notas ao lead e ver o histórico completo de interações,
para não perder contexto entre atendimentos.

**Acceptance Criteria:**
1. Seção "Notas" na ficha do lead: campo de texto + botão Salvar
2. Notas exibidas em ordem cronológica decrescente com: autor, data/hora, conteúdo
3. Seção "Histórico de Interações": timeline visual com todas as mensagens (bot + atendentes), mudanças de status e pagamentos
4. Timeline diferencia visualmente por tipo: mensagem bot (azul), mensagem atendente (verde), mensagem lead (branco), evento de sistema (cinza)
5. Notas salvas via API e exibidas em tempo real (sem reload)
6. Histórico de status: cada mudança de fase/status exibe quem fez e quando

#### Story 2.4 — Importação de Leads via Planilha

Como gestor,
quero importar leads de uma planilha CSV ou XLSX,
para popular o CRM rapidamente sem digitar um a um.

**Acceptance Criteria:**
1. Rota `/crm/importar` com upload de CSV/XLSX
2. Mapeamento de colunas: sistema mostra preview e deixa gestor mapear cada coluna para o campo correto
3. Validação de dados: telefone (formato), CPF (dígitos), email (formato) — erros são listados antes de importar
4. Importação em lote: até 1.000 leads por vez
5. Preview de 5 primeiros leads antes de confirmar
6. Resultado: "X leads importados, Y com erro" com lista dos erros
7. Leads importados entram com status "inadimplente" e fase calculada automaticamente

---

### Epic 03: Motor de Cobrança

**Objetivo:** Implementar a régua automática de cobrança com cálculo diário de fases, gestão de descontos progressivos, regras anti-abuso e painel de configuração para o gestor — tornando a lógica de cobrança confiável e auditável.

#### Story 3.1 — Engine de Cálculo de Fase

Como sistema,
quero calcular automaticamente a fase de cobrança de cada lead,
para que os workflows n8n saibam qual ação tomar com cada inadimplente.

**Acceptance Criteria:**
1. Função `calcularFaseCobranca(lead)` implementada e testada
2. Calcula corretamente: PRÉ (D-3 a D-0), MÊS 1-5, PÓS (D+151+)
3. Retorna: fase, dias_atraso, desconto_disponivel, parcelamento_disponivel, validade_desconto
4. Lógica de anti-abuso implementada: desconto de Mês 3 expira em 48h; descontos não acumulam
5. Disponível como API route `POST /api/cobranca/calcular-fase` para uso pelo n8n
6. Unit tests cobrindo todos os 7 casos de fase + casos limite (exatamente D-3, D+1, D+30, D+31, etc.)

#### Story 3.2 — Painel de Configuração da Régua

Como gestor,
quero configurar os parâmetros da régua de cobrança pelo dashboard,
para ajustar percentuais e prazos sem precisar de código.

**Acceptance Criteria:**
1. Rota `/admin/regua` acessível apenas para gestor
2. Formulário com campos editáveis: percentual de desconto por fase, duração de cada fase em dias, validade do desconto do Mês 3, opções de parcelamento por fase
3. Preview em tempo real: "Se salvar agora, lead João (D+75) estará na Mês 3 com 5% de desconto"
4. Histórico de alterações: quem alterou, quando, o que mudou
5. Configurações salvas no banco e usadas pelo engine de cálculo
6. Botão "Restaurar Padrões" volta aos valores do playbook original

#### Story 3.3 — Gestão de Descontos e Aprovações

Como gestor ou atendente,
quero visualizar e gerenciar todos os descontos concedidos,
para garantir que as regras anti-abuso sejam respeitadas.

**Acceptance Criteria:**
1. Na ficha do lead: seção "Descontos" mostrando histórico de descontos concedidos com: fase, percentual, data, aprovado por, utilizado
2. Sistema impede gerar link de checkout com desconto maior que o da fase atual (validação no backend)
3. Notificação in-app criada automaticamente quando atendente tenta dar desconto acima da fase
4. Relatório de descontos: rota `/admin/descontos` lista todos os descontos concedidos com filtros por data e fase

---

### Epic 04: n8n — 6 Workflows de Automação

**Objetivo:** Implementar e documentar os 6 workflows n8n que automatizam 100% do processo de cobrança — desde o disparo diário até a coleta de diagnóstico pós-D+150 — integrando Supabase, WhatsApp API e o agente IA.

#### Story 4.1 — WF1: Scheduler Diário + WF4: Receptor de Pagamentos

Como sistema,
quero um scheduler diário que processa todos os leads e um receptor de pagamentos via webhook,
para manter o banco de dados atualizado e reagir em tempo real aos pagamentos.

**Acceptance Criteria:**
1. WF1 configurado: trigger Cron às 08:00, busca todos os leads ativos no Supabase, recalcula dias_atraso e fase, atualiza banco, distribui para WF2
2. WF4 configurado: webhook endpoint `/api/webhooks/asaas`, valida assinatura, atualiza lead (status, valor, fase), cria registro em `pagamentos`, dispara notificação in-app para atendente/gestor
3. JSONs dos workflows exportados em `/n8n/workflows/`
4. Documentação de cada workflow em `/n8n/docs/` com: descrição, trigger, inputs, outputs, dependências
5. Variáveis de ambiente documentadas em `.env.example`
6. WF4 testado com payload mock do Asaas

#### Story 4.2 — WF2: Disparo por Fase + WF6: Diagnóstico

Como sistema,
quero workflows que disparam mensagens personalizadas por fase e coletam diagnóstico pós-D+150,
para que cada lead receba a comunicação certa no momento certo.

**Acceptance Criteria:**
1. WF2: recebe lead_id da fase, busca dados do lead no Supabase, monta contexto (nome, plano, fase, valor, dados pessoais), personaliza template via variáveis, dispara via WhatsApp API no horário_preferido_resposta do lead (ou 09:00 padrão), registra mensagem em `mensagens` com custo estimado
2. WF2: seleciona template correto por fase (mapeamento fase→template configurável)
3. WF6: acionado quando lead atinge D+151, envia mensagem de diagnóstico, processa resposta, aplica uma das 6 tags de encerramento, atualiza status do lead para 'arquivado', cria registro em `diagnosticos`
4. Ambos JSONs exportados e documentados
5. WF2 testado com lead de cada fase (7 casos)

#### Story 4.3 — WF3: Agente Conversacional + WF5: Campanhas

Como sistema,
quero um agente conversacional que responde automaticamente e um workflow de campanhas manuais,
para que o bot mantenha conversas inteligentes e campanhas sejam disparadas com controle.

**Acceptance Criteria:**
1. WF3: recebe mensagem do lead via webhook WhatsApp, busca contexto do lead (CRM + últimas 10 mensagens), chama LLM (Claude) com prompt do agente + contexto, executa árvore de decisão baseada na intenção detectada: pagar→link checkout, dúvida→responde, cancelar→notifica atendente B URGENTE, dificuldade financeira→empatia+parcelamento se disponível, sem resposta 5 dias→notifica gestor
2. WF3: quando intenção é "cancelar" ou "escalonar", cria notificação urgente e para de responder automaticamente naquela conversa
3. WF5: recebe campanha_id, busca leads filtrados, para cada lead: personaliza mensagem via IA, dispara em lotes de 50 com delay de 30s entre lotes, registra resultado em `resultados_campanha`, atualiza métricas da campanha
4. JSONs exportados e documentados
5. WF3 testado com as 5 intenções principais

---

### Epic 05: Chat Dashboard

**Objetivo:** Interface de monitoramento em tempo real de todas as conversas ativas, com capacidade de assumir conversas do bot, sistema de notificações in-app e aprovação de desconto pelo app — dando ao time humano controle total sobre o processo.

#### Story 5.1 — Chat ao Vivo: Listagem de Conversas

Como atendente ou gestor,
quero ver todas as conversas ativas em tempo real,
para saber o que está acontecendo no pipeline de cobrança agora.

**Acceptance Criteria:**
1. Rota `/chat` exibe painel com lista de conversas à esquerda e conversa aberta à direita
2. Lista de conversas atualiza em tempo real via Supabase Realtime
3. Cada item na lista mostra: nome do lead, fase, última mensagem (preview), tempo da última interação, badge de status (BOT / HUMANO / URGENTE)
4. Badge URGENTE em vermelho pulsante (neon magenta) para conversas com intenção "cancelar" detectada
5. Filtros na lista: status, fase, atendente
6. Atendente vê apenas conversas dos seus leads; gestor vê todas
7. Contador de conversas não lidas no badge da sidebar

#### Story 5.2 — Visualização de Conversa e Assumir do Bot

Como atendente,
quero visualizar a conversa completa e assumir o controle a qualquer momento,
para humanizar o atendimento quando o bot não for suficiente.

**Acceptance Criteria:**
1. Conversa selecionada exibe todas as mensagens em ordem cronológica com: remetente, horário, status de entrega
2. Mensagens do bot com fundo azul escuro, mensagens do lead com fundo branco, mensagens do atendente com fundo verde escuro
3. Botão "Assumir Conversa" visível quando conversa está com bot
4. Ao assumir: WF3 para de responder, conversa é marcada como HUMANO, atendente é registrado, notificação enviada ao atendente confirmando
5. Campo de texto para enviar mensagem manual ao lead via WhatsApp API
6. Botão "Devolver ao Bot" devolve controle ao WF3
7. Botão "Encerrar Conversa" encerra e solicita motivo
8. Ações persistem no banco com timestamp e usuário

#### Story 5.3 — Notificações In-App e Aprovação de Desconto

Como gestor,
quero receber notificações dentro do app e aprovar descontos sem sair do contexto,
para reagir rapidamente às situações que exigem minha atenção.

**Acceptance Criteria:**
1. Ícone de sino no header com badge de contagem de notificações não lidas
2. Dropdown de notificações com: ícone de prioridade, título, mensagem curta, tempo, botão de ação rápida
3. Tipos de notificação implementados: "Lead quer cancelar — URGENTE", "Aprovação de desconto solicitada", "Pagamento recebido", "Lead abriu mensagem", "Lead Platinum inadimplente"
4. Ao clicar em notificação de aprovação de desconto: modal abre com contexto do lead (nome, fase, valor em aberto, desconto solicitado, histórico) e botões Aprovar / Negar
5. Aprovação cria registro em `descontos_concedidos` e notifica atendente que solicitou
6. Notificação marcada como lida automaticamente ao clicar
7. Painel "Todas as notificações" em `/notificacoes` com histórico completo

---

### Epic 06: Campanha Manager

**Objetivo:** Sistema completo para gestores criarem e dispararem campanhas manuais de WhatsApp com segmentação baseada no CRM, geração de conteúdo por IA, builder de templates e controle total sobre os disparos.

#### Story 6.1 — Criação de Campanha com Segmentação

Como gestor,
quero criar uma campanha de disparo com filtros de segmentação do CRM,
para atingir apenas os leads certos com a mensagem certa.

**Acceptance Criteria:**
1. Rota `/campanhas/nova` com formulário de criação
2. Campos: nome da campanha, descrição
3. Painel de segmentação com filtros: fase de cobrança, bairro, cidade, tem filhos, tem pet, faixa etária (ex: 30-45), valor em aberto acima de R$, score de risco, tags
4. Contador ao vivo: "Sua segmentação atinge X leads" — atualiza conforme filtros mudam
5. Preview de 5 leads que serão atingidos (nomes e dados básicos)
6. Rascunho salvo automaticamente ao navegar para próxima etapa

#### Story 6.2 — Template Builder com Variáveis e IA

Como gestor,
quero construir um template de mensagem com variáveis e gerar sugestões via IA,
para criar mensagens personalizadas sem esforço manual.

**Acceptance Criteria:**
1. Editor de template com: campo de texto rico, inserção de variáveis via clique ([nome], [plano], [valor], [desconto], [link_checkout], e campos personalizados do CRM)
2. Suporte a: imagem (upload), documento (PDF), botões de ação (máximo 3)
3. Botão "Gerar com IA": gestor descreve a campanha em linguagem natural, IA gera sugestão de mensagem baseada no contexto da segmentação e dos dados do CRM
4. Preview personalizado com dados reais de 3 leads da segmentação
5. Validação: mensagem não pode ter mais de 1024 caracteres; pelo menos 1 variável [nome] obrigatória
6. Template salvo em `templates_mensagem` com flag `gerado_por_ia`

#### Story 6.3 — Disparo e Histórico de Campanhas

Como gestor,
quero agendar ou disparar imediatamente uma campanha e acompanhar os resultados em tempo real,
para ter controle total sobre os disparos e medir o retorno.

**Acceptance Criteria:**
1. Opção de disparo: imediato ou agendado (data + hora)
2. Confirmação antes do disparo: "Você está prestes a enviar para X leads. Confirmar?"
3. Durante o disparo: barra de progresso mostrando enviados/total em tempo real
4. Botão "Pausar" disponível durante disparo (interrompe lotes restantes)
5. Rota `/campanhas` lista histórico com métricas: enviados, lidos, responderam, pagaram, custo total, ROI
6. Detalhes de campanha: `/campanhas/[id]` com resultado por lead (quem leu, quem pagou)
7. Exportação de resultados em CSV

---

### Epic 07: Analytics & BI

**Objetivo:** Dashboard financeiro completo com KPIs de cobrança, funil visual, análise de motivos, insights de IA e projeção preditiva de receita recuperável — dando ao gestor inteligência de dados para tomar decisões.

#### Story 7.1 — Dashboard Financeiro Principal

Como gestor,
quero ver os principais KPIs financeiros da operação de cobrança em uma tela,
para entender o desempenho do processo de perto.

**Acceptance Criteria:**
1. Rota `/analytics` com dashboard de KPIs
2. Cards principais: Total Cobrado (período), Total Arrecadado, Taxa de Conversão Geral, Ticket Médio Recuperado, Leads Ativos, Leads Pagaram Hoje
3. Gráfico de linha: arrecadado por dia nos últimos 30/60/90 dias
4. Funil de cobrança: barras horizontais mostrando leads em cada fase (Pré, Mês 1-5, Pós)
5. Taxa de conversão por fase: "Do Mês 3, X% pagaram"
6. Filtros: período (últimos 7d, 30d, 90d, personalizado), plano, atendente
7. Cards com comparação vs. período anterior (↑ / ↓ com percentual)

#### Story 7.2 — Motivos, Insights de IA e Preditivo

Como gestor,
quero entender os motivos de cancelamento e receber insights da IA para melhorar a operação,
para tomar decisões baseadas em dados, não em intuição.

**Acceptance Criteria:**
1. Seção "Motivos de Inadimplência": gráfico de barras com os top 10 motivos registrados nos diagnósticos
2. Seção "Performance por Atendente": tabela com taxa de conversão, conversas assumidas, tempo médio
3. Seção "Insights de IA": 3-5 cards com padrões detectados (ex: "Leads de Bangu com filhos têm 62% mais conversão no Mês 3") — gerados via Claude
4. Seção "Projeção de Receita": "Neste mês, R$ X estão em aberto entre leads ativos. A IA projeta recuperar R$ Y (Z%) com a régua atual"
5. Botão "Atualizar Insights" (chamada manual ao Claude) — máximo 1x por dia para controle de custo
6. Seção "Análise de Campanhas": campanha com maior ROI, template com melhor taxa de resposta

---

### Epic 08: Cost Tracker

**Objetivo:** Rastrear e exibir todos os custos da operação de cobrança — por disparo, LLM, API e infraestrutura — permitindo ao gestor ver o ROI real e controlar o gasto operacional.

#### Story 8.1 — Registro e Visualização de Custos

Como gestor,
quero ver um painel completo de custos da operação,
para entender quanto estamos gastando e qual é o retorno sobre o investimento.

**Acceptance Criteria:**
1. Rota `/custos` acessível apenas para gestor
2. Cards: Custo Total do Mês, Custo por Disparo (médio), Custo por Lead Recuperado, ROI (valor recuperado / custo total)
3. Breakdown por tipo: Disparos WhatsApp, Chamadas LLM, API Asaas, Infraestrutura
4. Gráfico de linha: custo diário vs. valor recuperado (últimos 30 dias)
5. Custo por campanha: tabela listando campanhas com custo total e ROI individual
6. Custo por fase: quanto foi gasto em cada fase da régua
7. Alertas: badge vermelho quando custo diário excede 80% do limite configurado

#### Story 8.2 — Configuração de Alertas de Custo

Como gestor,
quero configurar limites de custo diário e receber alertas quando forem ultrapassados,
para evitar surpresas na fatura.

**Acceptance Criteria:**
1. Rota `/admin/custos` com campos de configuração: limite de custo diário, limite mensal, custo unitário por disparo WhatsApp (configurável), custo por chamada LLM
2. Ao ultrapassar 80% do limite diário: notificação in-app para gestor
3. Ao ultrapassar 100%: notificação urgente + pausar disparos automáticos (flag no WF1)
4. Histórico de alertas disparados

---

### Epic 09: Checkout Asaas

**Objetivo:** Página pública de checkout com design idêntico ao Memorial Mais, exibindo o valor em aberto com desconto pré-aplicado por fase, opções de parcelamento condicionais e integração completa com Asaas — fechando o ciclo de pagamento automaticamente.

#### Story 9.1 — Geração de Link e Página de Checkout

Como lead inadimplente,
quero acessar uma página de pagamento com meu valor regularizado,
para pagar de forma fácil sem precisar negociar.

**Acceptance Criteria:**
1. API route `POST /api/checkout/gerar` recebe lead_id e retorna URL única com token seguro
2. Rota pública `/checkout/[token]` acessível sem login
3. Página exibe: logo Plano Mais, nome do lead, nome do plano, valor original em aberto, desconto aplicado (se houver, com badge "X% de desconto — válido por Yh"), valor final destacado
4. Design baseado no projeto Figma do Memorial Mais (cores, layout, cards de pagamento)
5. Token expira em 7 dias; página exibe "Link expirado" com instrução para solicitar novo
6. Token de lead que já pagou exibe "Pagamento confirmado" com detalhes

#### Story 9.2 — Parcelamento e Confirmação de Pagamento

Como lead inadimplente,
quero escolher entre pagar à vista ou parcelar,
para regularizar minha situação de um jeito que caiba no meu bolso.

**Acceptance Criteria:**
1. Opções de pagamento exibidas conforme fase do lead:
   - Fase Pré/Mês 1/Mês 2: apenas à vista (PIX, cartão, boleto)
   - Fase Mês 4: à vista + 2x + 3x sem juros
   - Fase Mês 5: à vista + 2x + 3x sem juros
2. Seleção de parcelamento muda o valor exibido dinamicamente
3. Ao clicar em PIX: gera QR Code via Asaas e exibe com timer de 30 minutos
4. Ao clicar em cartão: formulário seguro de cartão (Asaas.js ou redirect)
5. Ao confirmar pagamento (webhook WF4): lead recebe mensagem WhatsApp "Pagamento confirmado! Seu plano já está ativo." e página exibe confirmação
6. Registro criado em `pagamentos` com todos os detalhes

---

### Epic 10: Inteligência Preditiva

**Objetivo:** Camada de inteligência que antecipa inadimplência antes de acontecer, otimiza o horário de disparo por lead, classifica automaticamente leads sem chance e exibe painel preditivo para o gestor tomar ações preventivas.

#### Story 10.1 — Score de Risco e Painel Preditivo

Como gestor,
quero ver quais leads têm alto risco de inadimplência no próximo ciclo,
para agir preventivamente antes do vencimento.

**Acceptance Criteria:**
1. Job diário calcula score de risco para leads com vencimento nos próximos 15 dias
2. Score baseado em: histórico de atrasos anteriores, tempo desde último contato, padrão de resposta, plano e valor
3. Classificação: baixo (<30%), médio (30-70%), alto (>70%)
4. Painel "Risco Preditivo" no Dashboard Gestor: lista dos 10 leads com maior risco, com: nome, plano, valor, dias até vencimento, percentual de risco
5. Botão "Criar Campanha Preventiva" pré-preenche segmentação com leads de alto risco
6. Score salvo em `scores_leads` com fatores explicativos

#### Story 10.2 — Timing Inteligente e Blacklist Automática

Como sistema,
quero aprender o horário ótimo de disparo para cada lead e classificar automaticamente leads sem retorno,
para maximizar a taxa de abertura e economizar custo em leads perdidos.

**Acceptance Criteria:**
1. Após cada mensagem lida: registro do horário de leitura em `mensagens` (via status_entrega webhook)
2. Job semanal calcula `horario_preferido_resposta` para cada lead com >= 3 mensagens lidas (média dos horários de leitura)
3. WF2 usa `horario_preferido_resposta` ao disparar mensagem (fallback: 09:00)
4. Blacklist automática: leads em D+151 sem NENHUMA leitura confirmada em todas as mensagens → status "arquivado", tag "sem_retorno", processo encerrado
5. Relatório em `/analytics`: "X leads foram arquivados automaticamente por falta de resposta este mês — custo evitado: R$ Y"

---

## 9. Checklist Results Report

| Item | Status | Observação |
|------|--------|-----------|
| Goals claros e mensuráveis | PASS | 8 goals definidos |
| Requisitos funcionais completos (FR) | PASS | 84 FRs documentados |
| Requisitos não-funcionais (NFR) | PASS | 12 NFRs incluindo segurança e performance |
| UI/UX Goals definidos | PASS | Design system, branding, telas mapeadas |
| Technical assumptions documentadas | PASS | Stack completo com justificativas |
| Schema de banco documentado | PASS | 14 tabelas com SQL completo |
| Epic list lógica e sequencial | PASS | 10 epics com dependências mapeadas |
| Stories com critérios testáveis | PASS | Todos os ACs são verificáveis |
| Alinhamento com playbooks existentes | PASS | Régua, scripts e matriz de escalação incorporados |
| Arquitetura multi-canal futura | PASS | Email/RCS estruturalmente preparado |

---

## 10. Next Steps

### Para o Arquiteto (@architect)

Revisar o PRD e criar o documento de arquitetura técnica em `docs/architecture.md` com:
- Diagrama de componentes (Next.js + n8n + Supabase + WhatsApp API)
- Estratégia de segurança e RLS
- Definição das API Routes e contratos
- Estratégia de deploy (Railway ou Vercel + Supabase cloud)
- Decisão final sobre WhatsApp API (Evolution API vs Z-API)

### Para o Data Engineer (@data-engineer)

Criar as migrations do banco baseadas no schema da Seção 6, incluindo:
- Índices otimizados para as queries mais frequentes
- Políticas RLS para cada tabela
- Funções de banco (calcular_dias_atraso, atualizar_fase)
- Seeds de teste com leads em cada fase

### Para o Desenvolvedor (@dev)

Iniciar pelo Epic 01 (Foundation & Design System):
1. Story 1.1 — Setup do projeto
2. Story 1.4 — Banco de dados (migrations)
3. Story 1.2 — Autenticação
4. Story 1.3 — Layout base

---

*Projeto Inadimplência — Plano Mais*
*Sirius Strategy © 2026*
*PRD v1.0 — Gerado por Orion (AIOS Master)*
