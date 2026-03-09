# Playbook: {{PROCESS_NAME}}

**Versão:** 1.0
**Criado em:** {{DATE}}
**Processo:** {{DOMAIN}}
**Status:** Ativo

---

## 1. Contexto Estratégico

**Objetivo do processo:**
{{OBJECTIVE}}

**Dispara quando:**
{{TRIGGER}}

**Sucesso é quando:**
{{SUCCESS_CRITERIA}}

**Evitar a todo custo:**
{{FAILURE_TO_AVOID}}

### Métricas de Acompanhamento

| KPI | Como medir | Meta | Frequência |
|-----|-----------|------|-----------|
| {{KPI_1_NAME}} | {{KPI_1_HOW}} | {{KPI_1_TARGET}} | {{KPI_1_FREQ}} |
| {{KPI_2_NAME}} | {{KPI_2_HOW}} | {{KPI_2_TARGET}} | {{KPI_2_FREQ}} |

### Fronteiras do Processo

**Dentro do escopo:**
- {{IN_SCOPE_1}}
- {{IN_SCOPE_2}}

**Fora do escopo:**
- {{OUT_OF_SCOPE_1}}
- {{OUT_OF_SCOPE_2}}

### Regras de Negócio

- {{BUSINESS_RULE_1}}
- {{BUSINESS_RULE_2}}

---

## 2. Personas Envolvidas

### Executores Internos

| Role | Responsabilidade neste processo | Entra em qual fase |
|------|---------------------------------|-------------------|
| {{ROLE_1}} | {{RESPONSIBILITY_1}} | {{PHASE_ENTRY_1}} |
| {{ROLE_2}} | {{RESPONSIBILITY_2}} | {{PHASE_ENTRY_2}} |

### Perfil do Receptor

**Quem é:**
{{TARGET_PROFILE}}

**O que motiva:**
{{TARGET_MOTIVATIONS}}

**O que teme:**
{{TARGET_FEARS}}

**Como prefere ser tratado:**
{{TARGET_COMMUNICATION_PREFERENCE}}

---

## 3. Tom de Voz por Fase

| Fase | Tom | Como soa | O que evitar |
|------|-----|----------|-------------|
| {{PHASE_1_NAME}} | {{TONE_1}} | "{{TONE_1_EXAMPLE}}" | {{TONE_1_AVOID}} |
| {{PHASE_2_NAME}} | {{TONE_2}} | "{{TONE_2_EXAMPLE}}" | {{TONE_2_AVOID}} |

### Vocabulário Autorizado

**Usar:**
- {{APPROVED_WORD_1}}
- {{APPROVED_WORD_2}}

**Nunca usar:**
- {{FORBIDDEN_WORD_1}} → usar {{ALTERNATIVE_1}} em vez disso
- {{FORBIDDEN_WORD_2}} → usar {{ALTERNATIVE_2}} em vez disso

---

## 4. Régua Completa

---

### Fase 1: {{PHASE_1_NAME}}

**Dispara quando:** {{PHASE_1_TRIGGER}}
**Executor:** {{PHASE_1_EXECUTOR_EMOJI}} {{PHASE_1_EXECUTOR}}
**Canal:** {{PHASE_1_CHANNEL}}
**Prazo:** {{PHASE_1_DEADLINE}}

#### Passo a passo

1. {{STEP_1_1}}
2. {{STEP_1_2}}
3. {{STEP_1_3}}

#### Script / Template

> {{SCRIPT_1}}

*(Campos dinâmicos: [nome], [valor], [link] — substituir com dados reais)*

#### Objeções Comuns

| Objeção | Resposta |
|---------|----------|
| "{{OBJECTION_1_1}}" | {{RESPONSE_1_1}} |
| "{{OBJECTION_1_2}}" | {{RESPONSE_1_2}} |

#### Critério de Conclusão

✅ Fase 1 concluída quando: **{{COMPLETION_CRITERIA_1}}**

#### Output para Fase 2

Registrar em {{SYSTEM}}: `{{FIELD}} = {{VALUE}}`
Passar para Fase 2: {{HANDOFF_DATA_1}}

---

### Fase 2: {{PHASE_2_NAME}}

**Dispara quando:** {{PHASE_2_TRIGGER}}
**Executor:** {{PHASE_2_EXECUTOR_EMOJI}} {{PHASE_2_EXECUTOR}}
**Canal:** {{PHASE_2_CHANNEL}}
**Prazo:** {{PHASE_2_DEADLINE}}

#### Passo a passo

1. {{STEP_2_1}}
2. {{STEP_2_2}}

#### Script / Template

> {{SCRIPT_2}}

#### Objeções Comuns

| Objeção | Resposta |
|---------|----------|
| "{{OBJECTION_2_1}}" | {{RESPONSE_2_1}} |

#### Critério de Conclusão

✅ Fase 2 concluída quando: **{{COMPLETION_CRITERIA_2}}**

#### Output para Fase 3

Registrar em {{SYSTEM}}: `{{FIELD}} = {{VALUE}}`
Passar para Fase 3: {{HANDOFF_DATA_2}}

---

*[Repetir bloco de Fase para cada fase do processo]*

---

## 5. Escalation Guide

### Quando Escalar

| Situação | Escalar para | O que comunicar | SLA de resposta |
|----------|-------------|----------------|----------------|
| {{ESCALATION_1_TRIGGER}} | {{ESCALATION_1_TO}} | {{ESCALATION_1_DATA}} | {{ESCALATION_1_SLA}} |
| {{ESCALATION_2_TRIGGER}} | {{ESCALATION_2_TO}} | {{ESCALATION_2_DATA}} | {{ESCALATION_2_SLA}} |

### Como Escalar

1. Registrar `{{ESCALATION_FIELD}} = {{ESCALATION_VALUE}}` no {{SYSTEM}}
2. Acionar {{ROLE}} via {{CHANNEL}} com:
   - {{DATA_POINT_1}}
   - {{DATA_POINT_2}}
3. Documentar: data do escalonamento, situação, dados do cliente

### O que acontece se ninguém responder ao escalation em {{SLA_HOURS}}h

{{NO_RESPONSE_ACTION}}

---

## 6. Anti-Padrões — O que NUNCA fazer

| ❌ Nunca | ✅ Em vez disso |
|---------|----------------|
| {{ANTI_PATTERN_1}} | {{CORRECT_BEHAVIOR_1}} |
| {{ANTI_PATTERN_2}} | {{CORRECT_BEHAVIOR_2}} |
| {{ANTI_PATTERN_3}} | {{CORRECT_BEHAVIOR_3}} |

---

## 7. Onde a IA Assume (e onde o humano assume)

| Fase | Executor | O que a IA faz | O que o humano faz |
|------|----------|---------------|-------------------|
| {{PHASE_1_NAME}} | {{PHASE_1_EXECUTOR}} | {{AI_ACTION_1}} | {{HUMAN_ACTION_1}} |
| {{PHASE_2_NAME}} | {{PHASE_2_EXECUTOR}} | {{AI_ACTION_2}} | {{HUMAN_ACTION_2}} |

### A IA para e chama o humano quando

- {{AI_STOP_CONDITION_1}} → chama {{HUMAN_ROLE_1}}
- {{AI_STOP_CONDITION_2}} → chama {{HUMAN_ROLE_2}}

---

*Gerado por Process Forge Squad | Versão 1.0*
*Para atualizar: acionar process-forge-chief com as mudanças necessárias*
