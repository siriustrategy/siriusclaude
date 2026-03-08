# MAPPY — Site Brief Oficial
**Data:** 2026-03-03
**Status:** Aprovado
**Projeto:** Rebuild completo mappy.com.br (Lovable → Next.js 14)

---

## 1. SOBRE O PRODUTO

**Mappy** — Plataforma de teleatendimento white-label B2B
- Especialidades: Medicina 24h, Psicologia, Nutrição, Jurídico, Veterinário
- Setup fee: R$7.500 (white-label) / R$3.500 (sem white-label)
- Preço por vida: R$3,50 (plantão) / R$7,50 (plantão + especialidades)
- Implementação: 5 dias úteis
- NPS: 92,4% | +50k atendimentos

---

## 2. BRANDING

- **Cor primária:** `#35B0FF` (azul Mappy)
- **Cor texto:** `#0A1628` (quase preto)
- **Cor neutra:** `#F5F7FA` (fundo de seções)
- **Fonte:** Poppins (Google Fonts) — weights: 400, 500, 600, 700, 800
- **Border-radius:** 12px (cards), 8px (botões), 24px (badges)
- **WhatsApp:** `https://wa.me/552231993772?text=Vim%20do%20site%2C%20quero%20saber%20mais%20sobre%20a%20Mappy`
- **Sistema:** https://app.mappy.com.br
- **Email:** contato@mappy.com.br

---

## 3. ANTI-PATTERNS (proibidos)

- Gradiente roxo-azul genérico de template
- Mockup de chat com "Dr. João Silva" genérico
- Ícones Heroicons sem adaptação
- Cards idênticos em grid uniforme sem personalidade
- Apple emojis na interface
- CTA "Saiba mais" ou "Clique aqui"
- Background com gradiente linear simples
- Tipografia com peso uniforme (sem hierarquia)

---

## 4. REFERÊNCIAS DE DESIGN

### Principal: memorialmais.com.br (site da mesma empresa)
- Hero: foto real + overlay escuro gradiente direcional
- Badge discreto acima do headline
- Título bold heavy, alinhado à esquerda
- Dois CTAs com intenções opostas no hero
- Nav com contato (plantão/WhatsApp) visível
- Cards com ícone outline + espaçamento respirado
- Seção escura quebrando o ritmo da página
- Footer com 4 colunas, CNPJ, minimalista

### LP B2C: saudemental.cuidarhoje.com.br
- Preço no hero — visível imediatamente
- Video depoimento formato vertical (Reels) ao lado do headline
- Contador de clientes/vidas no nav
- Nav minimalista (landing page pura — sem menu)
- CTA único direto para checkout

### LP B2B: vemconsulta.com.br
- Ticker/marquee com oferta/diferencial no topo
- Hero com imagem ou vídeo real (não stock)
- Tipografia mista (cor diferente em palavra-chave do headline)
- Seção colorida destacando o plano/oferta
- FAQ longo para objeções antes do footer

---

## 5. ENTREGÁVEIS

### 5.1 Site Principal (mappy.com.br)
**Objetivo:** Apresentação institucional + captura de leads B2B

**Páginas:**
- `/` — Home
- `/white-label` — Página White-Label (segmentos interativos)
- `/terapia-online` — Terapia Online
- `/blog` — Blog (MDX + Contentlayer)
- `/contato` — Contato simplificado
- `/comecar` — Formulário multi-step 7 etapas

**Estrutura Home:**
1. Hero — foto real + badge + headline + 2 CTAs + 3 métricas
2. Serviços — 6 cards (Medicina 24h, Psicologia, Nutrição, Jurídico, Veterinário, Em breve)
3. "Ideal para" — seção interativa tabs (6 segmentos) + Framer Motion
4. Seção escura — números/prova social (break de ritmo, referência Memorial Mais)
5. Como Funciona — 4 etapas
6. FAQ — accordion
7. CTA final + Footer

**Menu:**
```
Home | Montar Plano | White-Label | Terapia Online | Blog | Contato | [Acessar Sistema →]
```

**Nav adicional:** WhatsApp com "PLANTÃO 24h" visível (referência Memorial Mais)

### 5.2 Landing Page B2B (/empresas ou /b2b)
**Objetivo:** Captura de leads de empresas/decisores
**Público:** CEO, RH, Diretores de Telecom/Clubes/SaaS/Seguradoras/Sindicatos

**Estrutura:**
1. Ticker: "Implementação em 5 dias · White-label 100% com sua marca · NPS 92,4%"
2. Nav: Logo + "Já tenho conta" + CTA "Solicitar Proposta"
3. Hero: headline com palavra-chave colorida + imagem real B2B + form lateral
4. Seção azul: features incluso + métricas
5. "Ideal para" (reusar componente do site principal)
6. Depoimentos/cases
7. FAQ (objeções B2B)
8. CTA final → WhatsApp

