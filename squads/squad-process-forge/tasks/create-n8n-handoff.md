# Task: create-n8n-handoff

```yaml
name: create-n8n-handoff
executor: n8n-packager
execution_type: autonomous
elicit: false
estimated_time: 10-15min
description: >
  Gera o n8n Handoff Package a partir do Skill Manifest aprovado.
  Output é um briefing tão completo que as 7 skills n8n instaladas
  conseguem construir o workflow sem contexto adicional.
  Usa templates/n8n-handoff-tmpl.md como base.
```

---

## PRÉ-CONDIÇÕES

- Skill Manifest aprovado pelo process-validator
- Process Layers Document (Layer 5 — Automação) disponível
- n8n_needed = true no context JSON

## VETO CONDITIONS

- n8n_needed = false → não executar esta task, informar chief
- Trigger sem dados mapeados → VETO
- Integração externa sem credencial identificada → VETO
- Code logic descrita sem exemplo de input/output → VETO

---

## EXECUÇÃO

### Passo 1 — Selecionar Pattern

A partir de Layer 5:

```
LÓGICA DE SELEÇÃO:

SE triggers_by_time = true AND integrations_needed tem sistema externo
ENTÃO → patterns: ["scheduled_tasks", "http_api_integration"]
  → principal: scheduled_tasks

SE triggers_by_time = false AND event = webhook
ENTÃO → pattern: "webhook_processing"

SE process tem heurísticas complexas (múltiplos IF/THEN)
ENTÃO → adicionar: "ai_agent_workflow"

SE só leitura/escrita de banco
ENTÃO → pattern: "database_operations"
```

Skill a referenciar: `n8n-workflow-patterns`

---

### Passo 2 — Mapear Triggers

Para cada trigger da Layer 5:

```markdown
### Trigger {N}: {nome}

**Tipo:** Schedule (Cron) | Webhook | Manual | App Event
**Configuração:**
- [detalhes específicos de configuração]
- Cron expression (se Schedule): [expressão — ex: "0 9 * * 1-5"]

**Dados disponíveis no trigger:**
```json
{schema exato dos dados disponíveis}
```

**Node n8n:** [Schedule Trigger | Webhook | Manual Trigger]
→ Skill para configurar: `n8n-node-configuration`
```

---

### Passo 3 — Mapear Nodes

Para cada step do manifest que representa um node n8n:

**Mapeamento step → node type:**
```
send_message (whatsapp) → HTTP Request (WhatsApp Business API)
send_message (email)    → Send Email (SMTP) ou Gmail
api_call               → HTTP Request
data_update            → HTTP Request (PATCH/PUT) ou Database node
decision               → IF node ou Switch node
escalate               → Slack / Email / WhatsApp (notificação)
wait                   → Wait node
code logic             → Code node (JavaScript)
```

Para cada node:

```markdown
### Node: {nome}
- **Tipo n8n:** {node_type}
- **Propósito:** {o que faz}
- **Input esperado (do node anterior):**
  ```json
  {schema}
  ```
- **Configuração:**
  | Campo | Valor |
  |-------|-------|
  | [campo] | [valor ou {{expressão}}] |
- **Credencial:** {tipo — ex: "httpBasicAuth", "apiKey", "oAuth2Api"}
- **Output produz:**
  ```json
  {schema}
  ```
→ Skill: `n8n-node-configuration`
```

---

### Passo 4 — Identificar Code Nodes

Para steps com lógica que não é nativa do n8n:

```markdown
### Code Node: {nome}

**Quando usar:** [descrever quando este node executa]

**Input:**
```json
{schema exato que chega no node}
```

**Lógica a implementar:**
```
[pseudocódigo ou descrição da lógica]
- SE condição X → retornar {campo: valorA}
- SENÃO → retornar {campo: valorB}
```

**Output esperado:**
```json
{schema exato que deve sair}
```
→ Skill: `n8n-code-javascript`
```

---

### Passo 5 — Mapear Expressões Dinâmicas

Identificar todos os lugares com dados dinâmicos:

```markdown
### Expressões Dinâmicas

| Local | Dado dinâmico | Expressão n8n |
|-------|--------------|---------------|
| [Node X, Campo Y] | nome do cliente | `{{ $json.nome }}` |
| [Node X, Campo Z] | valor em reais | `{{ $json.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) }}` |
| [Node X, Campo W] | data de amanhã | `{{ $now.plus(1, 'day').toFormat('dd/MM/yyyy') }}` |
| [IF Node, Condição] | dias em atraso | `{{ $json.days_overdue >= 7 }}` |

→ Skill: `n8n-expression-syntax`
```

---

### Passo 6 — Integrações Externas

```markdown
### Integrações Externas

| Sistema | Tipo | Endpoint | Credencial | Como testar |
|---------|------|---------|-----------|------------|
| [Sistema] | REST API | [endpoint] | [tipo de credencial] | [request de teste] |
```

---

### Passo 7 — Estrutura para MCP

Para criar o workflow via MCP do n8n:

```markdown
### Criação via MCP

→ Skill: `n8n-mcp-tools-expert`

**Estrutura de nodes para o MCP:**
```json
{
  "name": "{nome do workflow}",
  "nodes": [
    {
      "type": "n8n-nodes-base.{nodeType}",
      "name": "{nome do node}",
      "position": [x, y],
      "parameters": {}
    }
  ],
  "connections": {
    "{node_origem}": {
      "main": [[{"node": "{node_destino}", "type": "main", "index": 0}]]
    }
  }
}
```
```

---

### Passo 8 — Checklist de Validação

```markdown
### Validação Pós-Criação

→ Skill: `n8n-validation-expert`

**Pontos críticos a validar:**
- [ ] Trigger dispara com os dados corretos
- [ ] Dados chegam no formato esperado em cada node
- [ ] IF/Switch conditions retornam os branches corretos
- [ ] Code nodes produzem output no schema esperado
- [ ] Credenciais estão conectadas e funcionando
- [ ] Error handling ativo (Workflow → Settings → Error Workflow)
- [ ] Workflow está ACTIVE (não draft)
```

---

## OUTPUT

```yaml
output:
  format: markdown
  filename: n8n-handoff-{process-name}.md
  passes_to:
    - agent: process-validator
      for: veto check final
    - user: via process-forge-chief
      note: "pronto para usar com as skills n8n"
```

## COMPLETION CRITERIA

Handoff gerado com todas as seções preenchidas.
Cada node tem tipo, configuração e credencial identificados.
Expressões dinâmicas mapeadas para sintaxe n8n.
Estrutura JSON para MCP disponível.
Checklist de validação listado.
