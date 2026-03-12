# EP04 — Gerador de Link de Checkout

**Status:** Done
**Epic:** Ferramentas do Atendente + Gestor
**Data:** 2026-03-11
**Criado por:** Orion (AIOS Master)

---

## Objetivo

Permitir que atendentes e gestores gerem o link de checkout de um lead diretamente do chat ou da ficha do CRM,
com o desconto correto calculado automaticamente pela fase.

---

## Regras

- Botão "Gerar Link de Checkout" no header do chat (quando conversa está em atendimento humano)
- Botão "Gerar Link" na ficha do lead no CRM
- Sistema calcula desconto automaticamente pela `fase_cobranca` do lead
- Token gerado na tabela `checkout_tokens` com `expira_em = NOW() + 7 days`
- Link copiado para clipboard + enviado automaticamente via WhatsApp para o lead
- Na ficha do lead: histórico de links gerados (token, data, usado/expirado)

---

## Tasks

- [x] EP04-T01: API route POST `/api/checkout/gerar` — cria token no Supabase
- [x] EP04-T02: Botão "Gerar Link" no chat (header do atendente)
- [x] EP04-T03: Botão "Gerar Link" na ficha CRM
- [x] EP04-T04: Enviar link automaticamente via Z-API ao gerar
- [x] EP04-T05: Histórico de links na ficha do lead

---

## Acceptance Criteria

- [ ] Atendente clica "Gerar Link" → token criado no banco
- [ ] Link copiado para clipboard automaticamente
- [ ] Lead recebe link via WhatsApp em até 2 segundos
- [ ] Desconto calculado corretamente pela fase (5%, 15%, 20%)
- [ ] Token expira em 7 dias
