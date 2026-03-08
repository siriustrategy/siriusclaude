# 🌟 Squad Sirius Proposals
**Versão:** 1.0.0
**Domínio:** Propostas Comerciais & Vendas Consultivas
**Ativação:** `@squad-sirius-proposals`

---

## O que esse squad faz

Cria propostas comerciais completas e personalizadas para clientes da Sirius Strategy.
Do briefing inicial até a pasta de materiais pronta para apresentar.

**Input:** Informações sobre um cliente potencial
**Output:** Proposta completa com deck, script, ROI, cronograma, contrato e email de follow-up

---

## Agentes

| Agente | Based on | Papel |
|--------|---------|-------|
| `sirius-proposals-chief` | Orchestrator | Conduz o workflow completo |
| `@maister` | David Maister | Pesquisa o cliente (site, redes, stack, dores) |
| `@blair-enns` | Blair Enns | Posicionamento + quais serviços oferecer |
| `@hormozi` | Alex Hormozi | Monta os 3 planos com Value Stack |
| `@corey-quinn` | Corey Quinn | Custo real: infra, APIs, tempo de dev |
| `@patrick-campbell` | Patrick Campbell | Precificação MRR e validação de margens |
| `@klaff` | Oren Klaff | Script slide a slide + manejo de objeções |
| `@nancy-duarte` | Nancy Duarte | Estrutura visual do deck + branding Sirius |

---

## Como usar

### Iniciar uma nova proposta
```
*nova-proposta
```
O chief vai fazer as perguntas de intake e coordenar todo o resto.

### Comandos disponíveis
- `*nova-proposta` — Iniciar proposta do zero
- `*retomar [cliente]` — Retomar proposta em andamento
- `*revisar [cliente]` — Ajustar proposta existente
- `*status` — Ver o que está em andamento
- `*help` — Ver todos os comandos

---

## Workflow (resumo)

```
1. INTAKE       → chief faz perguntas sobre o cliente (5-15 min)
2. PESQUISA     → @maister pesquisa o cliente online (15-20 min)
3. ESTRATÉGIA   → @blair-enns define posicionamento (10-15 min)
4. 3 PLANOS     → @hormozi monta os planos com Value Stack (15-20 min)
5. CUSTOS       → @corey-quinn calcula custo real de infra + tempo (em paralelo)
6. PRICING      → @patrick-campbell valida margens e define MRR (em paralelo, 20 min total)
7. DECK         → @nancy-duarte estrutura visual (em paralelo com 8)
8. SCRIPT       → @klaff escreve o que falar slide a slide (em paralelo, 25 min total)
9. MATERIAIS    → chief consolida tudo e gera pasta final (20-30 min)
```

**Tempo total estimado:** 2-3 horas para uma proposta completa

---

## Output gerado por proposta

```
proposta-[empresa]-[data]/
├── deck-proposta.md           ← Guia para montar no Google Slides
├── script-apresentacao.md     ← O que falar slide a slide
├── onepager.md                ← Resumo executivo 1 página
├── roi-projetado.md           ← Planilha de ROI
├── cronograma.md              ← Timeline de implementação
├── contrato.md                ← Proposta formal / pré-contrato
├── followup-email.md          ← Email pós-reunião
├── objecoes.md                ← Mapeamento + respostas preparadas
└── case-study.md              ← Caso de uso do setor do cliente
```

---

## Modelo de negócio integrado

O squad entende e trabalha com o modelo Sirius:
- **Implementação única:** Taxa por projeto
- **MRR:** Fee mensal para manutenção, suporte e evolução
- **Hub de soluções:** Cada serviço complementa o outro — nunca isolado
- **Expansão natural:** Plano 1 → Plano 2 → Plano 3 ao longo do tempo

---

## Arquivos de dados (atualizar periodicamente)

| Arquivo | Descrição | Atualizar quando |
|---------|-----------|-----------------|
| `data/sirius-services-catalog.md` | Catálogo de serviços | Adicionar novo serviço |
| `data/pricing-reference.md` | Preços base Sirius | Mudança de preços |
| `data/infrastructure-costs-reference.md` | Custos de infra | Semestral ou quando mudar provedor |
| `data/sirius-branding.md` | Branding e visual | Quando tiver logo/tipografia oficial |

---

## Branding Sirius (referência rápida)

- **Tema:** Espacial — Sirius é a estrela mais brilhante do céu
- **Cores:** `#0A0E1A` (fundo) · `#4A90D9` (azul Sirius) · `#FFFFFF` (branco) · `#C8A951` (dourado/premium)
- **Tom:** Premium, confiante, futurista e acessível
- **Ferramenta de apresentação:** Google Slides

---

*Squad criado pelo Squad Creator · Sirius Strategy · 2026*
