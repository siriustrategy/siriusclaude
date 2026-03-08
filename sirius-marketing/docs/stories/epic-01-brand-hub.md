# Epic 01: Multi-Brand Foundation & Brand Hub
**Status:** Backlog
**Priority:** Alta — fundação de todo o sistema
**Squad:** squad-brand-guardian

## Visão do Epic
Toda geração do Sirius-Marketing nasce da identidade da marca. Este epic constrói a fundação:
o sistema de múltiplas marcas, o Brand Memory e o Brand Police que garante consistência.

## User Stories

### Story 01.01: Gerenciamento Multi-Brand
**Como** usuário do Sirius-Marketing,
**Quero** criar e gerenciar até 3 marcas diferentes na mesma conta,
**Para** atender múltiplos clientes ou marcas do meu portfólio sem trocar de conta.

**Acceptance Criteria:**
- [ ] Usuário pode criar até 3 marcas por conta
- [ ] Seletor de marca sempre visível no header
- [ ] Ao trocar de marca, todo o contexto da plataforma atualiza
- [ ] Cada marca tem sua biblioteca, analytics e configurações separadas
- [ ] Créditos são compartilhados entre todas as marcas da conta

### Story 01.02: Brand Onboarding Wizard
**Como** usuário novo ou criando uma nova marca,
**Quero** um wizard guiado que me ajude a configurar a identidade da marca via perguntas,
**Para** criar uma Brand Memory completa sem precisar saber de design ou branding.

**Acceptance Criteria:**
- [ ] Wizard com 4 grupos de perguntas: Essência, Público, Visual, Tom
- [ ] Ghost text com exemplos em cada campo
- [ ] Pode pular perguntas opcionais
- [ ] Preview da Brand Memory ao final antes de salvar
- [ ] Wizard editável a qualquer momento
- [ ] Barra de progresso clara

### Story 01.03: Brand Voice Training
**Como** usuário com Brand Memory configurada,
**Quero** treinar a voz da marca com exemplos de copy que já funcionaram,
**Para** que todo conteúdo gerado soe como a marca, não como IA genérica.

**Acceptance Criteria:**
- [ ] Usuário pode adicionar 3-10 exemplos de copy aprovados
- [ ] Sistema gera Brand Voice Profile automático
- [ ] Profile mostra padrões identificados (estrutura, vocabulário, recursos)
- [ ] Usuário pode validar e corrigir o profile
- [ ] Profile aplicado automaticamente no Copy Engine

### Story 01.04: Brand Police
**Como** usuário que gerou conteúdo,
**Quero** que o sistema valide automaticamente se o conteúdo está alinhado com minha marca,
**Para** nunca publicar algo que destoe da identidade construída.

**Acceptance Criteria:**
- [ ] Brand Score (0-100) exibido em toda geração
- [ ] Score < 80: sugestões de ajuste específicas
- [ ] Score < 50: aviso destacado (não bloqueia publicação)
- [ ] Explicação do score por dimensão (visual, tom, audiência, estratégia)
- [ ] Histórico de scores por marca

### Story 01.05: Logo Manager
**Como** usuário com logo da marca,
**Quero** salvar o logo e escolher se incluo no prompt de geração de imagem,
**Para** ter imagens já com o logo posicionado corretamente.

**Acceptance Criteria:**
- [ ] Upload de logo (PNG com fundo transparente ou SVG)
- [ ] Toggle "Incluir logo" no workflow de geração de imagem
- [ ] Configuração de posição do logo (canto superior/inferior, centralizado)
- [ ] Versões: logo completo, ícone/símbolo, versão monocromática

## Dependências
- Supabase configurado com schema do epic
- Auth funcionando (Story 10.01)
- Sistema de créditos básico (Epic 09)

## Definition of Done
- [ ] Todas as 5 stories implementadas
- [ ] Tests passando
- [ ] Brand Memory sendo carregada em todos os outros módulos
- [ ] Brand Police integrado no Creative Studio e Content Factory
