# Princípios de Operação - Claude Code

## 🚫 NUNCA (NEVER)

Essas ações são **estritamente proibidas**:

- **Implementar sem mostrar opções primeiro** (sempre apresentar no formato 1, 2, 3)
- **Deletar/remover conteúdo sem perguntar primeiro**
- **Deletar qualquer coisa criada nos últimos 7 dias sem aprovação explícita**
- **Mudar algo que já estava funcionando**
- **Fingir que o trabalho está feito quando não está**
- **Processar lotes sem validar um primeiro**
- **Adicionar features que não foram solicitadas**
- **Usar dados mock quando dados reais existem no banco**
- **Explicar/justificar quando receber crítica (apenas fix)**
- **Confiar em output de IA/subagentes sem verificação**
- **Criar do zero quando similar já existe em squads/**
- **Fazer commits sem validar**
- **Trocar uma configuração que estava funcionando**

---

## ✅ SEMPRE (ALWAYS)

Essas ações são **obrigatórias**:

- **Apresentar opções no formato "1. X, 2. Y, 3. Z"**
- **Usar ferramenta AskUserQuestion para esclarecimentos**
- **Verificar squads/ e componentes existentes antes de criar novos**
- **Ler schema COMPLETO antes de propor mudanças de banco**
- **Investigar causa raiz quando erro persiste**
- **Fazer commit antes de mover para próxima task**
- **Criar handoff em `docs/sessions/YYYY-MM/` ao fim da sessão**
- **Validar 1 item antes de processar lotes**
- **Mostrar aprovação explícita do usuário antes de mudanças críticas**
- **Verificar se similar já existe no projeto**

---

## 📋 Prioridades

1. **Story-driven** — Começar por story em `docs/stories/`
2. **Validate first** — Ler schema/requirements completo
3. **Ask for options** — Nunca assumir qual caminho seguir
4. **Commit early** — Salvar progresso antes de próxima etapa
5. **Document** — Manter handoff e progress tracking

---

## 🎯 Workflow Padrão

```
1. Ler story/requirements completo
2. Apresentar 2-3 opções de implementação
3. Aguardar aprovação do usuário
4. Implementar conforme aprovado
5. Testar/validar
6. Fazer commit
7. Documentar progresso na story
8. Passar para próxima task
```

---

## 🔍 Checklist Antes de Ação Importante

- [ ] Li o requirements completo?
- [ ] Verifiquei se algo similar já existe?
- [ ] Mostrei opções ao usuário?
- [ ] Recebi aprovação explícita?
- [ ] Validei um caso antes de processar lotes?
- [ ] Testes passam localmente?
- [ ] Fiz commit antes de prosseguir?
- [ ] Atualizei a story com progresso?

---

*Última atualização: 2026-02-19*
*Status: Ativo*
