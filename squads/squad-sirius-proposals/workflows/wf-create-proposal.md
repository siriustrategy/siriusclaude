# Workflow: Criar Proposta Comercial Sirius
# ID: wf-create-proposal
# Agente orquestrador: sirius-proposals-chief

## Descrição
Workflow completo para criar uma proposta comercial personalizada para um cliente.
Vai do intake inicial até a entrega da pasta com todos os materiais prontos.

## Elicitation inicial (obrigatório)
elicit: true
Antes de iniciar, coletar via intake-client.md:
- Nome da empresa do cliente
- Setor de atuação
- Tamanho da empresa
- Nome do contato / decisor
- O que o cliente espera (objetivo)
- Dores mencionadas
- O que já têm (stack atual)
- Budget aproximado (se souber)
- Materiais opcionais: gravação de reunião, site, LinkedIn

---

## FASE 1 — INTAKE E BRIEFING
**Agente:** sirius-proposals-chief
**Task:** intake-client.md
**Duração estimada:** 5-15 minutos

### Passos
1. Coletar informações obrigatórias do intake
2. Verificar se materiais externos foram fornecidos (gravação, briefing)
3. Confirmar: "Tenho tudo que preciso para iniciar. Vou coordenar o squad agora."

### Veto Conditions — Fase 1
- ❌ Avançar sem nome da empresa do cliente
- ❌ Avançar sem pelo menos 1 dor identificada
- ❌ Avançar sem setor de atuação

### Output
- briefing-cliente.md (resumo do intake)

### Handoff
→ @maister (Fase 2)

---

## FASE 2 — INTELIGÊNCIA DO CLIENTE
**Agente:** @maister
**Task:** research-client.md
**Duração estimada:** 10-20 minutos

### Passos
1. Pesquisar site do cliente
2. Verificar LinkedIn da empresa
3. Verificar redes sociais (Instagram, Facebook)
4. Mapear stack tecnológico detectado
5. Analisar materiais fornecidos (se houver)
6. Identificar dores implícitas além das declaradas
7. Calcular Score de Maturidade Digital (1-5)
8. Calcular Score de Potencial do Lead (1-10)

### Veto Conditions — Fase 2
- ❌ Avançar sem Score de Maturidade Digital calculado
- ❌ Avançar se Score de Potencial < 3/10 sem consultar usuário
  → Se score baixo: "Cliente tem score [X]/10. Deseja continuar a proposta ou qualificar mais antes?"

### Output
- relatorio-inteligencia-[cliente].md

### Handoff
→ @blair-enns (Fase 3)

---

## FASE 3 — ESTRATÉGIA DE POSICIONAMENTO
**Agente:** @blair-enns
**Task:** (análise estratégica inline)
**Duração estimada:** 10-15 minutos

### Passos
1. Analisar relatório do @maister
2. Definir posicionamento da Sirius para esse cliente
3. Selecionar serviços aplicáveis do catálogo (sirius-services-catalog.md)
4. Identificar serviços NÃO aplicáveis
5. Definir "história do hub" para esse cliente
6. Definir lógica dos 3 planos (quais serviços em cada um)
7. Definir mensagem central da proposta
8. **Mapear stack tecnológico por plano** — consultar `data/tech-stack-reference.md`
   - Listar ferramentas específicas de cada plano (ex: n8n, Supabase, Evolution API, Claude, Gemini)
   - Classificar em: Automação | IA | Banco de dados | Frontend | Infraestrutura | Comunicação
   - Identificar ferramentas que o cliente já usa (reaproveitar quando possível)
   - Registrar no output: `stack_por_plano: {plano1: [...], plano2: [...], plano3: [...]}`

### Veto Conditions — Fase 3
- ❌ Avançar com mais de 6 serviços no plano mais completo
- ❌ Criar planos sem lógica de hub (serviços isolados)
- ❌ Avançar sem stack tecnológico mapeado por plano

### Output
- estrategia-posicionamento-[cliente].md (incluindo seção `## Stack Tecnológico por Plano`)

### Handoff
→ @hormozi (Fase 4)

---

## FASE 4 — DESIGN DOS 3 PLANOS
**Agente:** @hormozi
**Task:** build-offer-plans.md
**Duração estimada:** 15-20 minutos

### Passos
1. Receber estratégia do @blair-enns
2. Nomear os 3 planos (não Básico/Médio/Premium)
3. Montar Value Stack de cada plano
4. Definir bônus estratégicos (1-3 por plano)
5. Criar ancoragem de mercado para cada plano
6. Escrever Dream Outcome de cada plano
7. Definir prazo estimado de cada plano

### Veto Conditions — Fase 4
- ❌ Usar nomes genéricos para planos (Básico, Médio, Premium)
- ❌ Criar plano sem bônus
- ❌ Criar plano sem Dream Outcome específico

### Output
- planos-oferta-[cliente].md (com preços em branco, a preencher nas fases 5-6)

### Handoff
→ @corey-quinn + @patrick-campbell (Fase 5 — em paralelo)

---

## FASE 5 — CUSTOS E PRICING (em paralelo)
**Agentes:** @corey-quinn E @patrick-campbell (simultaneamente)
**Tasks:** calculate-project-costs.md
**Duração estimada:** 15-20 minutos

### @corey-quinn executa
1. Analisar os 3 planos do @hormozi
2. Listar todos os componentes de cada plano
3. Consultar infrastructure-costs-reference.md
4. Calcular custo de infra + APIs em 3 cenários (início, crescimento, escala)
5. Estimar horas de desenvolvimento por plano
6. Identificar custos ocultos
7. Calcular custo total mensal por plano

