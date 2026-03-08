# EPIC-001: Mappy Website Rebuild

**Status:** InProgress
**Owner:** @pm (Orion)
**Created:** 2026-03-03
**Project:** Mappy — mappy.com.br
**Brief:** `docs/projects/mappy-site-brief.md`

---

## Descrição

Rebuild completo do site mappy.com.br — migração do Lovable para Next.js 14 do zero.

O novo site deve:
- Eliminar o visual AI-look do Lovable
- Manter toda a copy, estrutura e animações existentes
- Simplificar seções repetidas e poluídas
- Adicionar Blog (MDX), LP B2B e LP B2C com checkout Asaas
- Integrar todas as tabelas no Supabase
- Deploy automático via GitHub → Vercel

---

## Referências de Design

| Site | Papel |
|------|-------|
| memorialmais.com.br | Identidade visual principal (site da mesma empresa) |
| saudemental.cuidarhoje.com.br | Estrutura LP B2C |
| vemconsulta.com.br | Estrutura LP B2B |

**Diretrizes visuais:**
- Hero: foto real + overlay gradiente direcional + texto esquerda (estilo Memorial Mais)
- 2 CTAs com intenções opostas no hero
- Nav com WhatsApp/plantão visível
- Seção escura quebrando ritmo da página
- LP B2C: preço no hero, nav minimalista, CTA direto para checkout
- LP B2B: ticker no topo, headline com palavra-chave colorida, FAQ longo

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Estilos | Tailwind CSS + CSS custom properties |
| Animações | Framer Motion |
| Blog/CMS | Contentlayer + MDX |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Pagamentos | Asaas (checkout + webhook) |
| CI/CD | GitHub → Vercel (auto deploy) |

---

## Stories

| ID | Título | Executor | Status |
|----|--------|---------|--------|
| 1.1 | Setup técnico (Next.js + Supabase + Vercel) | @devops + @architect | Draft |
| 1.2 | Design system anti-AI (tokens, componentes base) | @ux-design-expert | Draft |
| 1.3 | Site principal: Hero + Serviços + Como Funciona | @dev | Draft |
| 1.4 | Site principal: Ideal Para (Framer Motion) | @dev | Draft |
| 1.5 | Formulário multi-step /comecar | @dev | Draft |
| 1.6 | Blog com Contentlayer (MDX) + SEO | @dev | Draft |
| 1.7 | Páginas /contato + /terapia-online + /white-label | @dev | Draft |
| 2.1 | LP B2B — estrutura + copy + form + WhatsApp | @dev | Draft |
| 3.1 | LP B2C — estrutura + copy + planos | @dev | Draft |
| 3.2 | Integração Asaas (checkout + webhook → Supabase) | @architect + @dev | Draft |
| 4.1 | Deploy final (GitHub → Vercel → mappy.com.br) | @devops | Draft |

---

## Design Tokens

```
--color-primary: #35B0FF
--color-primary-dark: #2196E8
--color-text: #0A1628
--color-text-muted: #6B7280
--color-bg: #FFFFFF
--color-bg-subtle: #F5F7FA
--color-bg-dark: #0A1628
--font-family: 'Poppins', sans-serif
--radius-card: 12px
--radius-button: 8px
--radius-badge: 24px
```

---

## Supabase Tables

- `form_leads` — Formulário multi-step 7 etapas
- `contact_messages` — Formulário simples /contato
- `b2b_leads` — Form LP B2B
- `asaas_subscribers` — Webhook Asaas B2C

---

## WhatsApp

- **Número:** +55 22 3199-3772
- **Link padrão:** `https://wa.me/552231993772?text=Vim%20do%20site%2C%20quero%20saber%20mais%20sobre%20a%20Mappy`
- **Sistema:** https://app.mappy.com.br

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-03 | 1.0 | Epic criado com 11 stories | Orion (@aios-master) |
