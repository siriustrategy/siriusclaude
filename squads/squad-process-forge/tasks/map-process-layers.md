# Task: map-process-layers

```yaml
name: map-process-layers
executor: context-analyst
execution_type: autonomous
elicit: false
estimated_time: 10-15min
description: >
  Transforma o Context JSON em Process Layers Document (5 camadas).
  Output alimenta playbook-architect e ai-workflow-engineer em paralelo.
```

---

## PRÉ-CONDIÇÕES

- Context JSON aprovado pelo usuário (output de elicit-process-context)
- Não inventar informação além do que está no JSON

## VETO CONDITIONS

- Mapear processo sem trigger definido → VETO
- Criar camada 4 com heurísticas subjetivas → VETO
- Criar camada 5 se n8n_needed = false no context JSON → VETO (não criar Layer 5 neste caso)
- Deixar step sem executor definido → VETO

---

## EXECUÇÃO

### Passo 1 — Identificar a Constraint (Goldratt)

Antes de mapear, identificar:

```
CONSTRAINT CHECK:
1. Qual step tem maior risco de falha?
2. Qual step depende de recurso escasso? (humano disponível, API com rate limit)
3. Qual step, se parar, paralisa o processo inteiro?

Constraint identificada: [descrever]
Implicação: [como isso afeta o design do processo]
```

---

### Passo 2 — Mapear Layer 1 (Estratégica)

A partir do context JSON:

```yaml
layer_1_strategic:
  objective: {process.objective}
  trigger: {process.trigger}
  success_criteria: {process.success_criteria}
  failure_to_avoid: {process.failure_to_avoid}
  kpis:
    # Derivar do success_criteria — mínimo 2 KPIs mensuráveis
    - name: ""
      measurement: ""
      target: ""
  boundaries:
    in_scope: []
    out_of_scope: []
    business_rules: {company.business_rules}
```

---

### Passo 3 — Mapear Layer 2 (Tática)

Identificar fases do processo a partir da régua/timeline:

```yaml
layer_2_tactical:
  total_phases: N
  phases:
    - id: "phase_N"
      name: ""
      trigger:
        condition: ""  # condição objetiva
        timing: ""     # D+N, semana N, evento X
      executor: "human | ai | hybrid | automation"
      human_role: ""  # se executor inclui humano
      depends_on: []  # fase(s) anterior(es)
      parallel_with: []  # se roda em paralelo
      decision_points:
        - condition: ""
          branches:
            - name: ""
              action: ""
      estimated_duration: ""
      completion_criteria: ""  # condição objetiva verificável
```

Regras de mapeamento:
- SE tem "D+N" no context → criar fase por período de tempo
- SE tem "etapa" ou "fase" no context → mapear como fase separada
- SE tem "se X acontecer, fazer Y" → criar decision point
- Mínimo: 2 fases. Máximo: sem limite (mas cada fase deve ter trigger distinto)

---

### Passo 4 — Mapear Layer 3 (Operacional)

Para cada step de cada fase:

```yaml
layer_3_operational:
  steps:
    - phase_id: ""
      step_id: ""
      action: ""
      who: ""  # role específico
      channel: ""  # onde acontece
      script_or_template: ""  # conteúdo exato se comunicação
      tools: []
      data_needed: []  # campos necessários para executar
      handoff_output:
        what_to_register: ""
        where_to_register: ""  # sistema/campo específico
        format: ""
```

Regras:
- Step de comunicação = script obrigatório (não orientação)
- Step de verificação = critério verificável (não "checar se está ok")
- Step de decisão = opções listadas com ação por opção

---

### Passo 5 — Mapear Layer 4 (IA-Ready)

Para cada decisão ou ação que a IA vai executar:

```yaml
layer_4_ai_ready:
  heuristics:
    - id: "H001"
      phase_id: ""
      step_id: ""
      condition: "SE [campo] [operador] [valor]"
      action: "ENTÃO [ação exata]"
      else: "SENÃO [ação alternativa]"
      data_required: []
      executor: "ai"

  human_escalation_triggers:
    - condition: ""  # condição objetiva
      escalate_to: ""  # role
      data_to_pass: []  # campos obrigatórios
      sla_hours: 0
      reason: ""  # por que humano é necessário aqui

  ai_limitations:
    # Explicitar o que a IA NÃO pode decidir neste processo
    - ""
```

Regra de ouro da Layer 4:
- SE heurística usa "talvez", "pode ser", "a critério" → reformular ou mover para human
- Toda heurística deve ser testável com dados reais

---

### Passo 6 — Mapear Layer 5 (Automação) — Só se n8n_needed = true

```yaml
layer_5_automation:
  n8n_needed: true
  n8n_pattern: ""  # webhook_processing | scheduled_tasks | http_api | ai_agent

  triggers:
    - id: "T001"
      event: ""
      condition: ""
      data_available: {}  # schema dos dados no trigger
      action: ""
      output_to_next:
        schema: {}

  integrations:
    - system: ""
      type: "api | webhook | database"
      credential_type: ""
      endpoints_needed: []

  estimated_nodes: N
  complexity: "simples | médio | complexo"
```

---

### Passo 7 — Gerar Process Layers Document

Compilar todas as layers em documento único YAML.

Adicionar no topo:
```yaml
process_layers:
  meta:
    name: ""
    domain: ""
    version: "1.0"
    generated_at: ""
    constraint: ""
    passes_to:
      - playbook-architect (layers 1-3)
      - ai-workflow-engineer (layers 4-5)
```

---

## OUTPUT

```yaml
output:
  format: yaml
  file: layers-{process-name}.yaml
  passes_to:
    - agent: playbook-architect
      data: layers 1-3 + meta
    - agent: ai-workflow-engineer
      data: layers 4-5 + meta
    - agent: process-forge-chief
      data: sumário (constraint, n8n_needed, total_phases)
```

## COMPLETION CRITERIA

Process Layers Document gerado com todas as layers aplicáveis preenchidas.
Nenhuma layer tem campo vazio quando o contexto deveria ter a informação.
