# Task: elicit-process-context

```yaml
name: elicit-process-context
executor: process-forge-chief
execution_type: interactive
elicit: true
estimated_time: 5-10min
description: >
  12 perguntas estruturadas que extraem todo o contexto necessário
  antes de montar qualquer artefato. Output é o JSON de contexto
  que alimenta todos os outros agentes.
```

---

## PRÉ-CONDIÇÕES

- Usuário descreveu o processo que quer criar (mesmo que vagamente)
- Não iniciar nenhum outro agente antes de completar esta task

## VETO CONDITIONS

- Prosseguir sem resposta às perguntas obrigatórias (marcadas com *) → VETO
- Aceitar resposta vaga em pergunta de critério de done → VETO
- Assumir canal de comunicação não confirmado → VETO

---

## EXECUÇÃO

### Passo 1 — Abertura

Apresentar ao usuário:

```
Process Forge — Elicitação de Contexto

Vou fazer 12 perguntas para entender o processo a fundo.
Quanto mais específico você for, mais completo e preciso fica o output.

Pode responder todas de uma vez ou uma por vez — como preferir.
```

---

### Passo 2 — As 12 Perguntas

Apresentar em blocos temáticos:

---

**BLOCO A — O PROCESSO**

```
1.* Qual é o nome/objetivo do processo?
   (ex: "Cobrança de inadimplentes", "Onboarding de novos clientes")

2.* O que dispara o processo? O que faz ele começar?
   (ex: "cliente atrasa pagamento", "novo contrato assinado", "lead qualificado")

3.* Qual é o resultado ideal quando o processo funciona perfeitamente?
   (ex: "cliente paga em até 15 dias", "lead vira cliente em até 30 dias")

4. Qual é o pior cenário que o processo deve evitar?
   (ex: "perder o cliente", "fraude", "retrabalho manual")
```

---

**BLOCO B — A EMPRESA E O CONTEXTO**

```
5.* Qual é o tom de voz da empresa neste processo?
   (ex: "formal e respeitoso", "próximo e informal", "direto e objetivo")
   Se tiver exemplos de comunicação atual, melhor ainda.

6. Qual é o perfil de quem recebe o processo? (cliente, funcionário, parceiro)
   (ex: "clientes B2B, ticket médio R$2.400, contratos anuais")

7. Quais ferramentas/sistemas estão disponíveis?
   (ex: HubSpot, WhatsApp Business, email, planilha, Slack, outro CRM)
```

---

**BLOCO C — OS EXECUTORES**

```
8.* Quem executa o processo? (marque todos que se aplicam)
   [ ] Humano (time interno)
   [ ] IA/skill (automático)
   [ ] Automação/n8n (gatilho automático)
   [ ] Externo (cliente, parceiro)

   Para cada executor humano: qual cargo/role?
```

---

**BLOCO D — PRAZOS E RÉGUA**

```
9. O processo tem prazo? Tem fases por tempo?
   (ex: "D+1, D+3, D+7" ou "semana 1, semana 2" ou "sem prazo fixo")

10. Qual é o critério de conclusão do processo inteiro?
    O que aconteceu para você dizer "processo concluído"?
    (resposta precisa ser verificável: campo = valor, status = X, etc.)
```

---

**BLOCO E — AUTOMAÇÃO**

```
11. Alguma parte do processo é candidata a automação via n8n?
    (ex: notificações automáticas, integrações entre sistemas, triggers por tempo)

12. Tem alguma regra de negócio importante que não pode esquecer?
    (ex: "nunca ligar depois das 20h", "clientes VIP têm prioridade", "desconto máximo de 20%")
```

---

### Passo 3 — Consolidar Respostas em JSON

Após receber as respostas, gerar o Context JSON:

```json
{
  "process": {
    "name": "",
    "objective": "",
    "trigger": "",
    "success_criteria": "",
    "failure_to_avoid": ""
  },
  "company": {
    "tone_of_voice": "",
    "target_profile": "",
    "tools_available": [],
    "business_rules": []
  },
  "executors": {
    "human_roles": [],
    "ai_enabled": true,
    "n8n_needed": true,
    "external_parties": []
  },
  "timeline": {
    "has_time_phases": true,
    "phases": [],
    "completion_criteria": ""
  },
  "automation": {
    "n8n_candidates": [],
    "integrations_needed": [],
    "triggers_by_time": true
  }
}
```

---

### Passo 4 — Apresentar Sumário para Aprovação

Antes de avançar, apresentar ao usuário:

```
Process Forge — Contexto Extraído

[Sumário em linguagem natural do que foi captado]

Processo: [nome]
Objetivo: [objetivo]
Dispara quando: [trigger]
Executores: [lista]
Tom: [tom]
Precisa de n8n: [Sim/Não]
Prazo/Régua: [resumo]

Aprovado para avançar? [s/n]
Se quiser ajustar algo antes de prosseguir, diga agora.
```

---

## OUTPUT

```yaml
output:
  format: json
  file: context-{process-name}.json
  passes_to:
    - agent: context-analyst
      data: context_json_completo
```

## COMPLETION CRITERIA

Todas as perguntas obrigatórias (*) respondidas AND usuário aprovou o sumário.
