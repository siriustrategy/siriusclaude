# Epic 09: Credits & Billing
**Status:** Backlog — PRIORIDADE MÁXIMA (infraestrutura)
**Priority:** Crítica — deve existir antes de qualquer outra feature
**Squad:** nenhum squad específico (infraestrutura de plataforma)

## Visão
O sistema de créditos é a espinha dorsal financeira do produto. Deve ser simples de entender,
transparente e nunca surpreender o usuário. Referência: Lovable.dev.

## User Stories

### Story 09.01: Schema de Créditos no Banco
**Como** sistema,
**Preciso** de tabelas para controlar saldo, consumo e histórico de créditos,
**Para** ter controle financeiro preciso por usuário.

**Acceptance Criteria:**
- [ ] Tabela `user_credits` (user_id, balance, plan, reset_date)
- [ ] Tabela `credit_ledger` (id, user_id, action, amount, balance_after, metadata, created_at)
- [ ] RLS configurado (usuário só vê seus próprios dados)
- [ ] Transações atômicas (nunca cobrar sem sucesso confirmado)
- [ ] Função `deduct_credits(user_id, amount, action)` com validação de saldo

### Story 09.02: Saldo Visível e Persistente
**Como** usuário da plataforma,
**Quero** ver meu saldo de créditos sempre visível,
**Para** saber o que posso fazer sem surpresas.

**Acceptance Criteria:**
- [ ] Badge de créditos no header, sempre visível
- [ ] Atualização em tempo real após cada ação
- [ ] Ao clicar: abre modal com histórico de uso dos últimos 30 dias
- [ ] Alerta visual quando saldo < 30 créditos
- [ ] Alerta crítico quando saldo < 10 créditos com botão de recarga

### Story 09.03: Custo Antes de Executar
**Como** usuário,
**Quero** ver quanto uma ação vai custar antes de confirmar,
**Para** nunca ser pego de surpresa.

**Acceptance Criteria:**
- [ ] Tooltip com custo em todo botão de ação que consome créditos
- [ ] Modal de confirmação mostrando: ação, custo, saldo atual, saldo após
- [ ] Se saldo insuficiente: modal mostra custo + botão "Recarregar créditos"
- [ ] Créditos nunca debitados antes do resultado ser entregue com sucesso

### Story 09.04: Planos e Assinaturas
**Como** usuário que quer mais créditos,
**Quero** escolher um plano de assinatura,
**Para** ter créditos mensais sem precisar recarregar manualmente.

**Acceptance Criteria:**
- [ ] Página de planos: Free / Pro (R$97) / Academy (R$57 com verificação)
- [ ] Pagamento via Stripe (cartão de crédito)
- [ ] Créditos renovados automaticamente todo dia 1 do mês
- [ ] Downgrade: mantém créditos até fim do período pago
- [ ] Cancelamento: manter acesso até fim do período
- [ ] Verificação de matrícula Academy via integração Sirius Academy

### Story 09.05: Compra de Créditos Avulsos
**Como** usuário Free ou Pro que precisa de créditos extras,
**Quero** comprar pacotes de créditos sem trocar de plano,
**Para** ter flexibilidade sem compromisso mensal.

**Acceptance Criteria:**
- [ ] Pacotes: 100 créditos (R$19), 300 créditos (R$47), 600 créditos (R$79)
- [ ] Créditos avulsos não expiram por 12 meses
- [ ] Débito automático do pacote avulso depois de esgotar créditos mensais
- [ ] Histórico de compras na página de billing

### Story 09.06: Trial Gratuito
**Como** novo usuário,
**Quero** experimentar a plataforma sem precisar colocar cartão,
**Para** entender o valor antes de pagar.

**Acceptance Criteria:**
- [ ] 7 dias com 100 créditos — sem cartão de crédito
- [ ] Ao fim do trial: convite para assinar plano
- [ ] Features disponíveis no trial: todas exceto auto-publicação
- [ ] Apenas 1 trial por email
