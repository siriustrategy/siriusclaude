# Epic 07: Distribution (Auto-Post)
**Status:** Backlog
**Priority:** Alta — sonho de todo profissional de marketing
**Squad:** squad-distribution
**Integração:** n8n obrigatório

## User Stories

### Story 07.01: Post Agendado
**Como** profissional de marketing,
**Quero** agendar posts para publicar automaticamente no Instagram e TikTok,
**Para** manter consistência de publicação sem precisar estar online na hora certa.

**Acceptance Criteria:**
- [ ] Após aprovar conteúdo, botão "Agendar Publicação"
- [ ] Seleção de plataforma (Instagram Feed, Instagram Reels, Instagram Stories, TikTok)
- [ ] Seletor de data e hora
- [ ] Sugestão de melhor horário baseada em dados analytics da conta
- [ ] Preview do post antes de confirmar
- [ ] Fila de posts agendados visível no calendário
- [ ] Cancelamento e edição até 30min antes da publicação

### Story 07.02: Publicação Imediata
**Como** profissional de marketing,
**Quero** publicar um conteúdo aprovado imediatamente sem sair da plataforma,
**Para** agir rápido quando uma trend urgente aparece.

**Acceptance Criteria:**
- [ ] Botão "Publicar Agora" em qualquer conteúdo aprovado
- [ ] Confirmação com preview antes de publicar
- [ ] Status em tempo real: publicando → publicado
- [ ] Link direto para o post após publicação
- [ ] Campanha automaticamente registrada para monitoramento (Epic 06)

### Story 07.03: Bulk Schedule (Calendário Completo)
**Como** profissional de marketing com calendário mensal aprovado,
**Quero** agendar todos os posts do mês de uma vez,
**Para** configurar tudo em uma sessão e deixar o mês rodando automaticamente.

**Acceptance Criteria:**
- [ ] Botão "Agendar Calendário Completo" na view do calendário editorial
- [ ] Revisão de todos os posts antes de confirmar (lista com preview)
- [ ] Custo total em créditos exibido antes de confirmar
- [ ] Agendamento em lote com 1 crédito por post
- [ ] Relatório de confirmação: X posts agendados, próximo post em Y
- [ ] Cancelamento em lote disponível

### Story 07.04: Publishing Queue
**Como** profissional de marketing,
**Quero** ver tudo que está agendado para publicar,
**Para** ter controle total sobre o que vai sair e quando.

**Acceptance Criteria:**
- [ ] View de calendário e view de lista da fila de publicações
- [ ] Cada item: preview da imagem, copy, plataforma, data/hora, status
- [ ] Status: agendado → publicando → publicado → erro
- [ ] Alertas de erro com causa e opção de reagendar
- [ ] Filtro por marca, plataforma, período
