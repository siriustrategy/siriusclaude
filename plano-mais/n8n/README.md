# n8n Workflows — Plano Mais Inadimplência

Epic 04 — 6 workflows de automação para o sistema de cobrança.

## Arquitetura dos Workflows

```
WF1 (Scheduler)
  └── WF2 (Disparo) ──── WhatsApp (Z-API)
       │                ├── SMS (Zenvia)
       │                └── Email (SMTP)
       │
WF3 (Agente IA) ←── Webhook WhatsApp recebido
  └── Claude Haiku (resposta automática)
  └── Fila de Atendente (quando transferir)

WF4 (Pagamentos) ←── Webhook Asaas / Pagar.me / MercadoPago
  └── Atualiza lead → Confirma via WhatsApp

WF5 (Campanhas) ←── Webhook do dashboard (gestor)
  └── WF2 (Disparo) com rate limiting

WF6 (Diagnóstico) ← Cron 18h
  └── Email + Slack com relatório do dia
```

## Workflows

| Arquivo | Nome | Trigger | Descrição |
|---------|------|---------|-----------|
| WF1 | Scheduler Diário | Cron 08h | Busca leads ativos e dispara WF2 |
| WF2 | Disparo por Canal | Webhook | Envia mensagem via WhatsApp/SMS/Email |
| WF3 | Agente Conversacional | Webhook | Responde mensagens recebidas com IA |
| WF4 | Receptor de Pagamentos | Webhook | Processa confirmações de pagamento |
| WF5 | Campanhas | Webhook | Executa campanhas manuais do gestor |
| WF6 | Diagnóstico | Cron 18h | Relatório diário por email/Slack |

## Credenciais Necessárias no n8n

Configure em **Settings > Credentials**:

| ID da Credencial | Tipo | Usado por |
|-----------------|------|-----------|
| `supabase-pg` | PostgreSQL | Todos os WFs |
| `anthropic-api` | Anthropic API | WF3 |
| `smtp-planomais` | SMTP | WF2, WF4, WF6 |

## Variáveis de Ambiente (n8n Variables)

Configure em **Settings > Variables**:

| Variável | Descrição |
|----------|-----------|
| `ZAPI_INSTANCE` | ID da instância Z-API |
| `ZAPI_TOKEN` | Token da instância Z-API |
| `ZENVIA_API_TOKEN` | Token da API Zenvia (SMS) |
| `SLACK_WEBHOOK_URL` | URL do webhook do Slack (WF6, opcional) |

## Como Importar

1. Abra seu n8n
2. Clique em **Workflows > Import from File**
3. Selecione os arquivos `.json` desta pasta
4. Configure as credenciais antes de ativar

## Fluxo de Dados

```
Supabase (leads)
  → WF1 filtra e prioriza
  → WF2 envia mensagem + registra em mensagens
  → WF3 recebe respostas do WhatsApp
  → WF4 recebe confirmação de pagamento
  → Supabase (leads.status = 'pago')
  → WF6 lê dados e gera relatório
```

## Anti-Abuso

- Máximo 3 contatos/semana por lead
- Horário permitido: 08h–20h
- Leads em fase `pos` (>180 dias): apenas contato manual
- Rate limiting no WF5: 30 mensagens/minuto
- WF2 não retenta automaticamente em caso de erro

## Régua de Cobrança

| Fase | Dias | Desconto | Canais |
|------|------|----------|--------|
| pre | 0 | — | WhatsApp |
| mes1 | 1–30 | — | WhatsApp, SMS |
| mes2 | 31–60 | — | WhatsApp, SMS, Email |
| mes3 | 61–90 | 5% | WhatsApp, SMS, Email |
| mes4 | 91–120 | 15% | WhatsApp, SMS, Email, Ligação |
| mes5 | 121–150 | 20% | WhatsApp, SMS, Email, Ligação |
| pos | >150 | — | Ligação, Carta (manual) |
