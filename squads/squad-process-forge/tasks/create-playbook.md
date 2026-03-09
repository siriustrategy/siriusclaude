# Task: create-playbook

```yaml
name: create-playbook
executor: playbook-architect
execution_type: autonomous
elicit: false
estimated_time: 15-20min
description: >
  Transforma Process Layers (1-3) em Playbook Humano completo.
  Usa templates/playbook-tmpl.md como base.
  Output: arquivo markdown pronto para o time usar.
```

---

## PRÉ-CONDIÇÕES

- Process Layers Document disponível (output de map-process-layers)
- Acesso às layers 1, 2 e 3

## VETO CONDITIONS

- Step de comunicação sem script exato → VETO
- Fase sem critério de done verificável → VETO
- Fase sem executor definido → VETO
- Tom de voz genérico ("ser educado") sem exemplos aplicados → VETO
- Objeção listada sem resposta → VETO

---

## EXECUÇÃO

### Passo 1 — Carregar Template

Usar `templates/playbook-tmpl.md` como estrutura base.
Preencher seção por seção a partir do Process Layers Document.

---

### Passo 2 — Seção 1: Contexto Estratégico

A partir de Layer 1:

```markdown
## 1. Contexto Estratégico

**Objetivo:** {layer_1.objective}
**Dispara quando:** {layer_1.trigger}
**Sucesso é:** {layer_1.success_criteria}
**Evitar a todo custo:** {layer_1.failure_to_avoid}

### Métricas de Acompanhamento
| KPI | Como medir | Meta |
|-----|-----------|------|
{layer_1.kpis}

### Fronteiras
**Dentro do escopo:** {layer_1.boundaries.in_scope}
**Fora do escopo:** {layer_1.boundaries.out_of_scope}

### Regras de Negócio
{layer_1.business_rules — listadas com clareza}
```

---

### Passo 3 — Seção 2: Personas Envolvidas

A partir de Layer 2 (executores):

```markdown
## 2. Personas Envolvidas

### Executores Internos
| Role | Responsabilidade | Quando entra |
|------|-----------------|-------------|
{para cada human_role nas fases}

### Perfil do Cliente/Receptor
{company.target_profile — expandido com implicações práticas}
```

---

### Passo 4 — Seção 3: Tom de Voz por Fase

Derivar do company.tone_of_voice + fases:

```markdown
## 3. Tom de Voz por Fase

| Fase | Tom | Como soa na prática | O que evitar |
|------|-----|-------------------|-------------|
{para cada fase — tom aplicado, não genérico}

### Exemplos de Linguagem
**Tom [X]:** "[frase exemplo que captura o tom"
**Nunca dizer:** "[exemplo do que foge do tom]"
```

Regra: tom deve ser específico por fase. Se o processo tem escalada de urgência,
o tom evolui (suave → neutro → firme).

---

### Passo 5 — Seção 4: Régua Completa

Para CADA fase, criar bloco completo:

```markdown
## 4. Régua Completa

---

### Fase {N}: {nome}

**Dispara quando:** {trigger.condition} ({trigger.timing})
**Executor:** {emoji} {executor}
**Canal:** {channel}
**Duração máxima:** {estimated_duration}

#### O que fazer (passo a passo)
1. {step 1}
2. {step 2}
[etc]

#### Script / Template
> {conteúdo exato — com [campos dinâmicos] marcados}

#### Objeções Comuns
| Objeção | Resposta |
|---------|----------|
| "{objeção 1}" | {resposta 1} |
| "{objeção 2}" | {resposta 2} |

#### Critério de Conclusão
✅ Fase concluída quando: {condição objetiva e verificável}

#### Output para próxima fase
Registrar em {sistema/campo}: {o que registrar}
Passar para Fase {N+1}: {dados específicos}

---
```

Regras obrigatórias:
- Script SEMPRE em primeira pessoa ou no formato exato de envio
- [nome], [valor], [link] entre colchetes para campos dinâmicos
- Objeções: mínimo 2 por fase de comunicação, máximo sem limite
- Critério de done: NUNCA subjetivo

---

### Passo 6 — Seção 5: Escalation Guide

```markdown
## 5. Escalation Guide

### Quando escalar
| Situação | Escalar para | O que comunicar | SLA de resposta |
|----------|-------------|----------------|----------------|
{para cada human_escalation_trigger nas layers}

### Como escalar
1. Registrar [campo] = [valor] no sistema
2. Acionar [role] via [canal] com: [informações obrigatórias]
3. Documentar: data, situação, dados do cliente
```

---

### Passo 7 — Seção 6: Anti-Padrões

```markdown
## 6. Anti-Padrões — O que NUNCA fazer

{layer_1.failure_to_avoid + business_rules negativos}

| ❌ Nunca | ✅ Em vez disso |
|---------|----------------|
| [anti-padrão 1] | [alternativa correta] |
[mínimo 3 anti-padrões]
```

---

### Passo 8 — Seção 7: Onde a IA Assume

```markdown
## 7. Onde a IA Assume (e onde o humano assume)

| Fase | Executor | O que a IA faz | O que o humano faz |
|------|----------|---------------|-------------------|
{para cada fase com executor híbrido ou duplo}

### Quando a IA para e chama o humano
{human_escalation_triggers da Layer 4 — em linguagem simples}
```

---

## OUTPUT

```yaml
output:
  format: markdown
  filename: playbook-{process-name}.md
  sections: 7
  passes_to:
    - agent: process-validator
      for: veto check (VC_001, VC_002, VC_006, VC_007)
```

## COMPLETION CRITERIA

Playbook gerado com todas as 7 seções preenchidas.
Todas as fases têm script (se comunicação) e critério de done verificável.
Tom de voz aplicado por fase, não genérico.
