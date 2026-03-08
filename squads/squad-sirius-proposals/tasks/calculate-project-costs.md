# Task: Calcular Custos Reais do Projeto
# Executor: @corey-quinn (primário) + @patrick-campbell (validação de pricing)
# Tipo: Análise — baseada nos planos definidos pelo @hormozi

## Objetivo
Calcular o custo real de cada plano (infra + APIs + tempo) e validar as margens.

## Inputs necessários
- planos-oferta-[cliente].md (do @hormozi)
- infrastructure-costs-reference.md
- pricing-reference.md
- briefing-cliente.md (para contexto de volume)

## Passos — @corey-quinn

### Passo 1: Listar componentes de cada plano
Para cada plano, identificar:
- Quais tecnologias de hospedagem (Vercel, VPS, etc.)
- Banco de dados (Supabase — qual plano)
- APIs consumidas (Claude, WhatsApp, pagamentos)
- Ferramentas de terceiros (Z-API, etc.)

### Passo 2: Estimar volumes de uso
Perguntar ao usuário ou estimar baseado no tamanho do cliente:
- Quantos usuários ativos/mês esperados?
- Volume de conversas WhatsApp/mês (se agente)
- Volume de chamadas de API IA/mês
- Armazenamento estimado

### Passo 3: Calcular em 3 cenários
Para cada plano, calcular:
- Início (3-6 meses): volume baixo/médio
- Crescimento (6-18 meses): volume multiplicado por 3x
- Escala (18m+): volume multiplicado por 10x

### Passo 4: Identificar custos ocultos
Verificar lista obrigatória:
- [ ] MAU extra no Supabase?
- [ ] Bandwidth extra no Vercel?
- [ ] Tokens de contexto nas APIs de IA?
- [ ] Taxa por mensagem no WhatsApp API oficial?
- [ ] Custo de backup e monitoramento?
- [ ] Domínio + SSL (anual ÷ 12)?

### Passo 5: Estimar horas de desenvolvimento
Por componente de cada plano, usando reference de horas em infrastructure-costs-reference.md:
- Listar componentes
- Estimar horas de implementação
- Calcular custo (perguntar valor hora ao usuário se não estiver em pricing-reference.md)

### Passo 6: Calcular custo total
Para cada plano:
```
Custo mensal = Infra + APIs (volume início) + Manutenção (X% das horas de dev / 12)
Custo implementação = Horas de dev × Valor hora
```

## Passos — @patrick-campbell (após @corey-quinn)

### Passo 1: Receber custos do @corey-quinn

### Passo 2: Estimar valor gerado para o cliente
Baseado no setor e nas dores identificadas:
- Que resultado financeiro esse plano gera para o cliente?
- Quanto economiza em processos manuais?
- Quanto aumenta em receita (novos leads, conversão)?

### Passo 3: Definir preço por valor
```
Preço mínimo = Custo real ÷ 0.35 (garante 65% de margem)
Preço por valor = 10-30% do valor anual gerado para o cliente
Preço final = max(Preço mínimo, Preço por valor) — ajustado ao mercado
```

### Passo 4: Verificar preços base
- Consultar pricing-reference.md
- Se preços base existem, usar como referência
- Confirmar com usuário: "Com base no custo real e no valor gerado, sugiro: [preços]. Quer ajustar?"

### Passo 5: Validar margens
Para cada plano:
- Margem implementação: (Preço impl - Custo impl) / Preço impl
- Margem MRR: (MRR - Custo mensal) / MRR
- ✅ Se ≥ 65% (MRR) e ≥ 60% (impl): OK
- ⚠️ Se 50-65%: alertar usuário
- ❌ Se < 50%: bloquear e pedir revisão

### Passo 6: Calcular LTV + expansion path
- LTV 12m = MRR × 12
- LTV 24m = MRR × 24 (ajustado por churn estimado)
- Expansion: quando/como o cliente naturalmente vai para o próximo plano

## Output
- analise-custos-[cliente].md
- pricing-final-[cliente].md

## Completion Criteria
- [ ] Todos os componentes listados para cada plano
- [ ] 3 cenários de custo calculados
- [ ] Custos ocultos verificados
- [ ] Margens validadas (mínimo 65% MRR, 60% impl)
- [ ] Preço confirmado com usuário
- [ ] LTV projetado calculado

## Veto Conditions
- ❌ Avançar com margem MRR < 60% sem alerta explícito e aprovação do usuário
- ❌ Avançar com margem de implementação < 50%
- ❌ Apresentar preços sem verificar pricing-reference.md primeiro
