# EP01 — Checkout com Cell Coin API

**Status:** Done
**Epic:** Página de Checkout Público
**Data:** 2026-03-11
**Criado por:** Orion (AIOS Master)

---

## Objetivo

Substituir mock data + referência Asaas pelo checkout real conectado ao Supabase + Cell Coin API.

O checkout é uma página **pública** (sem login), acessada via link único enviado pelo bot ou atendente.
Ao acessar, o lead vê o valor real em aberto, o desconto aplicado conforme a fase e as opções de parcelamento.

---

## Regras de Negócio

### Descontos por fase
| Fase | Desconto | Parcelamento |
|------|----------|--------------|
| pre, mes1, mes2 | 0% | Apenas à vista |
| mes3 | 5% (validade 48h) | Apenas à vista |
| mes4 | 15% | 2x ou 3x sem juros |
| mes5 | 20% | 3x sem juros |
| pos | 0% (negotiation) | Conforme acordo |

### Token de checkout
- Gerado na tabela `checkout_tokens`
- Campos: `lead_id`, `token`, `usado`, `expira_em`, `valor`, `desconto`
- Expiração: 7 dias
- Uso único: após pagamento confirmado, `usado = true`
- Se token expirado ou já usado → mostrar tela de erro

### Valor final
```
valor_final = token.valor - (token.valor * token.desconto / 100)
parcela_2x = valor_final / 2
parcela_3x = valor_final / 3
```

---

## Tasks

- [x] EP01-T01: Criar API route GET `/api/checkout/[token]` — busca token + lead no Supabase
- [x] EP01-T02: Criar API route POST `/api/checkout/pagar` — integração Cell Coin
- [x] EP01-T03: Atualizar checkout page para usar dados reais (sem mock)
- [x] EP01-T04: Troca de "Asaas" → "Cell Coin" em textos e comentários
- [x] EP01-T05-WA: PIX gerado → envia código via WhatsApp (Z-API) com mensagem formatada
- [x] EP01-T06-WA: Boleto gerado → envia link + código de barras via WhatsApp (Z-API)
- [x] EP01-T07: Migration 009 — tabela `cobrancas_pendentes` (régua de lembretes) + campos `metodo_pagamento/parcelas` em checkout_tokens
- [x] EP01-T08: Régua de lembretes — estrutura de dados pronta (n8n em EP03 fará o envio): 15min / 24h / 3 dias
- [x] EP01-T09: Webhook Cell Coin → atualizar lead no CRM + marcar `cobranca_pendente` como paga após confirmação PIX/Boleto

---

## Acceptance Criteria

- [ ] Lead acessa `/checkout/[token]` e vê seu nome, plano e valor em aberto real
- [ ] Desconto aplicado automaticamente conforme fase do lead
- [ ] Parcelamento disponível apenas nas fases mes4 e mes5
- [ ] PIX gera QR code real via Cell Coin
- [ ] Cartão processa via Cell Coin
- [ ] Boleto gerado via Cell Coin e enviado ao WhatsApp do lead
- [ ] Após pagamento: lead.status → 'pago', checkout_token.usado → true
- [ ] Token expirado mostra página de erro
- [ ] Token já usado mostra página de "Plano já regularizado"

---

## Files Modificados/Criados

- `app/checkout/[token]/page.tsx` — conectado ao Supabase + Cell Coin
- `app/api/checkout/[token]/route.ts` — GET do token
- `app/api/checkout/pagar/route.ts` — POST pagamento Cell Coin
- `supabase/migrations/009_checkout_melhorias.sql` — campos adicionais
- `app/api/checkout/webhook-cellcoin/route.ts` — webhook de confirmação Cell Coin
