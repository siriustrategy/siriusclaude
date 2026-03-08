# Sirius-Marketing — Product Requirements Document
**Versão:** 1.0.0
**Data:** 2026-03-07
**Status:** Rascunho

---

## 1. Problema

Profissionais de marketing que conhecem o básico de IA não têm uma plataforma integrada que:
- Mantenha consistência de marca em toda geração de conteúdo por IA
- Acompanhe o que está viralizando e mostre como aplicar na marca
- Automatize o ciclo completo: ideia → criação → publicação → análise
- Eduque o profissional enquanto ele usa (sem ser um curso)

---

## 2. Solução

**Sirius-Marketing:** Creative AI Studio que orquestra agentes especializados para cobrir o ciclo completo de conteúdo de marketing — da inteligência viral à publicação automática, tudo alinhado com a identidade única de cada marca.

---

## 3. Usuarios-Alvo

**Primário:** Profissional de marketing (freelancer, agência pequena, in-house)
- 25-45 anos
- Conhece Instagram, TikTok, Canva no básico
- Já ouviu falar de ChatGPT/IA mas não usa sistematicamente
- Quer resultados melhores sem curva de aprendizado longa

**Secundário:** Alunos da Sirius Academy
- Já em formação com IA
- Querem aplicar o aprendizado em projetos reais
- Créditos com desconto, acesso ao modo "Aprender Fazendo"

---

## 4. Modulos e Epics

### Epic 1: Multi-Brand Foundation
- Setup de conta com até 3 marcas
- Brand Onboarding Wizard
- Brand Memory (paleta, tipografia, tom, missão, logo)
- Brand Voice Training
- Brand Police (validação de toda geração)

### Epic 2: Viral Intelligence
- Viral Feed: top trends do dia/semana/mês (YouTube + TikTok + Instagram)
- Why It Worked: análise de cada trend
- Trend Predictor: previsão de trends futuras (eventos, sazonalidade, cultura)
- Trend Adapter: briefings prontos para a marca usar cada trend

### Epic 3: Creative Studio
- Image Generator (Flux/Kling/Seaart/Sora)
- Image Remix e variações de formato
- Character Creator com Character Sheet
- Asset Remix Hub
- Remotion Animator

### Epic 4: Content Factory
- Copy Engine com variações A/B
- Storyboard Builder (Reels/TikTok/Shorts)
- Content Calendar AI
- Brief to Campaign
- Presentation Builder

### Epic 5: Ideas Lab
- Ideas Generator (entrevista contextualizada)
- SEO Layer
- Competitor Mood Analyzer

### Epic 6: Analytics
- Social Scraper (próprio + público)
- Campaign Monitor (automático via n8n)
- Insights Dashboard
- Deep Analytics (próprio perfil)

### Epic 7: Distribution
- Auto-Scheduler
- Auto-Publisher (TikTok + Meta via n8n)

### Epic 8: Lovable Architect
- Entrevista estruturada (6 seções)
- Prompt Generator otimizado
- Quality Score do prompt

### Epic 9: Credits & Billing
- Sistema de créditos por ação
- Planos Free / Pro / Academy
- Dashboard de uso de créditos

### Epic 10: Platform & UX
- Onboarding guiado (wizard)
- Ghost text em todos os campos de input
- Botões de dúvida explicativos em cada ferramenta
- Modo "Aprender Fazendo" (logs de workflow visíveis)
- Seletor de marca no header
- Dashboard "O que fazer agora"

---

## 5. Requisitos Nao-Funcionais

- **Performance:** Geração de copy < 10s, imagem < 30s
- **Disponibilidade:** 99.5% uptime
- **Segurança:** Brand Memory criptografada, tokens de API em vault
- **Escalabilidade:** Suporte a 1000+ usuários simultâneos
- **Mobile:** Responsivo — uso em mobile para visualizar e aprovar conteúdo
- **Acessibilidade:** WCAG 2.1 AA

---

## 6. Metricas de Sucesso

- Tempo médio do primeiro conteúdo criado < 10 minutos
- NPS >= 60
- Retenção mensal > 70%
- Créditos médios consumidos por usuário ativo >= 50/mês
- Taxa de aprovação no Brand Police >= 80% na primeira geração

---

## 7. Integrações

| Sistema | Uso | Autenticação |
|---------|-----|-------------|
| Instagram Graph API | Publicação + Analytics próprio | OAuth Meta |
| TikTok API | Publicação + Analytics | OAuth TikTok |
| n8n | Automação e webhooks | API Key |
| Supabase | Banco de dados + Auth | Anon Key |
| Flux/Nano Banana | Geração de imagem | API Key |
| Kling | Geração de vídeo | API Key |
| Seaart | Geração de imagem/ilustração | API Key |
| Sora | Geração de vídeo | API Key |
| Remotion | Animação programática | Library |
| Stripe | Pagamentos e assinaturas | Secret Key |
| Sirius Academy | SSO | JWT compartilhado |

---

## 8. Constraints

- APIs de geração de imagem/vídeo têm custo — sistema de créditos é mandatório desde o MVP
- Scraping de redes sociais: apenas perfis públicos, Playwright, respeitar rate limits
- Não usar dados reais de usuário para treinar modelos externos
- LGPD: dados de marca ficam apenas no Supabase do usuário, não compartilhados

---

*PRD v1.0 — Orquestrado por Orion, Sirius-Marketing*
