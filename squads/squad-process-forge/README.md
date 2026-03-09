# Process Forge Squad

> Transforme qualquer contexto em processo completo — pronto para humanos, IAs e n8n.

---

## O que este squad faz

Você chega com: **"Preciso criar um processo de cobrança"**

O squad entrega:
1. **Playbook Humano** — régua completa, scripts, tom de voz, objeções, escalation guide
2. **Skill Manifest** — YAML executável por qualquer IA/skill sem ambiguidade
3. **n8n Handoff Package** — briefing estruturado para as 7 skills n8n instaladas

**Filosofia:** Output de cada task = input perfeito da próxima. Fluxo unidirecional. Ambiguidade zero.

---

## Ativação

```
@process-forge *forge {nome do processo}
```

Ou simplesmente descrever o processo para o chief.

---

## Agentes

| Agent | Baseado em | Função |
|-------|-----------|--------|
| `process-forge-chief` | Pedro Valério | Orquestra tudo, elicita contexto, entrega final |
| `context-analyst` | Goldratt + Deming | Mapeia 5 camadas, identifica constraint |
| `playbook-architect` | Ray Dalio + Tiago Forte | Playbook humano com scripts e régua |
| `ai-workflow-engineer` | AIOS patterns | Skill manifest YAML para IA executar |
| `process-validator` | Pedro Valéro | 8 veto conditions — nada passa sem aprovação |
| `n8n-packager` | n8n patterns | Handoff para as 7 skills n8n instaladas |

---

## Workflow Principal

```
Phase 1: CONTEXT      → Elicitar (12 perguntas) → Mapear 5 camadas
          ↓ human checkpoint (aprovar contexto)
Phase 2: CREATION     → Playbook + Manifest em paralelo
Phase 3: N8N HANDOFF  → Package para skills n8n (se necessário)
Phase 4: VALIDATION   → 8 veto conditions (max 3 iterações)
Phase 5: DELIVERY     → Output triplo ao usuário
```

---

## As 5 Camadas do Processo

| Camada | O que é | Para quem |
|--------|---------|-----------|
| 1. Estratégica | WHY — objetivo, KPIs, fronteiras | Liderança |
| 2. Tática | WHAT — fases, sequência, decisões | Gestor |
| 3. Operacional | HOW — passo a passo, scripts, ferramentas | Time |
| 4. IA-Ready | IF/THEN — heurísticas determinísticas | IA/skills |
| 5. Automação | TRIGGERS — gatilhos, webhooks, n8n | n8n |

---

## As 8 Veto Conditions

| # | Condição | VETO SE |
|---|---------|---------|
| VC_001 | Owner Definido | Qualquer step sem executor |
| VC_002 | Critério de Done | Critério subjetivo ou ausente |
| VC_003 | Output Schema | Step sem schema de output |
| VC_004 | Heurísticas Determinísticas | Linguagem subjetiva ("quando necessário") |
| VC_005 | Escalation Definida | Sem role, SLA ou dados a passar |
| VC_006 | Scripts de Comunicação | Step de comunicação sem script |
| VC_007 | Fluxo Unidirecional | Qualquer circularidade no fluxo |
| VC_008 | Input/Output Compatível | Step usa campo que anterior não produz |

---

## Comandos Disponíveis

```
*forge {processo}     → Processo completo (output triplo)
*playbook {processo}  → Só o playbook humano
*manifest {processo}  → Só o skill manifest para IA
*validate {processo}  → Validar processo existente com as 8 VCs
*help                 → Ver todos os comandos
```

---

## Integração com Skills n8n

As 7 skills instaladas são ativadas pelo n8n Handoff Package:

| Skill | Quando usar |
|-------|------------|
| `n8n-workflow-patterns` | Escolher arquitetura do workflow |
| `n8n-node-configuration` | Configurar cada node |
| `n8n-code-javascript` | Escrever código nos Code nodes |
| `n8n-code-python` | Python quando necessário |
| `n8n-expression-syntax` | Validar expressões `{{ }}` |
| `n8n-mcp-tools-expert` | Criar workflow via MCP |
| `n8n-validation-expert` | Validar e corrigir erros |

---

## Estrutura de Arquivos

```
squad-process-forge/
├── config.yaml
├── README.md
├── agents/
│   ├── process-forge-chief.md
│   ├── context-analyst.md
│   ├── playbook-architect.md
│   ├── ai-workflow-engineer.md
│   ├── process-validator.md
│   └── n8n-packager.md
├── tasks/
│   ├── elicit-process-context.md
│   ├── map-process-layers.md
│   ├── create-playbook.md
│   ├── create-skill-manifest.md
│   ├── create-n8n-handoff.md
│   └── validate-process.md
├── templates/
│   ├── playbook-tmpl.md
│   ├── skill-manifest-tmpl.yaml
│   └── n8n-handoff-tmpl.md
└── workflows/
    └── wf-forge-process.yaml
```

---

## Exemplo de Uso

**Entrada:**
> "Preciso criar um processo de cobrança para a empresa"

**O squad faz:**
1. Faz 12 perguntas (5 min)
2. Você aprova o contexto
3. Squad gera os 3 artefatos em paralelo
4. Validator aplica 8 veto conditions
5. Entrega:

**Saída:**
- `playbook-cobranca.md` — régua D+1 a D+30, scripts WhatsApp/email, objeções, escalation guide
- `manifest-cobranca.yaml` — YAML que qualquer IA segue sem perguntar nada
- `n8n-handoff-cobranca.md` — briefing completo para as skills n8n montarem o workflow

---

*Process Forge Squad v1.0 | Criado por Squad Architect (squad-chief)*
