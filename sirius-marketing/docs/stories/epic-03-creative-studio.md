# Epic 03: Creative Studio
**Status:** Backlog
**Priority:** Alta — produto principal para o usuário
**Squad:** squad-creative-studio
**Depende de:** Epic 01 (Brand Memory obrigatória)

## Visão do Epic
O coração da plataforma. Onde o conteúdo visual nasce. Suporta múltiplos engines de geração,
garante consistência de marca em cada output e mantém uma biblioteca organizada de assets.

## User Stories

### Story 03.01: Image Generator Multi-Engine
**Como** profissional de marketing,
**Quero** gerar imagens escolhendo entre Flux, Seaart, Kling e Sora,
**Para** ter o melhor resultado para cada tipo de conteúdo que preciso criar.

**Acceptance Criteria:**
- [ ] Seletor de engine com descrição de qual é melhor para cada uso
- [ ] Campo de briefing com ghost text sugerindo o que escrever
- [ ] Prompt construído automaticamente pelo prompt-engineer com Brand Memory
- [ ] Imagem gerada exibida com Brand Score (0-100)
- [ ] Opções: Aprovar / Remix / Variações / Tentar novamente / Descartar
- [ ] Créditos exibidos antes de confirmar geração

### Story 03.02: Image Remix
**Como** usuário que gerou uma imagem e gostou 80%,
**Quero** fazer ajustes pontuais sem refazer o prompt do zero,
**Para** não perder uma boa geração por causa de um detalhe.

**Acceptance Criteria:**
- [ ] Botão "Remix" em toda imagem gerada
- [ ] Interface de remix com campos: mudar cor, mudar fundo, mudar expressão, mudar elemento
- [ ] Prompt original preservado — apenas deltas são aplicados
- [ ] Máximo 5 remixes por imagem original
- [ ] Cada remix desconta créditos normalmente (5 créditos)

### Story 03.03: Format Variants
**Como** usuário com uma imagem aprovada,
**Quero** gerar automaticamente versões adaptadas para feed, stories, banner e thumbnail,
**Para** não precisar recriar a mesma imagem 4 vezes.

**Acceptance Criteria:**
- [ ] Botão "Gerar Variações" em imagem aprovada
- [ ] Opções: 1:1 Feed, 9:16 Stories, 16:9 Banner, 16:9 Thumbnail YouTube
- [ ] Seleção múltipla (pode pedir todas de uma vez)
- [ ] Custo: 3 créditos por variante
- [ ] Todas salvas na biblioteca sob o mesmo "grupo"

### Story 03.04: Character Creator
**Como** criador de conteúdo,
**Quero** criar um personagem consistente para minha marca com ficha técnica completa,
**Para** usar o mesmo personagem em qualquer peça sem perder a identidade visual.

**Acceptance Criteria:**
- [ ] Wizard de criação: propósito → aparência → estilo de renderização
- [ ] 4 opções de concept geradas para escolha
- [ ] Character Sheet completa: frente, perfil, 4 expressões, 3 poses (12 imagens)
- [ ] Seed de consistência salvo para reprodução futura
- [ ] Ao usar o personagem em novo conteúdo, seed é carregado automaticamente
- [ ] Character Library na sidebar com todos os personagens da marca

### Story 03.05: Asset Remix Hub
**Como** usuário com assets existentes,
**Quero** transformar um asset antigo em algo novo com IA,
**Para** reaproveitar conteúdo e economizar tempo de produção.

**Acceptance Criteria:**
- [ ] Upload de asset existente (imagem, logo, foto de produto)
- [ ] Opções de transformação: Ilustração, Animação, Minimalista, Dark Mode, Variação Sazonal
- [ ] Preview antes de confirmar (não desconta créditos no preview)
- [ ] Resultado salvo na biblioteca automaticamente
- [ ] Integração com Remotion para transformações com animação

### Story 03.06: Prompt Library
**Como** usuário da plataforma,
**Quero** que prompts que geraram imagens aprovadas sejam salvos automaticamente,
**Para** reutilizá-los como templates e economizar tempo.

**Acceptance Criteria:**
- [ ] Auto-save quando Brand Score >= 85
- [ ] Categorização por: marca, tipo de conteúdo, engine, estilo
- [ ] Campo de busca na biblioteca
- [ ] Botão "Usar este prompt" — preenche o campo de geração com o template
- [ ] Placeholders identificáveis: {produto}, {pessoa}, {cenário}
- [ ] Compartilhar prompt (link público ou dentro do workspace)
