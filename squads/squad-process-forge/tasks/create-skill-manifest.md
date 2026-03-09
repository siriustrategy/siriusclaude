# Task: create-skill-manifest

```yaml
name: create-skill-manifest
executor: ai-workflow-engineer
execution_type: autonomous
elicit: false
estimated_time: 15-20min
description: >
  Transforma Process Layers (4-5) em Skill Manifest YAML executável por IAs.
  Output = input perfeito para qualquer skill/agente executar o processo autonomamente.
  Usa templates/skill-manifest-tmpl.yaml como base.
```

---

## PRÉ-CONDIÇÕES

- Process Layers Document disponível (output de map-process-layers)
- Acesso às layers 1 (contexto), 4 (IA-Ready) e 5 (Automação)

## VETO CONDITIONS

- Heurística com linguagem subjetiva → VETO
- Step sem output schema definido → VETO
- Escalation sem condição objetiva + role + dados → VETO
- Template de comunicação ausente em step de comunicação → VETO
- Step com risco de duplicação sem already_executed_check → VETO

---

## EXECUÇÃO

### Passo 1 — Carregar Template

Usar `templates/skill-manifest-tmpl.yaml` como estrutura base.

---

### Passo 2 — Preencher Context Global

A partir de Layer 1 + contexto de empresa:

```yaml
manifest:
  process:
    name: {process.name}
    version: "1.0"
    executor: "hybrid | ai | automation"  # baseado nos executores das fases
    idempotent: true  # sempre true — verificar antes de executar

  context:
    company_context:
      tone: {company.tone_of_voice — condensado em 1 frase}
      business_rules: {layer_1.business_rules — como lista de regras}
      escalation_default_role: {human_role padrão para escalation}

    process_inputs:
      required: []  # campos obrigatórios para o processo começar
      optional: []  # campos opcionais que enriquecem decisões
```

---

### Passo 3 — Mapear Fases como Phases

Para cada fase da Layer 2:

```yaml
phases:
  - id: "phase_{N}"
    name: {fase.name}
    trigger:
      condition: {fase.trigger.condition}  # condição objetiva
      data_required: []  # campos que devem existir no trigger

    executor: {fase.executor}
```

---

### Passo 4 — Mapear Steps com Schema Completo

Para cada step de cada fase, criar bloco completo:

```yaml
steps:
  - id: "step_{phase}_{N}"
    name: ""
    phase_id: ""

    # VERIFICAÇÃO DE IDEMPOTÊNCIA
    already_executed_check:
      field: ""      # campo que indica "já foi feito"
      value: null    # valor que indica NÃO foi feito (null, false, "")

    # AÇÃO PRINCIPAL
    action:
      type: "send_message | api_call | data_update | decision | escalate | wait"
      channel: ""    # se send_message: whatsapp | email | sms | call
      template_id: ""  # referência ao template neste manifest
      api_endpoint: ""  # se api_call
      params: {}     # parâmetros da ação com {{variavel}} para dinâmicos

    # HEURÍSTICAS DO STEP
    heuristics:
      - id: "H{NNN}"
        condition: "SE {campo} {operador} {valor}"
        action: "ENTÃO {ação exata}"
        else: "SENÃO {ação alternativa}"
        # Operadores válidos: =, !=, >, <, >=, <=, contains, in, is_null, is_not_null
        # Ações válidas: executar, pular, escalar, aguardar, encerrar, ir_para_phase_N

    # ESCALATION (se step pode escalar para humano)
    human_escalation:
      trigger: ""          # condição objetiva
      escalate_to: ""      # role específico
      data_to_pass: []     # campos obrigatórios a passar
      max_wait_hours: 0    # SLA para humano responder
      if_no_response: ""   # o que fazer se humano não responder no SLA

    # OUTPUT SCHEMA (obrigatório)
    output:
      type: object
      fields:
        - name: ""
          type: "string | boolean | number | enum | timestamp"
          values: []       # se enum: listar valores possíveis
          required: true   # true = sempre presente, false = condicional

    # CRITÉRIO DE CONCLUSÃO (obrigatório)
    completion_criteria:
      condition: ""        # verificável objetivamente com os campos do output

    # VETO CONDITIONS DO STEP
    veto_conditions:
      - condition: ""      # quando este step não deve executar
        action: "halt | escalate | skip"
        message: ""        # mensagem para log/usuário
```

---

### Passo 5 — Templates de Comunicação

Para cada template referenciado nos steps:

```yaml
templates:
  - id: ""
    type: "whatsapp | email | sms | call_script"
    variables: []    # lista de {{variavel}} usadas
    subject: ""      # se email
    content: |
      {conteúdo exato com {{variaveis}} marcadas}
```

Regras:
- Variáveis: sempre no formato `{{context.campo}}` ou `{{step_anterior.output.campo}}`
- Conteúdo: copiado diretamente do playbook (mesmo script, formatado para IA)

---

### Passo 6 — Escalation Matrix

```yaml
escalation_matrix:
  - level: 1
    trigger: ""       # condição objetiva
    role: ""          # role específico
    sla_hours: 0
    data_required: [] # campos que o humano precisa receber
    channel: ""       # como notificar o humano
  - level: 2
    trigger: ""       # se level 1 não responder no SLA
    role: ""
    sla_hours: 0
```

---

### Passo 7 — Error Handling

```yaml
error_handling:
  on_missing_required_input:
    action: "halt"
    notify: {escalation_default_role}
    message: "Processo não pode iniciar: campo obrigatório ausente: {{missing_field}}"

  on_api_failure:
    action: "retry"
    max_retries: 3
    retry_interval_minutes: 5
    after_max_retries: "escalate"
    escalate_to: {escalation_default_role}

  on_template_send_failure:
    action: "retry_once_then_alternate_channel"
    alternate_channel: ""  # canal backup

  on_timeout:
    action: "escalate"
    escalate_to: {escalation_default_role}
    message: "Timeout em step {{step_id}}"

  on_unknown_response:
    action: "log_and_escalate"
    escalate_to: {escalation_default_role}
```

---

### Passo 8 — Validar Compatibilidade Input/Output

Para cada par de steps consecutivos, verificar:

```
step[N].output.fields → deve conter todos os campos em step[N+1].veto_conditions + heuristics
SE campo usado em step[N+1] não existe em step[N].output → VETO
```

Documentar verificação:
```yaml
compatibility_check:
  - pair: "step_1_1 → step_1_2"
    status: "OK | VETO"
    issue: ""  # se VETO: qual campo está faltando
```

---

## OUTPUT

```yaml
output:
  format: yaml
  filename: manifest-{process-name}.yaml
  passes_to:
    - agent: process-validator
      for: veto check (VC_003, VC_004, VC_005, VC_008)
    - agent: n8n-packager
      for: extrair triggers e integrations para handoff
```

## COMPLETION CRITERIA

Manifest gerado com todas as fases e steps mapeados.
Todos os steps têm output schema completo.
Todas as heurísticas usam condições objetivas.
Verificação de compatibilidade input/output: todos os pares OK.