### @patrick-campbell executa (com dados do @corey-quinn)
1. Receber custos reais do @corey-quinn
2. Estimar valor gerado por cada plano para esse cliente
3. Consultar pricing-reference.md
4. Definir implementação + MRR de cada plano
5. Validar margem (mínimo 60% impl., 65% MRR)
6. Calcular LTV projetado
7. Definir estrutura do contrato

### Checkpoint obrigatório
Após @patrick-campbell definir preços:
→ sirius-proposals-chief verifica pricing-reference.md
→ Se preços base existem, confirmar com usuário: "Preços calculados: [X]. Quer ajustar algum plano?"
→ Se usuário ajustar, @patrick-campbell recalcula margem

### Veto Conditions — Fase 5
- ❌ Avançar com margem MRR < 60% sem alerta e aprovação do usuário
- ❌ Avançar com margem de implementação < 50% sem alerta

### Output
- analise-custos-[cliente].md
- pricing-final-[cliente].md

### Handoff
→ @klaff + @nancy-duarte (Fase 6 — em paralelo)

---

## FASE 6 — APRESENTAÇÃO (em paralelo)
**Agentes:** @klaff E @nancy-duarte (simultaneamente)
**Duração estimada:** 20-30 minutos

### @klaff executa
1. Receber todos os outputs anteriores
2. Escrever script de apresentação slide a slide
3. Criar mapeamento de objeções + respostas
4. Definir o fechamento

### @nancy-duarte executa
1. Receber estrutura de conteúdo e script
2. Definir layout de cada slide
3. Especificar branding Sirius aplicado
4. Especificar como inserir logo e nome do cliente
5. Criar guia de design para montagem no Google Slides
6. **Incluir slide "Stack Tecnológico"** — obrigatório, posicionado após os 3 planos:
   - Mostrar ferramentas de cada plano com ícone/logo + nome + função resumida
   - Formato sugerido: colunas por plano, ferramentas listadas por categoria
   - Exemplo de categorias: Automação, IA, Banco de Dados, Frontend, Infra, Comunicação
   - Não deve ter mais de 6 ferramentas por plano visíveis (condensar se necessário)
7. **Incluir badges de ferramentas** nos slides de detalhe de cada plano:
   - Rodapé do slide com ícones pequenos das ferramentas principais daquele plano
   - Máximo 5 ícones por slide de plano

### Veto Conditions — Fase 6
- ❌ Script sem resposta para as 5 objeções principais
- ❌ Guia de design sem especificação de logo do cliente
- ❌ Deck com mais de 18 slides
- ❌ Deck sem slide de Stack Tecnológico
- ❌ Slides de plano sem badges de ferramentas no rodapé

### Output
- script-apresentacao-[cliente].md
- guia-design-deck-[cliente].md

### Handoff
→ sirius-proposals-chief (Fase 7)

---

## FASE 7 — MATERIAIS DE APOIO + CONSOLIDAÇÃO
**Agente:** sirius-proposals-chief
**Task:** generate-materials.md
**Duração estimada:** 20-30 minutos

### Passos
1. Gerar one-pager executivo (template: onepager-tmpl.md)
2. Gerar planilha de ROI projetado (template: roi-spreadsheet-tmpl.md)
3. Gerar cronograma de implementação (template: timeline)
4. Gerar contrato / proposta formal (template: contract-tmpl.md)
5. Gerar email de follow-up pós-reunião (template: followup-email-tmpl.md)
6. Gerar case study por setor do cliente (template: case-study-tmpl.md)
7. Consolidar todos os arquivos

### Checklist final de personalização
- [ ] Nome da empresa do cliente em todos os documentos
- [ ] Logo do cliente indicado na capa do deck
- [ ] Dores específicas mencionadas (não texto genérico)
- [ ] Preços validados com usuário
- [ ] Prazo de implementação realista
- [ ] Próximos passos claros no deck e no email

### Output — Pasta Final do Cliente
```
proposta-[nome-empresa]-[data]/
├── deck-proposta.md       ← Guia para montar no Google Slides
├── script-apresentacao.md ← O que falar slide a slide
├── onepager.md            ← Resumo executivo 1 página
├── roi-projetado.md       ← Planilha de ROI
├── cronograma.md          ← Timeline de implementação
├── contrato.md            ← Proposta formal / contrato
├── followup-email.md      ← Email pós-reunião
├── objecoes.md            ← Mapeamento + respostas
└── case-study.md          ← Caso de uso do setor
```

### Confirmação final com usuário
"Proposta completa para [nome da empresa] gerada. Aqui está o resumo:
- Plano Essencial: R$[X] impl + R$[Y]/mês
- Plano Aceleração: R$[X] impl + R$[Y]/mês
- Plano Transformação: R$[X] impl + R$[Y]/mês
[Lista de todos os arquivos]
Quer ajustar algum plano ou informação antes de usar com o cliente?"

---

## Resumo do Fluxo

```
INTAKE → PESQUISA → ESTRATÉGIA → 3 PLANOS → CUSTOS+PRICING → APRESENTAÇÃO → MATERIAIS
(chief)  (maister)  (blair-enns)  (hormozi)   (corey+campbell) (klaff+duarte)  (chief)
 5min     15min      15min         20min         20min           25min          30min
```

**Duração total estimada:** 2-3 horas para uma proposta completa e personalizada.

---

## Comandos de controle
- `*nova-proposta` — Inicia do zero
- `*retomar [cliente]` — Retoma onde parou
- `*pular-fase [N]` — Pula fase (requer justificativa)
- `*revisar [fase]` — Refaz uma fase específica
