# squadsiteslp — Sites & Landing Pages Premium

Squad completo para criacao de sites e landing pages que nao parecem feitos por IA.

## Ativacao

```
@squadsiteslp:squadsiteslp-chief
```

## O Que Este Squad Faz

Cria sites e landing pages com:
- Estetica moderna, clean, Apple-level — sem AI-look
- Animacoes sofisticadas que o Lovable e outras plataformas nao conseguem replicar
- SEO otimizado para Google E para IAs (ChatGPT, Perplexity, AI Overview)
- Copy persuasivo com CTAs posicionados corretamente
- Deploy automatico: GitHub conectado ao Vercel, site no ar com um push

## Fluxo de Uso

```
1. @squadsiteslp:squadsiteslp-chief → "quero criar um site para X"
2. Squad ativa wf-site-intake.md (PRD estruturado)
3. Voce responde as perguntas de branding, publico, objetivo, stack
4. Squad executa wf-create-site.md (design → SEO → copy → codigo)
5. Squad executa wf-deploy-pipeline.md (GitHub → Vercel → dominio → ar)
6. Site no ar
```

## Agentes

### Orchestrator
| Agent | Funcao |
|-------|--------|
| squadsiteslp-chief | Coordena os 4 modulos, garante intake antes de qualquer execucao |

### Modulo 1 — Design & Craft
| Agent | Tier | Funcao |
|-------|------|--------|
| steve-schoger | 0 | Diagnostico visual, sistema de design, anti-AI gate |
| josh-comeau | 1 | CSS visual delight, animacoes, microinteracoes |
| emil-kowalski | 1 | Motion design, sistema de animacoes cinematograficas |
| adam-argyle | 1 | CSS moderno, scroll-driven animations, container queries |
| ahmad-shadeed | 2 | Layout CSS preciso, spacing system, responsividade |
| kevin-powell | 2 | CSS sustentavel, custom properties, sem magic numbers |
| maxime-heckel | 2 | Three.js / shaders / 3D (quando projeto pede diferenciacao extrema) |

### Modulo 2 — SEO & Visibilidade
| Agent | Tier | Funcao |
|-------|------|--------|
| rand-fishkin | 0 | Estrategia de audiencia, AI SEO, onde o publico esta |
| kevin-indig | 0 | Technical SEO, schema markup, Core Web Vitals, GEO |
| brian-dean | 1 | On-page SEO, Skyscraper, title tags, search intent |
| lily-ray | 2 | E-E-A-T, trust signals, autoridade para Google e AI |

### Modulo 3 — Persuasao & Conversao
| Agent | Tier | Funcao |
|-------|------|--------|
| joanna-wiebe | 1 | Copy de conversao baseado em Voice of Customer |
| oli-gardner | 1 | Estrutura da LP, posicao de CTAs, ATTENTION framework |
| peep-laja | 2 | CRO audit, remover atrito, validar persuasao com dados |

### Modulo 4 — Deploy & Infrastructure
| Agent | Tier | Funcao |
|-------|------|--------|
| guillermo-rauch | 0 | Arquitetura de deploy, stack, DX-first philosophy |
| lee-robinson | 1 | Pipeline GitHub → Vercel, domains, CI/CD, env vars |
| theo-browne | 1 | T3 Stack, Supabase, TypeScript + backend fullstack |
| matt-biilmann | 2 | Netlify alternativo, Jamstack, sites estaticos |

## Workflows

| Workflow | Descricao | Quando usar |
|----------|-----------|-------------|
| wf-site-intake.md | PRD estruturado — coleta branding, publico, objetivo, stack | SEMPRE primeiro |
| wf-create-site.md | Execucao completa — design, SEO, copy, codigo | Apos intake aprovado |
| wf-deploy-pipeline.md | GitHub → Vercel → dominio → site no ar | Apos codigo pronto |

## Anti-Patterns Bloqueados

- Gradientes genericos (roxo-azul de template)
- Cards identicos em grid sem proposito
- Icones do Heroicons sem adaptacao
- Apple emojis na interface
- CTA "Saiba mais" ou "Clique aqui"
- Site sem mobile responsivo
- Deploy sem HTTPS
- Secrets no repositorio GitHub

## Stack Default

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript (strict)
- **Estilos:** Tailwind CSS + CSS custom properties
- **Hosting:** Vercel
- **Database:** Supabase (quando necessario)
- **CI/CD:** GitHub → Vercel (automatico no push)
