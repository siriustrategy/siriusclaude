# Task: Adapt Trend to Brand

**Agent:** trend-adapter
**Squad:** squad-viral-intelligence
**Credits:** 2

## Objetivo
Avaliar o fit de uma trend com a marca ativa e gerar um briefing criativo prático para a marca usar a trend.

## Inputs
- `trend_id`: ID da trend coletada
- `brand_id`: marca ativa
- `viral_analysis`: output do task analyze-why-viral (opcional mas recomendado)

## Processo

### Step 1: Carregar Contextos
- Carregar Brand Memory da marca ativa
- Carregar análise viral da trend (se disponível)
- Carregar histórico de performance da marca (squad-analytics)

### Step 2: Avaliar Brand Fit
Pontuar cada dimensão de 0-10:
- Audience Overlap: o público da marca consome esse tipo de conteúdo?
- Brand Voice Compatibility: a marca pode falar sobre isso autenticamente?
- Visual Alignment: o estilo visual da trend combina com a identidade da marca?
- Risk Assessment: tem risco reputacional ou de parecer forçado?

### Step 3: Definir Tipo de Adaptação
Com base no score de fit:
- 8-10: direct_participation (usar o formato viral com a marca)
- 6-7: thematic_adaptation (usar o tema mas com formato próprio)
- 4-5: commentary (comentar sobre a trend sem participar)
- 0-3: avoid (não usar — explicar o motivo)

### Step 4: Gerar Creative Brief
Para adaptações recomendadas (score >= 4):
- Conceito da adaptação
- Formato de conteúdo sugerido
- Mensagem-chave
- Direção visual (cor, estilo, elementos)
- Hook sugerido
- CTA alinhado com objetivo da marca
- Timing (quando usar — urgente, essa semana, esse mês)

### Step 5: Alertas Importantes
- Informar janela de oportunidade (quando a trend vai passar do pico)
- Alertar se trend tem conotação política, sexual ou de risco
- Sugerir ajuste se algum elemento da trend conflitar com valores da marca

## Output

```json
{
  "trend_id": "trend_001",
  "brand_id": "brand_001",
  "evaluation": {
    "brand_fit_score": 8,
    "audience_overlap": 9,
    "voice_compatibility": 8,
    "visual_alignment": 7,
    "risk_level": "low"
  },
  "recommendation": "direct_participation",
  "timing_urgency": "now",
  "opportunity_window_closes": "2026-03-09",
  "creative_brief": {
    "concept": "Adaptar o sound viral X com o produto Y no contexto de Z",
    "format": "Reel 15 segundos",
    "key_message": "mensagem principal",
    "visual_direction": "paleta quente, movimento rápido, texto no centro",
    "hook": "Primeiros 3 segundos: [descrição do hook]",
    "cta": "Chamada para ação específica"
  },
  "risk_note": "Trend neutra, sem riscos identificados",
  "send_to": "squad-content-factory | squad-creative-studio"
}
```

## Próximo Passo
Brief enviado para:
- `squad-content-factory` (se precisar de copy/storyboard)
- `squad-creative-studio` (se precisar de imagem/vídeo)
