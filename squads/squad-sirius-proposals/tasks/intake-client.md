# Task: Intake do Cliente
# Executor: sirius-proposals-chief
# Tipo: Elicitation — requer interação com o usuário

## Objetivo
Coletar todas as informações necessárias sobre o cliente antes de iniciar a criação da proposta.

elicit: true

## Perguntas Obrigatórias (fazer uma a uma, de forma conversacional)

### Bloco 1 — Identificação
1. "Qual o nome completo da empresa do cliente?"
2. "Qual o setor de atuação deles? (ex: saúde, logística, varejo, serviços, imóveis...)"
3. "Qual o tamanho da empresa? (número de funcionários ou faturamento aproximado)"
4. "Com quem você vai apresentar a proposta? (nome + cargo do decisor)"

### Bloco 2 — Contexto da Oportunidade
5. "O que esse cliente espera conseguir? Qual o objetivo principal deles?"
6. "Quais dores ou problemas eles mencionaram? (pode ser vago, qualquer coisa)"
7. "Como essa oportunidade surgiu? (indicação, reunião cold, evento...)"
8. "Você tem ideia do budget deles, mesmo que vago? (ex: 'até R$10k', 'não sei', 'estão abertos')"

### Bloco 3 — Stack Atual (perguntar de forma simples)
9. "Eles já têm site? (sim/não/desatualizado)"
10. "Usam algum CRM ou sistema de vendas? (sim/não/qual)"
11. "Têm presença em redes sociais? (Instagram, LinkedIn...)"
12. "Usam WhatsApp Business para atendimento? (sim/não)"

### Bloco 4 — Urgência e Prazo
13. "Qual a urgência? (querem resolver logo, podem esperar, não declararam)"
14. "Tem data de reunião marcada para apresentar?"

### Bloco 5 — Materiais (opcional mas valioso)
15. "Você tem algum desses materiais para me passar?"
    - Gravação ou pauta da reunião com o cliente
    - Site ou LinkedIn da empresa
    - Nome dos concorrentes principais do cliente
    - Proposta anterior (de outro fornecedor, se houver)

## Comportamento
- Fazer as perguntas de forma conversacional, não como formulário
- Aceitar respostas vagas — registrar como "não declarado"
- Não pular nenhum bloco obrigatório (Blocos 1-3)
- Blocos 4-5 são importantes mas podem ter respostas em branco

## Output
Gerar briefing-cliente.md com todas as informações coletadas organizadas.

## Completion Criteria
- [ ] Blocos 1, 2 e 3 completos (mesmo que com "não sabe" em alguns campos)
- [ ] briefing-cliente.md gerado
- [ ] Pronto para passar para @maister

## Veto Conditions
- ❌ Avançar sem nome da empresa
- ❌ Avançar sem pelo menos 1 dor identificada
- ❌ Gerar proposta sem setor de atuação
