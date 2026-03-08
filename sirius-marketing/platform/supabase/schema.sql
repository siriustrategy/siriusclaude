-- Sirius-Marketing: Schema Supabase
-- Executar no Supabase SQL Editor na ordem abaixo

-- =====================
-- EXTENSÕES
-- =====================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================
-- MARCAS (até 3 por conta)
-- =====================
create table brands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  logo_url text,
  logo_icon_url text,
  is_active boolean default false,
  slot integer check (slot between 1 and 3),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, slot)
);

-- =====================
-- BRAND MEMORY
-- =====================
create table brand_memory (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade unique,
  mission text,
  vision text,
  values text[],
  target_audience_primary text,
  target_audience_secondary text,
  target_pain_points text[],
  primary_color text,
  secondary_colors text[],
  typography_heading text,
  typography_body text,
  image_style text check (image_style in ('fotografico','ilustrativo','minimalista','bold','misto')),
  tone_personality text[],
  tone_do_say text[],
  tone_dont_say text[],
  formality_level integer check (formality_level between 1 and 5),
  content_pillars text[],
  approved_examples text[],
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- BRAND VOICE PROFILE
-- =====================
create table brand_voice_profiles (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade unique,
  avg_sentence_length text check (avg_sentence_length in ('short','medium','long')),
  uses_questions boolean default false,
  uses_lists boolean default false,
  frequent_words text[],
  power_words text[],
  avoided_words text[],
  uses_humor boolean default false,
  uses_urgency boolean default false,
  uses_social_proof boolean default false,
  uses_storytelling boolean default false,
  uses_numbers boolean default false,
  emoji_usage text check (emoji_usage in ('none','rare','moderate','frequent')),
  cta_patterns text[],
  signature_phrases text[],
  training_examples text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- PERSONAGENS
-- =====================
create table characters (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  name text not null,
  role text,
  description text,
  physical_attributes jsonb,
  visual_style jsonb,
  consistency_seed text,
  negative_prompts text,
  sheet_images jsonb,
  created_at timestamptz default now()
);

-- =====================
-- ASSETS GERADOS
-- =====================
create table assets (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  user_id uuid references auth.users(id),
  type text check (type in ('image','video','animation')),
  engine text check (engine in ('flux','seaart','kling','sora','remotion')),
  url text not null,
  thumbnail_url text,
  prompt_id uuid,
  brand_score integer check (brand_score between 0 and 100),
  format text,
  width integer,
  height integer,
  metadata jsonb,
  collection_id uuid,
  created_at timestamptz default now()
);

-- =====================
-- PROMPT LIBRARY
-- =====================
create table saved_prompts (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  prompt_text text not null,
  engine text,
  brand_score integer,
  tags text[],
  content_type text,
  usage_count integer default 0,
  is_template boolean default false,
  created_at timestamptz default now()
);

-- =====================
-- CALENDÁRIO EDITORIAL
-- =====================
create table calendar_items (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  date date not null,
  platform text check (platform in ('instagram','tiktok','linkedin','youtube','all')),
  content_pillar text check (content_pillar in ('educar','vender','engajar','entreter','inspirar')),
  post_type text,
  theme text,
  hook_suggestion text,
  copy_direction text,
  visual_direction text,
  trend_tie_in text,
  priority text check (priority in ('alta','media','baixa')) default 'media',
  status text check (status in ('rascunho','briefing_criado','em_producao','agendado','publicado')) default 'rascunho',
  content_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- CAMPANHAS PUBLICADAS
-- =====================
create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  platform text not null,
  post_url text,
  platform_post_id text,
  published_at timestamptz,
  asset_id uuid references assets(id),
  copy_text text,
  hashtags text[],
  workflow_origin text,
  status text check (status in ('scheduled','publishing','published','failed','monitoring')) default 'scheduled',
  monitoring_active boolean default true,
  created_at timestamptz default now()
);

-- =====================
-- MÉTRICAS DE CAMPANHA
-- =====================
create table campaign_metrics (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id) on delete cascade,
  checkpoint text check (checkpoint in ('24h','48h','7d','30d')),
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  saves integer default 0,
  reach integer default 0,
  impressions integer default 0,
  video_views integer default 0,
  engagement_rate numeric(5,2),
  sentiment_positive integer default 0,
  sentiment_neutral integer default 0,
  sentiment_negative integer default 0,
  collected_at timestamptz default now(),
  unique(campaign_id, checkpoint)
);

-- =====================
-- TRENDS VIRAIS
-- =====================
create table viral_trends (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text check (category in ('cultural','music','event','behavior','aesthetic','niche')),
  platforms text[],
  velocity text check (velocity in ('emerging','growing','peak','declining')),
  analysis_json jsonb,
  collected_date date not null,
  expires_at date,
  created_at timestamptz default now()
);

-- =====================
-- ADAPTAÇÕES DE TREND POR MARCA
-- =====================
create table trend_adaptations (
  id uuid primary key default uuid_generate_v4(),
  trend_id uuid references viral_trends(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  brand_fit_score integer check (brand_fit_score between 0 and 10),
  recommendation text check (recommendation in ('use','adapt','comment','avoid')),
  timing_urgency text check (timing_urgency in ('urgent','standard','optional')),
  creative_brief jsonb,
  risk_note text,
  created_at timestamptz default now(),
  unique(trend_id, brand_id)
);

-- =====================
-- INSIGHTS ANALYTICS
-- =====================
create table analytics_insights (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  period_start date,
  period_end date,
  report_type text check (report_type in ('weekly','monthly','campaign')),
  report_json jsonb,
  created_at timestamptz default now()
);

-- =====================
-- CRÉDITOS
-- =====================
create table user_credits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique,
  balance integer not null default 100,
  plan text check (plan in ('free','pro','academy','enterprise')) default 'free',
  monthly_allowance integer default 30,
  reset_date date,
  trial_active boolean default true,
  trial_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table credit_ledger (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  amount integer not null,
  balance_after integer not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Função para debitar créditos atomicamente
create or replace function deduct_credits(
  p_user_id uuid,
  p_amount integer,
  p_action text,
  p_metadata jsonb default '{}'
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_balance integer;
  v_new_balance integer;
begin
  select balance into v_balance
  from user_credits
  where user_id = p_user_id
  for update;

  if v_balance is null then
    return false;
  end if;

  if v_balance < p_amount then
    return false;
  end if;

  v_new_balance := v_balance - p_amount;

  update user_credits
  set balance = v_new_balance, updated_at = now()
  where user_id = p_user_id;

  insert into credit_ledger (user_id, action, amount, balance_after, metadata)
  values (p_user_id, p_action, -p_amount, v_new_balance, p_metadata);

  return true;
end;
$$;

-- =====================
-- LOVABLE PROMPTS
-- =====================
create table lovable_prompts (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  user_id uuid references auth.users(id),
  project_name text,
  interview_json jsonb,
  prompt_text text,
  quality_score integer check (quality_score between 0 and 100),
  created_at timestamptz default now()
);

-- =====================
-- RLS (Row Level Security)
-- =====================
alter table brands enable row level security;
alter table brand_memory enable row level security;
alter table brand_voice_profiles enable row level security;
alter table characters enable row level security;
alter table assets enable row level security;
alter table saved_prompts enable row level security;
alter table calendar_items enable row level security;
alter table campaigns enable row level security;
alter table campaign_metrics enable row level security;
alter table analytics_insights enable row level security;
alter table user_credits enable row level security;
alter table credit_ledger enable row level security;
alter table lovable_prompts enable row level security;
alter table trend_adaptations enable row level security;

-- Políticas: usuário só acessa seus próprios dados
create policy "users own brands" on brands for all using (auth.uid() = user_id);
create policy "users own assets" on assets for all using (auth.uid() = user_id);
create policy "users own credits" on user_credits for all using (auth.uid() = user_id);
create policy "users own credit_ledger" on credit_ledger for all using (auth.uid() = user_id);
create policy "users own lovable_prompts" on lovable_prompts for all using (auth.uid() = user_id);

-- Brand memory/voice: acesso via brand ownership
create policy "brand memory via brand" on brand_memory for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "brand voice via brand" on brand_voice_profiles for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "characters via brand" on characters for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "calendar via brand" on calendar_items for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "campaigns via brand" on campaigns for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "saved prompts via brand" on saved_prompts for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "analytics via brand" on analytics_insights for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

create policy "trend adaptations via brand" on trend_adaptations for all
  using (brand_id in (select id from brands where user_id = auth.uid()));

-- Campaign metrics: acesso via campaign ownership
create policy "metrics via campaign" on campaign_metrics for all
  using (campaign_id in (
    select id from campaigns
    where brand_id in (select id from brands where user_id = auth.uid())
  ));

-- Viral trends: leitura pública (são dados globais)
alter table viral_trends enable row level security;
create policy "viral trends public read" on viral_trends for select using (true);
