# EP03 — n8n Workflows (6 Automações)

**Status:** Done
**Epic:** Motor de Cobrança + Agente IA WhatsApp
**Data:** 2026-03-11
**Criado por:** Orion (AIOS Master)

---

## Objetivo

Implementar os 6 workflows n8n do sistema de cobrança conforme o PRD.
Todos já conectados ao Supabase e Z-API (WhatsApp).

---

## Workflows

### WF1 — Scheduler Diário (08:00)
- Recalcula `dias_atraso` e `fase_cobranca` para todos os leads ativos
- Distribui leads para WF2

### WF2 — Disparo por Fase
- Monta contexto CRM por lead
- Personaliza mensagem via template (nome, plano, valor, fase)
- Dispara via Z-API no horário ótimo do lead

### WF3 — Agente Conversacional IA
- Recebe resposta do lead via webhook Z-API
- Detecta intenção: pagar / dúvida / cancelar / silêncio / problema
- Árvore de decisão conforme playbook
- Escalona para atendente quando necessário
- Gera e envia link de checkout via Cell Coin

### WF4 — Receptor de Pagamentos (Webhook Cell Coin)
- Recebe confirmação de pagamento
- Atualiza lead: status → 'pago', registro de pagamento
- Notifica atendente/gestor no dashboard
- Envia confirmação WhatsApp ao lead

### WF5 — Campanhas Manuais
- Recebe segmentação e template da campanha
- Personaliza por lead via IA
- Dispara em lotes de 50 (30s entre lotes)

### WF6 — Diagnóstico Pós-D+150
- Encerra processo de cobrança
- Coleta motivo, aplica tag, atualiza status

---

## Tasks

- [x] EP03-T01: WF1 — Scheduler Diário (Cron 08:00 → Supabase update fase)
- [x] EP03-T02: WF2 — Disparo por Fase (template + Z-API + token checkout real)
- [x] EP03-T03: WF3 — Agente Conversacional (webhook Z-API → Claude Haiku → árvore)
- [x] EP03-T04: WF4 — Receptor Cell Coin (webhook → Supabase → notificação dashboard)
- [x] EP03-T05: WF5 — Campanhas Manuais (batch disparo com rate limiting)
- [x] EP03-T06: WF6 — Diagnóstico Diário (Cron 18h → email gestor + Slack)
- [x] EP03-T07: WF3 registra custo em `custos_operacao` (Claude Haiku API)

---

## Dependencies

- Z-API configurado e funcionando
- Cell Coin webhook URL registrado
- LLM API (Claude ou GPT-4) configurado no n8n
- Supabase URL + Service Key nas env vars do n8n
