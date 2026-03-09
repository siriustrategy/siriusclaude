# Task: validate-process

```yaml
name: validate-process
executor: process-validator
execution_type: autonomous
elicit: false
estimated_time: 5-10min
description: >
  Aplica as 8 veto conditions em todos os artefatos gerados.
  Resultado: PASS (todos os artefatos aprovados) ou VETO
  (lista exata do que corrigir e para qual agente devolver).
```

---

## PRÉ-CONDIÇÕES

- Playbook humano disponível (output de create-playbook)
- Skill manifest disponível (output de create-skill-manifest)
- n8n handoff disponível (output de create-n8n-handoff) — se n8n_needed = true

## REGRA GERAL

Não existe "quase aprovado". É PASS ou VETO.
VETO em qualquer VC = processo inteiro não avança.
Especificar: qual VC, qual artefato, qual seção, o que exatamente mudar.

---

## EXECUÇÃO

### Passo 1 — Validar Playbook Humano

Checar cada VC aplicável ao playbook:

**VC_001 — Owner Definido**
- Verificar: todas as fases têm executor marcado (🤖/👤/🔀)?
- Verificar: steps de ação têm who definido?
- VETO SE: qualquer fase ou step crítico sem owner

**VC_002 — Critério de Done**
- Verificar: cada fase tem "Critério de Conclusão" verificável?
- Checar se contém palavras subjetivas: "quando resolver", "quando confirmar", "quando estiver ok"
- VETO SE: qualquer critério é subjetivo ou ausente

**VC_006 — Scripts Presentes**
- Verificar: todo step de comunicação tem script ou template exato?
- Checar se há apenas orientações sem conteúdo concreto
- VETO SE: qualquer step de comunicação tem só orientação

**VC_007 — Fluxo Unidirecional**
- Verificar: há algum step com "voltar para", "repetir fase", "retornar"?
- Verificar: dependências circulares (Fase A → Fase B → Fase A)?
- VETO SE: qualquer circularidade detectada

---

### Passo 2 — Validar Skill Manifest

**VC_003 — Output Schema Definido**
- Para cada step: verificar se tem `output.fields` com `name`, `type`, `required`
- VETO SE: qualquer step sem output schema

**VC_004 — Heurísticas Determinísticas**
- Para cada heurística: checar se usa "SE [campo] [operador] [valor]"
- Palavras proibidas: "quando necessário", "a critério de", "se aplicável", "pode ser", "talvez"
- VETO SE: qualquer heurística com linguagem subjetiva

**VC_005 — Escalation Definida**
- Para cada human_escalation: verificar trigger + escalate_to + data_to_pass + sla_hours
- VETO SE: qualquer escalation com "quando necessário" ou sem role/SLA

**VC_008 — Input/Output Compatíveis**
- Para cada par step[N] → step[N+1]:
  - Listar campos usados em step[N+1].heuristics + step[N+1].veto_conditions
  - Verificar se todos existem em step[N].output.fields
- VETO SE: qualquer campo usado não é produzido pelo step anterior

---

### Passo 3 — Validar n8n Handoff (se aplicável)

**Verificações específicas do handoff:**
- Trigger tem dados mapeados? (schema JSON presente)
- Cada node tem tipo n8n identificado?
- Cada integração externa tem credencial identificada?
- Code nodes têm input e output schema definidos?
- Expressões dinâmicas mapeadas para sintaxe n8n?

---

### Passo 4 — Gerar Relatório

Formato obrigatório:

```markdown
# Relatório de Validação — {nome do processo}
**Data:** {timestamp}
**Validador:** process-validator

---

## Resultado Geral
**STATUS: PASS ✅** | **STATUS: VETO ❌**

---

## Checklist — Playbook Humano

| VC | Condição | Status | Localização | Problema |
|----|---------|--------|-------------|---------|
| VC_001 | Owner definido | ✅/❌ | [onde] | [o que falta] |
| VC_002 | Critério de done | ✅/❌ | [onde] | [o que falta] |
| VC_006 | Scripts presentes | ✅/❌ | [onde] | [o que falta] |
| VC_007 | Fluxo unidirecional | ✅/❌ | [onde] | [o que falta] |

## Checklist — Skill Manifest

| VC | Condição | Status | Localização | Problema |
|----|---------|--------|-------------|---------|
| VC_003 | Output schema | ✅/❌ | [onde] | [o que falta] |
| VC_004 | Heurísticas determinísticas | ✅/❌ | [onde] | [o que falta] |
| VC_005 | Escalation definida | ✅/❌ | [onde] | [o que falta] |
| VC_008 | Input/output compatível | ✅/❌ | [onde] | [o que falta] |

## Checklist — n8n Handoff (se aplicável)

| Verificação | Status | Problema |
|-------------|--------|---------|
| Triggers mapeados | ✅/❌ | |
| Nodes identificados | ✅/❌ | |
| Credenciais identificadas | ✅/❌ | |
| Expressões mapeadas | ✅/❌ | |

---

## Ações Requeridas

{SE PASS:}
✅ Todos os artefatos aprovados. Pronto para entrega.

{SE VETO:}
❌ VETO — Correções necessárias antes de avançar:

**Devolver para playbook-architect:**
- [descrição exata da correção — seção, o que mudar]

**Devolver para ai-workflow-engineer:**
- [descrição exata da correção — step/heurística, o que mudar]

**Devolver para n8n-packager:**
- [descrição exata da correção]

---
Após correções: reenviar para process-validator para re-validação.
```

---

### Passo 5 — Rotear Resultado

**SE PASS:**
- Notificar process-forge-chief: "Todos aprovados. Pronto para entrega ao usuário."

**SE VETO:**
- Enviar correções específicas para cada agente responsável
- Aguardar re-submissão
- Re-validar os itens corrigidos (não re-validar o que já passou)

---

## OUTPUT

```yaml
output:
  format: markdown
  filename: validation-report-{process-name}.md
  result: PASS | VETO
  passes_to:
    - agent: process-forge-chief
      data: resultado (PASS ou lista de VETOs)
    - agents_if_veto:
        - playbook-architect (se veto em playbook)
        - ai-workflow-engineer (se veto em manifest)
        - n8n-packager (se veto em handoff)
```

## COMPLETION CRITERIA

Relatório gerado com resultado claro (PASS ou VETO).
VETO: lista exata de correções por agente responsável.
PASS: notificação enviada ao process-forge-chief.
