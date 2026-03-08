# Sirius-Marketing — Arquitetura Técnica

## Stack

```
Frontend:  Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
Backend:   Supabase (DB + Auth + Edge Functions)
Automação: n8n (auto-post + webhooks de monitoramento)
Scraping:  Playwright (perfis públicos) + APIs oficiais (perfil próprio)
Animação:  Remotion
AI Agents: Claude API (Anthropic) via workflows AIOS
Deploy:    Railway (sync com GitHub main)
```

## Banco de Dados (Supabase)

```sql
-- Marcas (até 3 por conta)
brands (id, user_id, name, logo_url, is_active, created_at)

-- Brand Memory
brand_memory (id, brand_id, mission, vision, values, target_audience,
               visual_identity, tone_of_voice, content_pillars, updated_at)

-- Brand Voice Profile
brand_voice_profiles (id, brand_id, sentence_patterns, vocabulary,
                       rhetorical_devices, training_examples, updated_at)

-- Assets gerados
assets (id, brand_id, user_id, type, engine, url, prompt_id,
        brand_score, metadata, created_at)

-- Prompt Library
saved_prompts (id, brand_id, prompt_text, engine, score, tags,
               usage_count, created_at)

-- Personagens
characters (id, brand_id, name, character_sheet, consistency_seed,
            images, created_at)

-- Calendário Editorial
calendar_items (id, brand_id, date, platform, content_pillar, post_type,
                theme, status, content_id, created_at)

-- Campanhas Publicadas
campaigns (id, brand_id, platform, post_url, post_id, published_at,
           workflow_origin, status)

-- Métricas de Campanha
campaign_metrics (id, campaign_id, checkpoint, likes, comments, shares,
                  saves, reach, impressions, video_views, collected_at)

-- Insights Analytics
analytics_insights (id, brand_id, period, report_json, created_at)

-- Trends Coletadas
viral_trends (id, title, category, platforms, velocity, analysis_json,
              collected_date, expires_at)

-- Créditos
credit_ledger (id, user_id, action, amount, balance_after, created_at)
user_credits (id, user_id, balance, plan, reset_date)

-- Lovable Prompts
lovable_prompts (id, brand_id, project_name, interview_json,
                 prompt_text, quality_score, created_at)
```

## Fluxo de Dados — Criação de Imagem

```
Usuário → [Frontend] → Brand Memory carregada
       → [squad-creative-studio] → prompt-engineer constrói prompt
       → [Engine selecionado] → Imagem gerada
       → [squad-brand-guardian] → brand-police valida (score)
       → Score >= 80: Aprovado → Salvo na biblioteca
       → Score < 80: Auto-ajuste → Regenerar (máx 2x)
       → Frontend exibe resultado com score
```

## Fluxo de Dados — Campaign Monitor

```
Post publicado → [n8n webhook] → POST /webhooks/post-published
              → [squad-analytics] → campaign-monitor registra
              → [Scheduled] → social-scraper coleta em 24h/48h/7d/30d
              → [insights-analyst] → analisa e compara com histórico
              → [Frontend] → Dashboard atualizado + alerta se outlier
```

## Fluxo de Dados — Viral Intelligence

```
[Cron semanal - segunda 08:00] → trend-hunter coleta trends
                               → viral-analyst analisa porquê viralizou
                               → trend-predictor identifica futures
                               → trend-adapter gera briefings por marca
                               → [Frontend] → Viral Feed atualizado
                               → [Notificação] → Usuário notificado
```

## Componentes Frontend (Next.js)

```
app/
├── (auth)/
│   ├── login/
│   └── callback/  -- SSO Sirius Academy
├── dashboard/
│   ├── page.tsx   -- Home com "O que fazer agora"
│   ├── brands/    -- Multi-brand selector
│   ├── viral/     -- Viral Intelligence Feed
│   ├── studio/    -- Creative Studio
│   ├── content/   -- Content Factory
│   ├── ideas/     -- Ideas Lab
│   ├── analytics/ -- Analytics Dashboard
│   ├── library/   -- Asset + Prompt Library
│   ├── lovable/   -- Lovable Architect
│   └── settings/  -- Créditos, conta, integrações
└── api/
    ├── webhooks/
    │   └── post-published/
    ├── agents/    -- Endpoints para chamar squads
    └── credits/   -- Gerenciamento de créditos
```

## Multi-Brand Context

```typescript
// Context global — sempre carregado
interface ActiveBrandContext {
  brandId: string
  brandName: string
  brandMemory: BrandMemory
  voiceProfile: VoiceProfile
  logoConfig: LogoConfig
  creditBalance: number
}

// Header sempre visível
<BrandSelector brands={userBrands} active={activeBrand} onChange={switchBrand} />
```

## Segurança

- Brand Memory: criptografada em repouso (Supabase RLS)
- API Keys de engines: armazenadas em Supabase Vault
- Tokens OAuth (Meta, TikTok): refresh automático, nunca expostos no frontend
- Rate limiting: 100 req/min por usuário
- Scraping: User-agent rotation, delays aleatórios, sem bypass de auth
