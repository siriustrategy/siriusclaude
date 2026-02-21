# SiriusClaude

Projeto do cliente SiriusClaude - desenvolvido com Synkra AIOS e Claude Code.

## 📁 Estrutura do Projeto

```
siriusclaude/
├── .aios-core/          ← Framework AIOS (configurações)
├── .claude/             ← Configurações Claude Code
├── docs/
│   ├── stories/         ← Histórias do projeto
│   ├── prd/             ← Product Requirements
│   └── architecture/    ← Documentação arquitetural
└── README.md
```

## 🚀 Como Começar

1. Abra esta pasta no Claude Code:
   ```bash
   claude ~/siriusclaude
   ```

2. Ative o AIOS Master para começar:
   ```
   @aios-master *help
   ```

3. Crie sua primeira história:
   ```
   @sm *create-story
   ```

## 📋 Workflows Disponíveis

- **Story Development Cycle** - Criar, validar, implementar e revisar histórias
- **QA Loop** - Iterações de review e fix
- **Spec Pipeline** - Para features complexas
- **Brownfield Discovery** - Para análise de código legado

## 👥 Agents Disponíveis

- `@aios-master` - Maestro do framework
- `@pm` - Product Manager (Morgan)
- `@po` - Product Owner (Pax)
- `@sm` - Scrum Master (River)
- `@dev` - Developer (Dex)
- `@qa` - Quality Assurance
- `@architect` - Architect (Aria)
- `@data-engineer` - Data Engineer (Dara)
- `@devops` - DevOps (Gage)

## 📚 Referências

- Regras AIOS: `.claude/CLAUDE.md`
- Regras de workflow: `.aios-core/rules/workflow-execution.md`
- Regras de agentes: `.aios-core/rules/agent-authority.md`

---

**Status:** Setup inicial concluído ✅
