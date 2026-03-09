# Process Forge Squad — Comandos Instalados

Transforme qualquer contexto em processo completo — pronto para humanos, IAs e n8n.

## Agentes Disponíveis

| Slash Command | Agente | Função |
|--------------|--------|--------|
| `/squad-process-forge:agents:process-forge-chief` | Chief | Orquestra tudo — use este para criar processos |
| `/squad-process-forge:agents:context-analyst` | Analyst | Mapeia 5 camadas + constraint |
| `/squad-process-forge:agents:playbook-architect` | Architect | Cria playbook humano completo |
| `/squad-process-forge:agents:ai-workflow-engineer` | Engineer | Cria skill manifest YAML para IA |
| `/squad-process-forge:agents:process-validator` | Validator | Aplica 8 veto conditions |
| `/squad-process-forge:agents:n8n-packager` | Packager | Gera handoff para skills n8n |

## Como usar

**Para criar um processo completo:**
```
/squad-process-forge:agents:process-forge-chief
```
Depois digitar: `*forge cobrança` (ou qualquer processo)

**Output entregue por processo:**
- Playbook Humano (.md) — para o time
- Skill Manifest (.yaml) — para IAs executarem
- n8n Handoff (.md) — para suas 7 skills n8n

## Skills n8n integradas

O n8n Handoff alimenta diretamente:
`n8n-workflow-patterns` · `n8n-node-configuration` · `n8n-code-javascript`
`n8n-expression-syntax` · `n8n-mcp-tools-expert` · `n8n-validation-expert`
