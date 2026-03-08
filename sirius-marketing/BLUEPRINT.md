# Sirius-Marketing — Blueprint Master
**Versão:** 1.0.0
**Data:** 2026-03-07
**Status:** Planejamento

---

## Visão Geral

Creative AI Studio voltado para profissionais de marketing que conhecem o básico de IA e querem aprofundar com workflows, agentes e tasks no Claude Code. A plataforma combina geração de conteúdo, inteligência viral, análise de dados e automação de distribuição — tudo orquestrado por squads de agentes especializados.

**Propósito Sirius:** Ajudar pessoas a evoluírem e conquistarem liberdade através da IA e do autoconhecimento.

---

## Multi-Brand: Até 3 Marcas por Conta

Cada usuário pode gerenciar até 3 marcas diferentes. Cada marca tem:
- Brand Memory própria (paleta, tipografia, tom, personalidade, missão)
- Brand Voice Profile próprio
- Biblioteca de assets separada
- Prompt Library separada
- Analytics e campanhas separadas
- Créditos compartilhados entre todas as marcas da conta

**Seletor de marca:** sempre visível no header, mostra a marca ativa. Ao trocar, todo o contexto da plataforma atualiza.

---

## Módulos do Sistema

### 1. Brand Hub
**Squad:** `squad-brand-guardian`
- Brand Onboarding: wizard que cria a Brand Memory via perguntas
- Brand Memory: armazena paleta, tipografia, tom, missão, exemplos
- Brand Voice Trainer: alimentado com copies aprovadas para criar perfil de voz
- Brand Police: valida toda geração contra a identidade da marca
- Logo Manager: salva logo(s), ativa/desativa no momento do prompt

### 2. Viral Intelligence
**Squad:** `squad-viral-intelligence`
- Viral Feed: top conteúdos virais do dia, semana e mês (YouTube + TikTok + Instagram)
- Why It Worked: análise automática do porquê cada peça viralizou
- Trend Predictor: analisa tendências futuras (Copa do Mundo, eleições, datas comemorativas, música viral, comportamentos culturais)
- Trend Adapter: como aplicar cada trend na marca do usuário com sugestões práticas
- Trend Alerts: notificações quando uma trend nova emerge

### 3. Creative Studio
**Squad:** `squad-creative-studio`
- Image Generator: suporta Flux (Nano Banana), Kling, Seaart, Sora — usuário escolhe engine
- Image Remix: ajustes pontuais sem refazer prompt do zero
- Format Variants: adapta imagem aprovada para feed, stories, banner, thumbnail
- Character Creator: gera personagens consistentes com ficha técnica (Character Sheet)
- Asset Remix Hub: transforma assets existentes (ilustração, dark mode, variação sazonal)
- Remotion Animator: cria animações a partir de assets e ideias

### 4. Content Factory
**Squad:** `squad-content-factory`
- Copy Engine: gera copy com objetivo (vender/engajar/educar/entreter) + tom da marca + variações A/B
- Storyboard Builder: transforma ideia em storyboard cena a cena para Reels/TikTok/Shorts
- Content Calendar AI: calendário editorial completo com base em objetivos do mês e branding
- Brief to Campaign: brief informal → campanha completa estruturada
- Presentation Builder: deck de apresentação com peças criadas + racional + mockups

### 5. Ideas Lab
**Squad:** `squad-ideas-lab`
- Ideas Generator: perguntas específicas por área → ideias ranqueadas por potencial
- SEO Layer: incorpora palavras-chave e busca orgânica nas ideias
- Research Analyst: contexto de mercado, público e concorrência nas ideias
- Competitor Mood Analyzer: analisa paleta, tom e estratégia de concorrentes + sugere diferenciação

