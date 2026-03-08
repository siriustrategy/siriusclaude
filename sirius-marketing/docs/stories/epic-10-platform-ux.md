# Epic 10: Platform & UX
**Status:** Backlog — Base técnica primeiro
**Priority:** Crítica (base) + Média (features de UX)
**Squad:** nenhum squad específico (plataforma)

## User Stories

### Story 10.01: Autenticação e SSO
**Como** usuário,
**Quero** fazer login com email/senha ou Google,
**Para** acessar minha conta com segurança.

**Acceptance Criteria:**
- [ ] Login com email + senha (Supabase Auth)
- [ ] Login com Google (OAuth)
- [ ] Magic link (login sem senha)
- [ ] SSO com Sirius Academy — mesmo login funciona nos dois produtos
- [ ] Refresh token automático
- [ ] Logout em todos os dispositivos
- [ ] Forgot password flow

### Story 10.02: Layout Base e Navegação
**Como** usuário,
**Quero** uma interface organizada com navegação clara entre os módulos,
**Para** encontrar o que preciso rapidamente.

**Acceptance Criteria:**
- [ ] Sidebar com: Home, Viral Intelligence, Creative Studio, Content Factory, Ideas Lab, Analytics, Distribution, Lovable, Library, Settings
- [ ] Header com: seletor de marca ativa + badge de créditos + avatar/menu do usuário
- [ ] Design no padrão Sirius Academy (dark, glass-card, btn-primary)
- [ ] Responsivo para mobile (sidebar vira bottom nav)
- [ ] Loading states em todas as ações assíncronas
- [ ] Toast notifications para feedback de ações

### Story 10.03: Onboarding Wizard
**Como** novo usuário,
**Quero** um wizard de boas-vindas que me configure rapidamente,
**Para** começar a usar a plataforma sem ficar perdido.

**Acceptance Criteria:**
- [ ] Passo 1: Criar primeira marca (nome + cor principal)
- [ ] Passo 2: Definir objetivo principal (gerar mais conteúdo / crescer seguidores / economizar tempo)
- [ ] Passo 3: Conectar Instagram ou TikTok (opcional, pode pular)
- [ ] Passo 4: Tour rápido das 3 features mais importantes
- [ ] Progresso salvo — pode continuar de onde parou se fechar
- [ ] Skip disponível em todos os passos

### Story 10.04: Ghost Text em Todos os Inputs
**Como** usuário que não sabe o que escrever nos campos,
**Quero** exemplos sugeridos em todos os campos de input,
**Para** ter inspiração e entender o que a ferramenta espera.

**Acceptance Criteria:**
- [ ] Ghost text (placeholder detalhado) em todos os campos de briefing
- [ ] Ghost text contextual: muda de acordo com a marca ativa e área da ferramenta
- [ ] Ao clicar no campo, ghost text desaparece (não preenche automaticamente)
- [ ] Botão "Usar sugestão" que preenche com 1 clique (opcional)
- [ ] Ghost texts atualizados baseados no que o usuário escreve com sucesso (learning)

### Story 10.05: Botões de Ajuda Explicativos
**Como** usuário que não entende uma feature,
**Quero** um botão de dúvida em cada ferramenta que explica o que ela faz,
**Para** aprender enquanto uso sem precisar sair da plataforma.

**Acceptance Criteria:**
- [ ] Ícone de interrogação (?) em cada ferramenta, seção e campo importante
- [ ] Ao clicar: tooltip ou modal com explicação simples (max 3 linhas)
- [ ] Incluir: o que é, como usar, exemplo prático
- [ ] Links para tutorial mais completo quando necessário
- [ ] Modo "Aprender Fazendo" (Academia): mostra o que o agente está fazendo em tempo real

### Story 10.06: Dashboard Home Inteligente
**Como** usuário que abre a plataforma,
**Quero** uma home que me diz o que fazer a seguir,
**Para** nunca ficar olhando para a tela sem saber por onde começar.

**Acceptance Criteria:**
- [ ] Seção "Fazer agora": sugestões baseadas no que já foi feito e no que está pendente
- [ ] Card de trend viral do dia com botão "Criar conteúdo"
- [ ] Últimos assets criados com acesso rápido
- [ ] Próximos posts agendados
- [ ] Saldo de créditos com indicador de uso no mês
- [ ] Streak de dias com publicação (gamificação simples)

### Story 10.07: Library (Biblioteca Unificada)
**Como** usuário,
**Quero** um lugar central com todos os meus assets, prompts e personagens,
**Para** reutilizar o que já criei sem precisar procurar.

**Acceptance Criteria:**
- [ ] Tabs: Assets / Prompts / Personagens / Templates
- [ ] Busca por texto e filtros (marca, tipo, data, engine)
- [ ] Grid view e list view
- [ ] Preview rápido ao hover
- [ ] Download direto
- [ ] Ações rápidas: Remix / Usar como base / Deletar
- [ ] Organização em coleções/pastas (opcional para usuário)
