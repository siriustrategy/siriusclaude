# Referência de Custos de Infraestrutura
# Fonte: Preços de mercado 2025-2026 (Brasil / USD convertido)
# Uso: @corey-quinn consulta este arquivo para calcular custos reais de projeto

## ⚠️ IMPORTANTE
Este arquivo é a base de referência. Os custos reais dependem do volume de uso.
Sempre calcular em 3 cenários: Início (pequeno), Crescimento (médio), Escala (grande).

---

## 🗄️ BANCO DE DADOS — SUPABASE

| Plano | Custo/mês | Inclui | Ideal para |
|-------|-----------|--------|-----------|
| Free | $0 | 500MB storage, 2GB transfer, 50.000 MAU | Prova de conceito / desenvolvimento |
| Pro | $25/mês | 8GB storage, 250GB transfer, 100.000 MAU | Projetos pequenos-médios em produção |
| Team | $599/mês | Storage ilimitado, backups avançados | Empresas com alto volume |
| Enterprise | Customizado | SLA garantido, suporte dedicado | Corporativo |

**Custos adicionais Supabase:**
- Storage extra: $0.021/GB
- Transfer extra: $0.09/GB
- Auth MAU extra (acima do plano): $0.00325/MAU
- Funções Edge (execuções): $0.000002/invocação (acima de 500.000)

**Estimativas reais por tipo de projeto:**
- Landing page simples (sem auth): Free ou Pro ($25)
- CRM médio (500 usuários/mês): Pro ($25-$50 com extras)
- CRM grande (5.000 usuários): Pro ($80-$150 com extras)
- Plataforma completa (50.000 MAU): Team ($599+)

---

## 🖥️ HOSPEDAGEM / VPS

### Vercel (sites/apps Next.js)
| Plano | Custo/mês | Inclui |
|-------|-----------|--------|
| Hobby | $0 | 1 projeto, limites de uso |
| Pro | $20/mês | Projetos ilimitados, domínios customizados, analytics |
| Team | $50/mês | Colaboração, mais recursos |

**Extra Vercel:**
- Bandwidth além do plano: $0.15/GB
- Funções serverless: $0.60/1M invocações

### VPS (para servers Node.js/Python, agentes, etc.)
| Provedor | Configuração | Custo/mês | Uso |
|----------|-------------|-----------|-----|
| Railway | 512MB RAM | $5-10 | Pequenos bots/agentes |
| Railway | 2GB RAM | $20-30 | Agentes médios, APIs |
| DigitalOcean | 2GB RAM | $12 | Apps médios |
| DigitalOcean | 4GB RAM | $24 | Apps com mais carga |
| Fly.io | Básico | $7-15 | Microserviços |
| AWS/GCP | Variável | $30-200+ | Enterprise/alto volume |

---

## 🤖 APIs DE IA

### Claude (Anthropic)
| Modelo | Input (1M tokens) | Output (1M tokens) | Uso típico |
|--------|------------------|-------------------|-----------|
| Claude Haiku 3.5 | $0.80 | $4.00 | Agentes de volume, respostas simples |
| Claude Sonnet 4.6 | $3.00 | $15.00 | Agentes inteligentes, análises |
| Claude Opus 4.6 | $15.00 | $75.00 | Tarefas complexas, raramente |

**Estimativa de custo por agente/mês:**
- Agente WhatsApp simples (1.000 conversas/mês, 500 tokens/conversa): ~$0.50-$2/mês (Haiku)
- Agente WhatsApp complexo (1.000 conversas, 2.000 tokens): ~$5-$10/mês (Sonnet)
- Agente de análise de dados (100 análises/mês, 5.000 tokens): ~$5-$15/mês (Sonnet)

### OpenAI (alternativa)
| Modelo | Input | Output |
|--------|-------|--------|
| GPT-4o mini | $0.15/1M | $0.60/1M |
| GPT-4o | $2.50/1M | $10.00/1M |

---

## 📱 WHATSAPP / MESSAGING APIs

### Z-API (Brasil — mais usado)
| Plano | Custo/mês | Instâncias | Mensagens |
|-------|-----------|-----------|----------|
| Basic | R$99 | 1 | Ilimitadas |
| Plus | R$199 | 3 | Ilimitadas |
| Business | R$499 | 10 | Ilimitadas |
| Enterprise | R$999 | Ilimitadas | Ilimitadas |

