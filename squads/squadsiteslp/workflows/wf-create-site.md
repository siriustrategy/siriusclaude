# wf-create-site — Criacao Completa do Site

**Tipo:** Workflow de Execucao
**Input obrigatorio:** site-brief.md validado (de wf-site-intake.md)
**Output:** Site completo pronto para wf-deploy-pipeline.md
**Executor principal:** squadsiteslp-chief (orquestra os 4 modulos)

---

## PRE-REQUISITO

**BLOCKER:** site-brief.md deve estar completo e validado.
SE nao existe → executar wf-site-intake.md primeiro.

---

## FASE 1 — Design & Craft (M1)

**Orchestrator passa para:** @steve-schoger

### 1.1 Diagnostico Visual (@steve-schoger — Tier 0)
- Analisar site-brief.md (branding, referencias, anti-patterns)
- Definir sistema de design:
  - Tipografia: fonte principal + secundaria + escala
  - Cores: primaria, secundaria, neutros, feedback
  - Espacamento: escala 4px-base
  - Border radius, shadows, grid system
- Output: `design-system.md`

**CHECKPOINT:** squadsiteslp-chief revisa design-system.md
- Anti-AI check: gradientes genericos? icones Lovable? cards simetricos sem proposito?
- SE aprovado → avancar para 1.2

### 1.2 Animacoes & Motion (@emil-kowalski — Tier 1)
- Definir motion system baseado no design-system.md
- Especificar: timing, easing, stagger, page transitions
- Output: `motion-system.md`

### 1.3 CSS Implementation (@josh-comeau + @ahmad-shadeed + @adam-argyle — Tier 1/2)
- Implementar CSS base com custom properties
- Animacoes de hover e microinteracoes (josh-comeau)
- Layout e spacing preciso (ahmad-shadeed)
- Scroll-driven animations e CSS moderno (adam-argyle)

### 1.4 CSS Quality (@kevin-powell — Tier 2)
- Audit de CSS: magic numbers, !important, sustentabilidade
- Output: CSS limpo e documentado

### 1.5 3D Layer (@maxime-heckel — Tier 2, SE APLICAVEL)
- Avaliar: o projeto precisa de diferenciacao 3D?
- SE SIM: implementar com fallback 2D
- SE NAO: documentar decisao e pular

**VETO CONDITIONS M1:**
- Output com AI-look → retornar para steve-schoger
- CSS sem sistema de custom properties → retornar para kevin-powell
- Animacoes genericas → retornar para emil-kowalski

---

## FASE 2 — SEO & Visibilidade (M2)

**Orchestrator passa para:** @rand-fishkin

### 2.1 Estrategia de Audiencia (@rand-fishkin — Tier 0)
- Mapear onde o publico esta (baseado no site-brief.md)
- Definir estrategia AI SEO: como aparecer em ChatGPT/Perplexity
- Output: `seo-strategy.md`

### 2.2 Arquitetura Tecnica de SEO (@kevin-indig — Tier 0)
- Definir schema markup necessario
- Verificar Core Web Vitals targets
- Definir sitemap e estrutura de URLs
- Output: `technical-seo-spec.md`

### 2.3 On-Page SEO (@brian-dean — Tier 1)
- Definir title tags, meta descriptions para cada pagina
- Estrutura de headings (H1-H6) com keywords
- FAQ section para AI Overview targeting
- Output: `onpage-seo.md`

### 2.4 E-E-A-T (@lily-ray — Tier 2)
- Verificar: About page, contact, privacy policy, autor
- Implementar trust signals
- Output: checklist E-E-A-T completo

**VETO CONDITIONS M2:**
- Site sem schema Organization → bloquear deploy
- Sem privacy policy → bloquear deploy
- Meta description vazia → bloquear deploy

---

## FASE 3 — Copy & Persuasao (M3)

**Orchestrator passa para:** @joanna-wiebe

### 3.1 Copy Principal (@joanna-wiebe — Tier 1)
- Receber: site-brief.md + design-system.md + seo-strategy.md
- Escrever: headline, subheadline, value prop, CTAs
- Escrever: copy de cada secao definida no brief
- Output: `copy-document.md`

### 3.2 Estrutura da LP (@oli-gardner — Tier 1)
- Receber: copy-document.md + design-system.md
- Definir: ordem das secoes, posicao dos CTAs
- Aplicar: ATTENTION framework
- Output: `lp-wireframe.md` (estrutura final com copy posicionado)

### 3.3 CRO Audit (@peep-laja — Tier 2)
- Auditar: attention, motivation, friction, distraction
- Validar: CTA position, form fields, message match
- Output: `cro-audit.md` com aprovacao ou lista de fixes

**VETO CONDITIONS M3:**
- CTA generico ("Saiba mais") → retornar para joanna-wiebe
- LP com mais de um objetivo → retornar para oli-gardner
- Formulario com mais de 5 campos em topo de funil → fix obrigatorio

---

## FASE 4 — Implementacao Tecnica

**Executor:** @lee-robinson (com suporte de @theo-browne se backend necessario)

### 4.1 Scaffold do Projeto
- Criar projeto Next.js (ou stack definida no brief)
- Configurar TypeScript strict
- Configurar Tailwind CSS
- Implementar design system como CSS custom properties

### 4.2 Componentes
- Implementar cada secao do lp-wireframe.md
- Aplicar CSS do design-system.md
- Implementar motion system
- Integrar copy do copy-document.md

### 4.3 SEO Implementation
- Implementar metadata (next/metadata ou head tags)
- Adicionar schema markup do technical-seo-spec.md
- Configurar sitemap.xml
- Implementar FAQ section

### 4.4 Backend (SE NECESSARIO — @theo-browne)
- Configurar Supabase
- Implementar formularios com salvamento no banco
- Configurar autenticacao (se necessario)

### 4.5 Performance Check
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Lighthouse score > 90

**VETO CONDITIONS Implementacao:**
- Core Web Vitals fora dos limites → fix obrigatorio
- Schema markup ausente → fix obrigatorio
- Imagens sem alt text → fix obrigatorio

---

## HANDOFF PARA DEPLOY

**Output final desta fase:**
- Repositorio GitHub com codigo completo
- Todos os checks acima passando
- site-brief.md, design-system.md, copy-document.md documentados na pasta /docs

**Passar para:** wf-deploy-pipeline.md
