# Task: Fetch Viral Content

**Agent:** trend-hunter
**Squad:** squad-viral-intelligence
**Credits:** 3

## Objetivo
Coletar os conteúdos mais virais do período selecionado nas plataformas YouTube, TikTok e Instagram.

## Inputs
- `period`: today | week | month
- `platforms`: [youtube, tiktok, instagram] (default: all)
- `brand_id`: marca ativa (para filtro de relevância)
- `category_filter`: (opcional) cultural | music | event | behavior | aesthetic

## Processo

### Step 1: Definir Fontes por Plataforma
- **YouTube:** Trending por país (BR), YouTube Shorts em alta, videos com crescimento anormal em 24h
- **TikTok:** For You Page tendências, sounds virais, hashtags em crescimento >200% nas últimas 24h
- **Instagram:** Explore page, Reels com maior alcance, hashtags emergentes

### Step 2: Coletar Dados
Para cada conteúdo identificado, coletar:
- URL ou referência
- Título/descrição
- Métricas disponíveis (views, likes, shares, comments)
- Velocidade de crescimento (emerging/growing/peak/declining)
- Plataforma de origem
- Categoria da trend

### Step 3: Deduplicação
Remover conteúdos duplicados entre plataformas (mesma trend em múltiplos lugares = força maior).

### Step 4: Ranqueamento
Ranquear por:
1. Velocidade de crescimento (peso 40%)
2. Volume absoluto de engajamento (peso 30%)
3. Presença multiplataforma (peso 30%)

### Step 5: Filtrar por Relevância de Marca
Usar o `brand_id` ativo para filtrar/ranquear por relevância ao nicho.

## Output

```json
{
  "period": "week",
  "collected_at": "2026-03-07T08:00:00Z",
  "brand_id": "brand_001",
  "total_trends": 20,
  "trends": [
    {
      "trend_id": "trend_001",
      "title": "Nome/descrição da trend",
      "category": "music",
      "platforms": ["tiktok", "instagram"],
      "velocity": "emerging",
      "engagement_estimate": "2.1M interações",
      "example_url": "referência",
      "brand_relevance_score": 8,
      "urgency": "now"
    }
  ]
}
```

## Condições de Erro
- Rate limit atingido: aguardar 1h e tentar novamente
- Plataforma indisponível: continuar com as demais, reportar no output
- Sem trends relevantes para a marca: retornar lista completa sem filtro, indicar baixa relevância

## Próximo Passo
Output alimenta automaticamente `analyze-why-viral` e `predict-trends`.
