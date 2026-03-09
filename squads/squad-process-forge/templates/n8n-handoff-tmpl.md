# n8n Handoff Package — {{PROCESS_NAME}}

**Gerado por:** Process Forge Squad (n8n-packager)
**Data:** {{DATE}}
**Para usar com:** Skills n8n instaladas em `/Users/bn/.claude/skills/`

---

## Resumo Executivo

| Campo | Valor |
|-------|-------|
| Processo | {{PROCESS_NAME}} |
| Pattern Principal | {{MAIN_PATTERN}} |
| Complexidade | {{COMPLEXITY}} |
| Total de Nodes | {{TOTAL_NODES}} (estimado) |
| Integrações Externas | {{INTEGRATIONS_COUNT}} |
| n8n Skill Principal | {{MAIN_SKILL}} |

---

## 1. Pattern e Arquitetura

**Pattern recomendado:** `{{MAIN_PATTERN}}`
→ Skill para consultar: `n8n-workflow-patterns`

**Patterns secundários:** {{SECONDARY_PATTERNS}}

**Estrutura do workflow:**
```
{{WORKFLOW_STRUCTURE_DIAGRAM}}

Exemplo:
[Schedule Trigger] → [HTTP Get Cliente] → [IF days_overdue >= 1]
  → Branch A (true): [WhatsApp Message] → [Update HubSpot]
  → Branch B (false): [No Operation]
```

**Por que este pattern:**
{{PATTERN_RATIONALE}}

---

## 2. Triggers

### Trigger {{N}}: {{TRIGGER_NAME}}

**Tipo de node:** `{{TRIGGER_NODE_TYPE}}`
**Configuração:**
```
{{TRIGGER_CONFIG_DETAILS}}
- Cron (se Schedule): {{CRON_EXPRESSION}}
- Webhook URL (se Webhook): a definir após criar o node
- App Event (se App): {{APP_EVENT_DETAILS}}
```

**Dados disponíveis após o trigger:**
```json
{
  "{{FIELD_1}}": "{{TYPE_1}} — {{DESCRIPTION_1}}",
  "{{FIELD_2}}": "{{TYPE_2}} — {{DESCRIPTION_2}}",
  "{{FIELD_3}}": "{{TYPE_3}} — {{DESCRIPTION_3}}"
}
```

→ Skill para configurar: `n8n-node-configuration`

---

## 3. Nodes e Configuração

### Node {{N}}: {{NODE_NAME}}

- **Tipo n8n:** `{{NODE_TYPE}}`
- **Propósito:** {{NODE_PURPOSE}}
- **Posição no flow:** após `{{PREVIOUS_NODE}}`

**Input esperado (do node anterior):**
```json
{
  "{{INPUT_FIELD_1}}": "{{INPUT_TYPE_1}}",
  "{{INPUT_FIELD_2}}": "{{INPUT_TYPE_2}}"
}
```

**Configuração:**
| Campo | Valor | Tipo |
|-------|-------|------|
| {{CONFIG_FIELD_1}} | {{CONFIG_VALUE_1}} | fixo / expressão |
| {{CONFIG_FIELD_2}} | `{{ {{EXPRESSION_1}} }}` | expressão |

**Credencial necessária:** `{{CREDENTIAL_TYPE}}`
*(tipos válidos: httpBasicAuth, apiKey, oAuth2Api, postgres, mysql, slackApi, googleApi)*

**Output produz:**
```json
{
  "{{OUTPUT_FIELD_1}}": "{{OUTPUT_TYPE_1}}",
  "{{OUTPUT_FIELD_2}}": "{{OUTPUT_TYPE_2}}"
}
```

→ Skill para configurar: `n8n-node-configuration`

---

*(Repetir bloco "Node N" para cada node do workflow)*

---

## 4. Lógica de Código (Code Nodes)

### Code Node: {{CODE_NODE_NAME}}

**Quando executa:** {{EXECUTION_CONDITION}}
**Linguagem:** JavaScript (padrão) | Python (se necessário)

**Input esperado:**
```json
{
  "{{INPUT_1}}": "{{INPUT_TYPE_1}}",
  "{{INPUT_2}}": "{{INPUT_TYPE_2}}"
}
```

**Lógica a implementar:**
```
{{PSEUDOCODE_LOGIC}}

Exemplo:
SE items[0].json.days_overdue >= 7 E items[0].json.responded_d3 = false
  ENTÃO retornar { escalate: true, reason: "sem_resposta_d7" }
SENÃO
  ENTÃO retornar { escalate: false }
```

