# Tech Stack Reference — Sirius Strategy
# Ferramentas utilizadas nos serviços entregues pela Sirius
# Usar este arquivo para mapear ferramentas por plano em cada proposta

---

## 🤖 AUTOMAÇÃO & WORKFLOWS

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **n8n** | ⚙️ | Orquestrador de automações e workflows visuais | Toda automação de fluxo de dados, integrações entre sistemas |
| **Make (Integromat)** | 🔄 | Automações visuais no-code | Alternativa ao n8n para clientes sem servidor |
| **Zapier** | ⚡ | Automações simples entre apps populares | Integrações rápidas sem servidor próprio |

---

## 🧠 INTELIGÊNCIA ARTIFICIAL

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **Claude API** (Anthropic) | 🔵 | LLM para agentes conversacionais, análise, geração de texto | Agentes de atendimento, qualificação de leads, SDR |
| **Gemini API** (Google) | ♊ | LLM + geração de imagens, multimodal | Quando precisar de imagens, integração Google, custo menor |
| **OpenAI API** (ChatGPT) | 🟢 | LLM generalista | Casos específicos, embeddings, whisper (áudio) |
| **Whisper** | 🎙️ | Transcrição de áudio para texto | Quando cliente envia áudios no WhatsApp |

---

## 💬 COMUNICAÇÃO & CANAIS

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **Evolution API** | 📱 | WhatsApp API self-hosted (gratuito) | Agentes WhatsApp, qualquer projeto com WhatsApp |
| **Z-API** | 📲 | WhatsApp API cloud (pago, mais estável) | Quando cliente precisa de SLA garantido |
| **Twilio** | 📡 | SMS, WhatsApp, Voice (API oficial) | Projetos enterprise, SMS, integração oficial Meta |
| **Instagram API** | 📸 | Direct Messages do Instagram | Projetos com atendimento via Instagram inbox |
| **Email (SMTP/Resend)** | 📧 | Disparos de email transacional | Follow-ups, confirmações, notificações |

---

## 🗄️ BANCO DE DADOS & BACKEND

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **Supabase** | 🟩 | BaaS: PostgreSQL + Auth + Realtime + Storage | Painéis internos, CRM, dashboards, qualquer DB |
| **PostgreSQL** | 🐘 | Banco relacional robusto | Base do Supabase, projetos com queries complexas |
| **MySQL** | 🐬 | Banco relacional clássico | Quando cliente já tem MySQL, sistemas legados |
| **MongoDB** | 🍃 | Banco NoSQL orientado a documentos | Dados não estruturados, logs, eventos |
| **Redis** | 🔴 | Cache em memória, filas, sessões | Rate limiting, cache de respostas, filas de jobs |
| **Firebase** | 🔥 | BaaS Google: Realtime DB + Auth | Apps mobile, projetos Google ecosystem |

---

## 🖥️ FRONTEND & SITES

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **Next.js** | ▲ | Framework React com SSR/SSG | Sites, apps web, dashboards |
| **React** | ⚛️ | Biblioteca de UI | Qualquer interface dinâmica |
| **Tailwind CSS** | 💨 | Estilização utilitária | Design rápido e consistente |
| **Vercel** | 🔺 | Deploy e hosting de Next.js | Todo site/app Next.js |
| **Lovable** | 💜 | Gerador de sites com IA | Sites simples gerados rapidamente |
| **Framer** | 🎨 | Sites com animações avançadas | Landing pages premium |

---

## ☁️ INFRAESTRUTURA & DEPLOY

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **VPS (Hetzner/DigitalOcean)** | 🖥️ | Servidor virtual privado | n8n, Evolution API, serviços self-hosted |
| **Docker** | 🐳 | Containerização de serviços | Isolar e orquestrar serviços no VPS |
| **Nginx** | 🌐 | Proxy reverso, SSL | Roteamento de domínios no VPS |
| **Cloudflare** | ☁️ | DNS, CDN, proteção DDoS | Todo projeto com domínio próprio |

---

## 📊 ANALYTICS & MONITORAMENTO

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **Google Analytics** | 📈 | Análise de tráfego web | Todo site entregue |
| **Metabase** | 📊 | Dashboards de BI self-hosted | BI para clientes, relatórios gerenciais |
| **Sentry** | 🚨 | Monitoramento de erros | Projetos com criticidade alta |

---

## 💳 PAGAMENTOS

| Ferramenta | Ícone | Função | Quando usar |
|-----------|-------|--------|------------|
| **Stripe** | 💳 | Checkout internacional | Projetos com pagamento online |
| **Asaas** | 🟡 | PIX, boleto, cartão — Brasil | Projetos nacionais com cobrança recorrente |
| **PagSeguro** | 🟠 | Gateway brasileiro completo | Alternativa ao Asaas |

---

## 🗺️ MAPEAMENTO POR TIPO DE SERVIÇO

### Agente SDR WhatsApp (simples)
```
Evolution API → n8n → Claude API → Supabase → VPS
```
Ferramentas: Evolution API, n8n, Claude API, Supabase, VPS (Hetzner)

### Agente SDR WhatsApp (com transcrição de áudio)
```
Evolution API → Whisper (OpenAI) → n8n → Claude API → Supabase → VPS
```
Ferramentas: Evolution API, Whisper, n8n, Claude API, Supabase, VPS

### Site Institucional
```
Next.js → Vercel → Supabase → Cloudflare → Google Analytics
```
Ferramentas: Next.js, Vercel, Supabase, Cloudflare, Google Analytics

### Painel Interno / CRM
```
Next.js → Supabase (PostgreSQL + Auth + Realtime) → Vercel
```
Ferramentas: Next.js, Supabase, Vercel, React, Tailwind CSS

### Hub Completo (Agente + Site + Painel)
```
Evolution API → n8n → Claude API → Supabase
Next.js → Vercel → Supabase → Google Analytics
n8n → Supabase → Next.js (painel)
```
Ferramentas: Evolution API, n8n, Claude API, Supabase, Next.js, Vercel, VPS, Cloudflare

### Automação com IA de Imagens
```
n8n → Gemini API (imagem) → Supabase → armazenamento
```
Ferramentas: n8n, Gemini API, Supabase

---

## 📋 INSTRUÇÃO PARA O SQUAD

Ao montar a proposta:
1. Consultar o mapeamento acima para identificar as ferramentas de cada plano
2. Listar as ferramentas no campo `stack_por_plano` da estratégia
3. No slide de Stack Tecnológico, mostrar: **ícone + nome + função de 1 linha**
4. Nos slides de detalhe de cada plano, adicionar badges no rodapé
5. Não inventar ferramentas — usar apenas as listadas aqui ou adicionar novas com justificativa
6. Se o cliente já usa uma ferramenta (ex: já tem MySQL), mencionar isso como vantagem: "Integramos com seu MySQL existente"

---

*Última atualização: Março 2026*
*Adicionar novas ferramentas conforme forem adotadas nos projetos*
