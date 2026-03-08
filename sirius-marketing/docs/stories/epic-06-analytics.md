# Epic 06: Analytics & Intelligence
**Status:** Backlog
**Priority:** Alta — fecha o loop de criação → performance
**Squad:** squad-analytics

## User Stories

### Story 06.01: Own Profile Deep Analytics
**Como** profissional de marketing,
**Quero** ver os dados completos do meu perfil do Instagram e TikTok em um único lugar,
**Para** entender minha performance sem precisar ficar abrindo 2 apps diferentes.

**Acceptance Criteria:**
- [ ] Conexão OAuth com Instagram (Graph API) e TikTok
- [ ] Dashboard com: seguidores, alcance, impressões, taxa de engajamento
- [ ] Crescimento de seguidores dia a dia (gráfico)
- [ ] Posts ordenados por engajamento (likes + comentários + saves + shares)
- [ ] Melhores horários de postagem baseados em dados reais
- [ ] Dados demográficos do público (idade, gênero, localização)
- [ ] Atualizado diariamente, histórico de 90 dias

### Story 06.02: Campaign Monitor Automático
**Como** profissional de marketing que publica pelo app,
**Quero** que o sistema monitore automaticamente a performance de cada post publicado,
**Para** saber como cada campanha foi sem precisar verificar manualmente.

**Acceptance Criteria:**
- [ ] Monitoramento automático disparado via n8n após publicação
- [ ] Checkpoints em: 24h, 48h, 7 dias, 30 dias
- [ ] Métricas por checkpoint: likes, comentários, shares, saves, alcance, visualizações
- [ ] Comparativo com média histórica da marca ("acima da média" / "abaixo da média")
- [ ] Notificação quando post supera 1.5x a média (ou cai abaixo de 0.5x)
- [ ] Análise de sentimento dos comentários

### Story 06.03: Public Profile Scraper
**Como** profissional de marketing,
**Quero** ver dados de desempenho de qualquer perfil público do Instagram ou TikTok,
**Para** monitorar concorrentes e referências sem precisar seguir cada um.

**Acceptance Criteria:**
- [ ] Input: @username da plataforma
- [ ] Dados coletados: seguidores, frequência de posts, top posts por engajamento
- [ ] Estimativa de engajamento médio
- [ ] Hashtags mais usadas
- [ ] Tipos de conteúdo predominantes
- [ ] Histórico salvo para comparação futura
- [ ] Custo: 8 créditos por análise

### Story 06.04: Weekly Insights Report
**Como** profissional de marketing,
**Quero** receber toda segunda-feira um relatório de insights da semana anterior,
**Para** começar a semana sabendo o que funcionou e o que fazer diferente.

**Acceptance Criteria:**
- [ ] Relatório semanal gerado automaticamente toda segunda
- [ ] Conteúdo: top post da semana, o que funcionou, o que parar de fazer, 3 ações para essa semana
- [ ] Linguagem simples e direta (não técnica)
- [ ] Comparativo com semana anterior
- [ ] Notificação in-app + opção de receber por email
- [ ] Gratuito para planos Pro e Academy