### Twilio (WhatsApp Business API oficial)
- Taxa de mensagem: $0.005-$0.015/mensagem (varia por país)
- Número dedicado: ~$1/mês
- Para 1.000 msgs/dia: ~$150-$450/mês
- ⚠️ Mais caro mas mais estável e escalável

### Evolution API (open source, self-hosted)
- Custo: $0 (apenas infra do VPS)
- Precisa de VPS para hospedar: +$10-20/mês

---

## 💳 GATEWAYS DE PAGAMENTO

| Gateway | Taxa por transação | Mensalidade | Melhor para |
|---------|------------------|-------------|------------|
| Stripe | 2.9% + $0.30 (int.) | $0 | Internacional |
| Asaas | 2.49% (boleto/pix) | R$0 | Brasil |
| PagSeguro | 2.99% (cartão) | R$0 | Brasil |
| Mercado Pago | 3.49% (crédito) | R$0 | Brasil, volume |

---

## ⏱️ CUSTO DE TEMPO / DESENVOLVIMENTO

### Estimativas de horas por tipo de projeto
| Projeto | Horas estimadas | Range |
|---------|----------------|-------|
| Landing page simples | 8-16h | Básico |
| Site completo (5-10 páginas) | 24-60h | Médio |
| Dashboard simples | 16-32h | Básico |
| Dashboard complexo (múltiplas fontes) | 40-80h | Médio-Alto |
| Agente IA simples (WhatsApp) | 8-20h | Básico |
| Agente IA complexo (multi-turno, CRM) | 30-60h | Médio |
| CRM customizado | 40-120h | Médio-Alto |
| Automação de workflow | 8-24h | Básico |
| Checkout + gateway | 12-24h | Básico-Médio |
| Hub completo (tudo integrado) | 120-240h | Alto |

### Custo hora de referência
# ⚠️ Breno deve preencher seu valor hora real
valor_hora_breno: "A definir por Breno"
valor_hora_mercado_referencia: "R$150-R$400/hora (dev IA/full-stack sênior no Brasil, 2025)"

---

## 📊 CUSTOS MENSAIS RECORRENTES (MRR — Referência de mercado)

| Solução | MRR mínimo mercado | MRR médio mercado | MRR premium |
|---------|------------------|-----------------|------------|
| Landing page (manutenção) | R$300 | R$600 | R$1.200 |
| Site completo | R$500 | R$1.000 | R$2.500 |
| Dashboard BI | R$800 | R$1.500 | R$4.000 |
| Agente IA simples | R$600 | R$1.200 | R$3.000 |
| Agente IA complexo | R$1.500 | R$3.000 | R$8.000 |
| CRM customizado | R$1.000 | R$2.500 | R$6.000 |
| Hub completo | R$3.000 | R$7.000 | R$20.000 |

---

## 🔢 FÓRMULA DE CUSTO REAL DO PROJETO

```
CUSTO TOTAL = Infra Mensal + Custo APIs (volume estimado) + Custo Tempo (implementação)

MARGEM = Preço cobrado - Custo Total
MARGEM % = (Margem / Preço cobrado) × 100

META MÍNIMA DE MARGEM: 60%+ na implementação, 70%+ no MRR recorrente

CÁLCULO MRR REAL:
  Custo operacional mensal = Supabase + VPS + APIs + % tempo manutenção
  MRR ideal = Custo operacional × 3 a 5x (margem saudável de 67-80%)
```

---

## 📈 EXEMPLO DE CÁLCULO — Hub de Aquisição de Clientes

**Projeto:** Site + Agente WhatsApp + CRM para média empresa

**Custos de infraestrutura (mensal em escala):**
| Item | Custo/mês |
|------|----------|
| Supabase Pro | $25 (~R$130) |
| Vercel Pro | $20 (~R$105) |
| VPS agente (Railway 2GB) | $20 (~R$105) |
| Z-API Basic | R$99 |
| Claude API (1.000 conversas × 1.500 tokens médios, Haiku) | ~R$15 |
| **Total infraestrutura** | **~R$450/mês** |

**Tempo de implementação estimado:**
| Componente | Horas |
|-----------|-------|
| Site | 30h |
| Agente WhatsApp | 25h |
| CRM básico | 40h |
| Integração e testes | 20h |
| **Total** | **115h** |

**Preço de mercado sugerido:**
- Implementação: R$20.000-R$40.000 (depende do valor hora e complexidade)
- MRR: R$1.500-R$3.000/mês (cobrindo R$450 infra + 10-20h manutenção/mês)