### 6. Analytics & Intelligence
**Squad:** `squad-analytics`
- Social Scraper: dados de perfis Instagram e TikTok (próprio e públicos)
- Campaign Monitor: monitora automaticamente posts criados pelo app via n8n webhook
- Insights Dashboard: posts mais virais, comentários, curtidas, visualizações, crescimento
- Smart Insights: padrões de performance aprendidos ao longo do tempo
- Own Profile Deep Analytics: equivalente aos insights nativos do Instagram (próprio perfil)

### 7. Distribution
**Squad:** `squad-distribution`
- Auto-Scheduler: agenda posts com datas e horários otimizados
- Auto-Publisher: publica automaticamente no TikTok e Meta via n8n
- Campaign Tracker: rastreia campanhas publicadas e alimenta o Analytics

### 8. Lovable Architect
**Squad:** `squad-lovable-architect`
- Requirements Interviewer: perguntas guiadas para capturar a visão do app/site
- Prompt Architect: gera prompt otimizado para Lovable seguindo branding e best practices
- Prompt Preview: mostra o prompt gerado antes de copiar

### 9. Library
- Prompt Library: prompts que funcionaram (auto-salvos), categorizados por marca/estilo/tipo
- Template Ecosystem: templates pré-configurados por indústria
- Asset Library: todos os assets gerados organizados por marca e tipo
- Character Library: fichas técnicas dos personagens criados

---

## Sistema de Créditos

| Ação | Créditos |
|------|---------|
| Gerar 1 imagem | 5 |
| Ideas Generator (1 sessão) | 3 |
| Storyboard completo | 10 |
| Animação Remotion | 20 |
| Copy Engine (1 sessão A/B) | 3 |
| Post automático agendado | 2 |
| Análise de perfil (scraping) | 8 |
| Viral Intelligence Report (semanal) | 5 |
| Lovable Prompt Generator | 4 |
| Pacote completo (imagem + copy + post) | 25 |

### Planos
| Plano | Créditos/mês | Marcas | Preço |
|-------|-------------|--------|-------|
| Free | 30 | 1 | Grátis |
| Pro | 500 | 3 | R$97/mês |
| Academy | 300 + bônus | 2 | Desconto alunos Sirius |

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 + Tailwind + shadcn/ui |
| Backend | Node.js + Supabase |
| Auth | Supabase Auth (SSO com Sirius Academy) |
| Automação | n8n (auto-post + webhooks) |
| Scraping | Playwright (perfis públicos) + Instagram API (próprio) |
| Animação | Remotion |
| AI Orquestração | Claude API via Claude Code (squads AIOS) |
| Deploy | Railway |

---

## Integração Sirius Academy
- SSO: login com a mesma conta da Academy
- Créditos extras para alunos ativos
- Modo "Aprender Fazendo": logs dos workflows visíveis para entender o processo
- Conteúdo educativo integrado: cada ferramenta explica o que está fazendo

---

## Squads Criados

| Squad | Módulo | Status |
|-------|--------|--------|
| squad-brand-guardian | Brand Hub | Definido |
| squad-viral-intelligence | Viral Intelligence | Definido |
| squad-creative-studio | Creative Studio | Definido |
| squad-content-factory | Content Factory | Definido |
| squad-ideas-lab | Ideas Lab | Definido |
| squad-analytics | Analytics | Definido |
| squad-distribution | Distribution | Definido |
| squad-lovable-architect | Lovable Architect | Definido |

---

## Workflows Principais

1. `brand-onboarding` — Configura Brand Memory completa
2. `viral-intelligence` — Busca + analisa + adapta trends
3. `image-creation` — Briefing → geração → variações → biblioteca
4. `content-creation` — Ideia → copy → storyboard → assets → distribuição
5. `campaign-monitor` — Post publicado → scraping → analytics → insights
6. `ideas-pipeline` — Contexto → research → geração → ranqueamento
7. `lovable-prompt-generator` — Entrevista → processamento → prompt final

---

*Sirius-Marketing Blueprint v1.0 — Orquestrado por Orion*
