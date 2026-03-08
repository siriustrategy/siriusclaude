# Epic 08: Lovable Architect
**Status:** Backlog
**Priority:** Média
**Squad:** squad-lovable-architect

## User Stories

### Story 08.01: Entrevista Guiada para Lovable
**Como** profissional de marketing que quer criar um app ou site para cliente,
**Quero** responder perguntas simples e organizadas sobre o projeto,
**Para** ter tudo estruturado sem precisar saber o que o Lovable precisa.

**Acceptance Criteria:**
- [ ] Wizard com 6 seções: Visão, Público, Funcionalidades, Design, Fluxos, Integrações
- [ ] Uma seção por vez, sem sobrecarregar
- [ ] Ghost text com exemplos em cada campo
- [ ] Seção de Design pré-preenchida com Brand Memory da marca ativa
- [ ] Barra de progresso mostrando seção atual (X/6)
- [ ] Indicador de qualidade do prompt conforme preenche (Básico → Bom → Ótimo → Excelente)
- [ ] Seções opcionais podem ser puladas

### Story 08.02: Gerador de Prompt Lovable
**Como** usuário que completou a entrevista,
**Quero** receber um prompt completo e otimizado para colar no Lovable,
**Para** obter resultados profissionais sem precisar aprender a escrever prompts.

**Acceptance Criteria:**
- [ ] Prompt gerado seguindo estrutura testada (Visão → Funcionalidades → Design → Fluxos → Integrações)
- [ ] Cores em hex (nunca "azul" genérico)
- [ ] Fluxos descritos passo a passo
- [ ] Ferramentas nativas do Lovable especificadas (Supabase, Stripe, shadcn/ui)
- [ ] Quality Score exibido (0-100)
- [ ] Indicação do que faria o prompt ainda melhor
- [ ] Botão "Copiar prompt" com feedback de confirmação
- [ ] Prompt salvo no histórico

### Story 08.03: Melhoria de Prompt Existente
**Como** usuário com um prompt que gerou resultado parcial no Lovable,
**Quero** colar o prompt e receber sugestões de melhoria específicas,
**Para** refinar sem precisar começar do zero.

**Acceptance Criteria:**
- [ ] Campo de input para colar prompt existente
- [ ] Análise automática: o que está faltando, o que está vago, o que poderia ser mais específico
- [ ] Versão melhorada gerada automaticamente
- [ ] Diff mostrando o que mudou (antes/depois)
- [ ] Quality Score do original vs. melhorado
