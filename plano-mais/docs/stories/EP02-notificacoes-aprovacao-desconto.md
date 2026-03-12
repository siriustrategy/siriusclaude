# EP02 — Notificações In-App + Aprovação de Desconto

**Status:** Done
**Epic:** Sistema de Notificações e Aprovação
**Data:** 2026-03-11
**Criado por:** Orion (AIOS Master)

---

## Objetivo

Implementar sistema de notificações em tempo real dentro do dashboard (badge + dropdown),
e o fluxo de aprovação de desconto pelo gestor (notificação → modal com contexto → Aprovar/Negar).

---

## Regras de Negócio

- Atendente solicita desconto extra para um lead → gestor recebe notificação URGENTE
- Gestor vê modal com: lead, fase, valor em aberto, desconto pedido, histórico do lead
- Gestor clica Aprovar → atendente é notificado → desconto liberado
- Gestor clica Negar → atendente é notificado com motivo
- Notificações também para: "Lead quer cancelar — URGENTE", "Nova mensagem do lead X"
- Badge com contador no header
- Dropdown de notificações ordenadas por prioridade

---

## Tasks

- [x] EP02-T01: Criar tabela `notificacoes` no Supabase (migration 009)
- [x] EP02-T02: Criar componente `<NotificacoesDropdown />` no Header (com mock data)
- [x] EP02-T02b: Badge com contador de não lidas + animação glow
- [x] EP02-T02c: Notif de venda_robo criada no `pagar/route.ts` ao confirmar cartão
- [x] EP02-T06: Marcar notificações como lidas (in-memory, mock phase)
- [x] EP02-T03: Realtime subscription Supabase para novas notificações (substituir mock)
- [x] EP02-T04: Modal de aprovação de desconto (gestor) — Aprovar/Negar (via AprovarDescontoCard no dropdown)
- [x] EP02-T05: API route para criar notificações (atendente solicitar desconto)

---

## Acceptance Criteria

- [ ] Badge no header mostra número de notificações não lidas
- [ ] Dropdown lista notificações por prioridade
- [ ] Gestor recebe notificação de solicitação de desconto
- [ ] Modal de aprovação mostra contexto completo do lead
- [ ] Aprovação/negação notifica o atendente em tempo real