**Output esperado:**
```json
{
  "{{OUTPUT_1}}": "{{OUTPUT_TYPE_1}}",
  "{{OUTPUT_2}}": "{{OUTPUT_TYPE_2}}"
}
```

→ Skill para escrever: `n8n-code-javascript`
*(ou `n8n-code-python` se Python for necessário)*

---

## 5. Expressões Dinâmicas

| Node | Campo | Dado dinâmico | Expressão n8n |
|------|-------|--------------|---------------|
| {{NODE_1}} | {{FIELD_1}} | {{DYNAMIC_DATA_1}} | `{{ {{N8N_EXPR_1}} }}` |
| {{NODE_2}} | {{FIELD_2}} | {{DYNAMIC_DATA_2}} | `{{ {{N8N_EXPR_2}} }}` |
| {{NODE_3}} | {{FIELD_3}} | data formatada | `{{ $now.toFormat('dd/MM/yyyy') }}` |

**Helpers úteis para este processo:**
```javascript
// Formatar moeda
{{ $json.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) }}

// Adicionar dias
{{ $now.plus(N, 'day').toFormat('dd/MM/yyyy') }}

// Acessar node específico
{{ $node["Nome do Node"].json.campo }}

// Verificar se campo existe
{{ $json.campo ?? 'valor_padrão' }}
```

→ Skill para validar: `n8n-expression-syntax`

---

## 6. Integrações Externas

| Sistema | Tipo | Base URL | Endpoints Necessários | Credencial |
|---------|------|---------|----------------------|-----------|
| {{SYSTEM_1}} | REST API | {{BASE_URL_1}} | {{ENDPOINTS_1}} | {{CRED_TYPE_1}} |
| {{SYSTEM_2}} | Webhook | — | {{WEBHOOK_URL_2}} | {{CRED_TYPE_2}} |

**Configuração de credenciais no n8n:**
1. Ir em `Settings > Credentials > Add New`
2. Selecionar tipo: `{{CRED_TYPE}}`
3. Campos necessários:
   - {{CRED_FIELD_1}}: {{CRED_FIELD_1_DESC}}
   - {{CRED_FIELD_2}}: {{CRED_FIELD_2_DESC}}

---

## 7. Criação via MCP

→ Skill principal: `n8n-mcp-tools-expert`

**Estrutura de nodes para passar ao MCP:**
```json
{
  "name": "{{WORKFLOW_NAME}}",
  "nodes": [
    {
      "id": "node_1",
      "type": "n8n-nodes-base.{{NODE_TYPE_1}}",
      "name": "{{NODE_NAME_1}}",
      "position": [250, 300],
      "parameters": {
        "{{PARAM_1}}": "{{VALUE_1}}"
      }
    },
    {
      "id": "node_2",
      "type": "n8n-nodes-base.{{NODE_TYPE_2}}",
      "name": "{{NODE_NAME_2}}",
      "position": [500, 300],
      "parameters": {
        "{{PARAM_2}}": "{{VALUE_2}}"
      }
    }
  ],
  "connections": {
    "{{NODE_NAME_1}}": {
      "main": [[{"node": "{{NODE_NAME_2}}", "type": "main", "index": 0}]]
    }
  }
}
```

**Sequência de chamadas MCP:**
1. `create_workflow` → criar estrutura base
2. Verificar com `get_workflow` → confirmar criação
3. `update_workflow` → ajustar configurações de cada node
4. `execute_workflow` → testar com dados reais (1 caso)
5. Verificar resultado com `get_execution`

---

## 8. Checklist de Validação

→ Skill: `n8n-validation-expert`

**Antes de ativar:**
- [ ] Trigger dispara com os dados corretos (testar manualmente)
- [ ] Dados chegam no formato esperado em cada node
- [ ] IF/Switch: testar cada branch com dados reais
- [ ] Code nodes: validar input/output com 2-3 casos de teste
- [ ] Templates de mensagem: verificar variáveis substituídas corretamente
- [ ] Credenciais conectadas e testadas
- [ ] Error handling ativo (Settings → Error Workflow)
- [ ] Workflow ativado (Active = ON)

**Casos de teste sugeridos:**
| Caso | Input | Output Esperado |
|------|-------|----------------|
| {{TEST_CASE_1}} | {{TEST_INPUT_1}} | {{TEST_OUTPUT_1}} |
| {{TEST_CASE_2}} | {{TEST_INPUT_2}} | {{TEST_OUTPUT_2}} |
| {{TEST_CASE_3_EDGE}} | {{TEST_INPUT_3}} | {{TEST_OUTPUT_3}} |

---

*Gerado por Process Forge Squad — n8n Packager*
*Usar com as 7 skills n8n instaladas em `/Users/bn/.claude/skills/`*