**Form B2B (salva em Supabase `b2b_leads`):**
- Nome, Empresa, Cargo, Segmento, WhatsApp, Qtd. Vidas
- Ao enviar: salva Supabase + abre WhatsApp com dados preenchidos

### 5.3 Landing Page B2C (/planos ou /assinar)
**Objetivo:** Conversão direta — assinatura via Asaas
**Público:** Pessoa física querendo acesso a teleatendimento

**Preços:**
- R$139,90/mês — cartão recorrente (padrão)
- R$149,90 — PIX ou boleto

**Estrutura:**
1. Nav minimalista: Logo + "Já sou cliente" + CTA "Assinar Agora"
2. Hero: badge "100% Online" + preço em destaque (cor diferente) + video/imagem
3. O que está incluso — checklist visual
4. Comparação de preço (custo por dia vs. consulta avulsa)
5. Como funciona — 3 passos simples
6. Depoimentos
7. Planos e preços — cards (cartão vs. PIX/boleto)
8. FAQ (objeções B2C)
9. CTA final "Assinar Agora"

**Checkout Asaas:**
- Botão "Assinar Agora" → Asaas checkout embed ou redirect
- Webhook `/api/asaas/webhook` → salva em Supabase `asaas_subscribers`

---

## 6. SUPABASE SCHEMA

```sql
-- Formulário multi-step (leads B2B via site)
create table form_leads (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  whatsapp text not null,
  email text,
  cargo text not null,
  empresa text,
  segmento text not null,
  quantidade_vidas text not null,
  servicos text[] not null,
  urgencia text not null,
  perfil_sugerido text,
  cta_mostrado text,
  created_at timestamptz default now()
);

-- Contato simples
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text not null,
  mensagem text not null,
  origem text default 'contato',
  created_at timestamptz default now()
);

-- Leads LP B2B
create table b2b_leads (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  empresa text,
  cargo text,
  segmento text,
  whatsapp text not null,
  email text,
  quantidade_vidas text,
  created_at timestamptz default now()
);

-- Assinantes B2C (Asaas webhook)
create table asaas_subscribers (
  id uuid default gen_random_uuid() primary key,
  asaas_customer_id text unique,
  asaas_subscription_id text unique,
  nome text,
  email text not null,
  cpf text,
  telefone text,
  plano text,         -- 'mensal_cartao' | 'mensal_pix_boleto'
  valor numeric,      -- 139.90 ou 149.90
  status text default 'ACTIVE',  -- ACTIVE | OVERDUE | INACTIVE | CANCELLED
  next_due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 7. STACK TÉCNICA

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
| CI/CD | GitHub → Vercel (auto deploy no push) |

---

## 8. EPIC + STORIES AIOS

### EPIC-001: Mappy Website Rebuild

| Story | Título | Agentes | Squad |
|-------|--------|---------|-------|
| 1.1 | Setup técnico (Next.js + Supabase + Vercel) | @architect + @devops | — |
| 1.2 | Design system anti-AI (tokens, componentes base) | @ux-design-expert | squadsiteslp: steve-schoger |
| 1.3 | Site principal: Hero + Serviços + Como Funciona | @dev | squadsiteslp: josh-comeau, emil-kowalski |
| 1.4 | Site principal: "Ideal Para" (Framer Motion) | @dev | squadsiteslp: M1 |
| 1.5 | Formulário multi-step /comecar | @dev | squadsiteslp: M3 |
| 1.6 | Blog com Contentlayer (MDX) + SEO | @dev | squadsiteslp: M2 |
| 1.7 | Páginas /contato + /terapia-online + /white-label | @dev | squadsiteslp |
| 2.1 | LP B2B — estrutura + copy + form + WhatsApp | @dev | squadsiteslp: joanna-wiebe + kevin-indig |
| 3.1 | LP B2C — estrutura + copy + planos | @dev | squadsiteslp: oli-gardner + peep-laja |
| 3.2 | Integração Asaas (checkout + webhook → Supabase) | @architect + @dev | — |
| 4.1 | Deploy final (GitHub → Vercel → mappy.com.br) | @devops | squadsiteslp: lee-robinson |

---

## 9. WHATSAPP & CONTATOS

- **Número:** +55 22 3199-3772
- **Link padrão:** `https://wa.me/552231993772?text=Vim%20do%20site%2C%20quero%20saber%20mais%20sobre%20a%20Mappy`
- **Formulário multi-step:** usa mensagem personalizada com dados do lead (ver prompt)
- **LP B2B form:** mensagem com dados da empresa
- **Email:** contato@mappy.com.br

---

*Documento gerado por: Orion (AIOS Master) · 2026-03-03*
*Squad: squadsiteslp + AIOS core agents*
