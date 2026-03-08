# PRD — Sirius Strategy Hub

**Versão:** 1.0
**Data:** 2026-03-06
**Status:** Draft
**Owner:** Breno Nobre
**Stack:** Next.js 14 + Supabase + Vercel (PWA)

---

## 1. Visão Geral

### 1.1 Elevator Pitch

O **Sirius Strategy Hub** é o sistema operacional profissional de Breno Nobre — um painel central (PWA) onde toda a vida profissional é monitorada, organizada e analisada em tempo real. Projetos, estudos, reuniões, certificados, ideias e performance: tudo em um único lugar, com o visual futurista e clean da marca Sirius.

### 1.2 Problema que resolve

| Dor Atual | Como o Hub resolve |
|-----------|-------------------|
| Projetos espalhados em diferentes lugares | Central única por empresa e projeto |
| Reuniões esquecidas ou sem registro | Módulo de reuniões com agenda e action items |
| Estudos sem acompanhamento de evolução | Trilha visual de progresso por plataforma |
| Certificados difíceis de rastrear | Galeria + gerador de PDF personalizado |
| Sem visão de performance dos projetos | Dashboards analíticos com métricas |
| Ideias perdidas | Banco de ideias organizado por categoria |

### 1.3 Usuário

- **Único usuário:** Breno Nobre (sistema pessoal/profissional)
- **Dispositivos:** Desktop (uso principal) + Mobile (consulta rápida via PWA)

---

## 2. Objetivos

### 2.1 Objetivos de Negócio

- OB1: Centralizar 100% da vida profissional em um único sistema
- OB2: Permitir análise de performance de todos os projetos
- OB3: Gamificar e visualizar evolução nos estudos
- OB4: Gerar certificados profissionais para qualquer tipo de aprendizado
- OB5: Conectar projetos externos via links/embeds

### 2.2 Métricas de Sucesso

- Tempo de consulta de informação: < 30 segundos para qualquer dado
- Cobertura: 100% dos projetos ativos cadastrados
- Uso mobile: acessar sistema pelo celular sem fricção
- Satisfação pessoal: sistema "preferido" versus planilhas e notas dispersas

---

## 3. Módulos do Sistema

### M1 — Dashboard Central (Home)

Visão 360° de tudo que está acontecendo.

**Elementos:**
- Cards de resumo: projetos ativos, reuniões hoje, horas de estudo na semana
- Gráfico de atividade semanal (tipo GitHub contributions)
- Projetos em destaque com métricas principais
- Próximas reuniões (próximas 48h)
- Notificações e lembretes

**Requisitos funcionais:**
- RF-01: Exibir resumo de todos os módulos na home
- RF-02: Widgets personalizáveis por drag-and-drop
- RF-03: Indicadores de saúde geral (projetos em risco, estudos atrasados)

---

### M2 — Projetos

Gestão de todos os projetos divididos por empresa.

**Elementos:**
- Lista de empresas (Sirius Strategy, Plano Mais, etc.)
- Dentro de cada empresa: cards de projetos com status
- Página detalhada do projeto com: descrição, status, timeline, links, métricas
- Campo para embed de dashboard externo (iframe ou link)
- Histórico de atualizações do projeto

**Status de projeto:**
- Planejamento | Em andamento | Em revisão | Pausado | Concluido | Arquivado

**Requisitos funcionais:**
- RF-04: CRUD de empresas
- RF-05: CRUD de projetos vinculados a empresas
- RF-06: Campo de URL para embed de dashboard externo
- RF-07: Histórico de atualizações com timestamp
- RF-08: Comparativo de performance entre projetos
- RF-09: Filtros por empresa, status, data, performance

---

### M3 — Estudos

Acompanhamento completo da jornada de aprendizado.

**Elementos:**
- Trilhas de estudo por plataforma (YouTube, Udemy, Coursera, etc.)
- Card por curso/aula com: título, plataforma, progresso %, link, status
- Barra de progresso visual por trilha
- Metas semanais de estudo (horas)
- Gráfico de evolução ao longo do tempo
- Área de "próximos estudos" (fila de aprendizado)

**Status de conteúdo:**
- A fazer | Em andamento | Concluido

**Requisitos funcionais:**
- RF-10: CRUD de cursos e aulas (título, plataforma, link, horas estimadas)
- RF-11: Marcação de progresso por aula/módulo
- RF-12: Dashboard de evolução com gráficos
- RF-13: Meta semanal de horas com indicador de progresso
- RF-14: Integração via link com plataformas externas (YouTube, Udemy, etc.)
- RF-15: Linha do tempo de aprendizado

---

### M4 — Certificados

Galeria de certificados recebidos + gerador de PDF personalizado.

**Elementos:**
- Galeria de certificados (upload de arquivo ou gerado pelo sistema)
- Gerador de certificado em PDF com campos variáveis:
  - Nome do aluno
  - Nome do curso/aula
  - Data de conclusão
  - Carga horária
  - Plataforma/instituição
  - Assinatura digital (imagem)
- Exportar PDF com branding Sirius
- Filtros por área de conhecimento, data, tipo

**Requisitos funcionais:**
- RF-16: Upload de certificados externos (PDF, imagem)
- RF-17: Gerador de certificado PDF com template Sirius
- RF-18: Variáveis editáveis antes de gerar o PDF
- RF-19: Galeria com busca e filtros
- RF-20: Link de compartilhamento do certificado (URL pública opcional)
- RF-21: Vinculação automática com curso concluído no M3

---

### M5 — Reunioes

Registro e organização de todas as reuniões.

**Elementos:**
- Calendário de reuniões
- Formulário de nova reunião: título, data, hora, participantes, pauta
- Durante/após reunião: campo de anotações e action items
- Lista de pendências geradas em reuniões
- Histórico de reuniões por projeto ou empresa

**Requisitos funcionais:**
- RF-22: CRUD de reuniões com data, hora, participantes e pauta
- RF-23: Campo de anotações livres durante a reunião
- RF-24: Action items com responsável e data limite
- RF-25: Vinculação de reunião a projeto específico
- RF-26: Histórico filtrado por empresa/projeto
- RF-27: Notificação de reuniões próximas

---

### M6 — Performance

Análise comparativa de todos os projetos e atividades.

**Elementos:**
- Comparativo de projetos (gráfico lado a lado)
- Ranking de projetos por resultado/impacto
- Métricas customizáveis por projeto (definidas pelo usuário)
- Histórico de métricas ao longo do tempo
- Exportação de relatório em PDF

**Métricas padrão (customizáveis):**
- Status geral (1-10)
- Tempo investido (horas)
- Resultado gerado (qualitativo ou quantitativo)
- Próximos passos definidos (sim/não)

**Requisitos funcionais:**
- RF-28: Definir métricas por projeto
- RF-29: Registrar valores de métricas periodicamente
- RF-30: Dashboard comparativo com gráficos
- RF-31: Ranking automático por score
- RF-32: Exportar relatório de performance em PDF

---

### M7 — Ideias

Banco de ideias futuras organizadas e priorizadas.

**Elementos:**
- Cards de ideias com: título, descrição, categoria, prioridade, status
- Filtros por categoria e prioridade
- Campo de refinamento progressivo da ideia
- Conversão de ideia em projeto (com um clique)

**Status de ideia:**
- Rascunho | Refinando | Pronta para executar | Arquivada | Convertida em projeto

**Requisitos funcionais:**
- RF-33: CRUD de ideias
- RF-34: Categorização e priorização
- RF-35: Histórico de refinamentos
- RF-36: Converter ideia em projeto no M2 com um clique

---

## 4. Requisitos Nao Funcionais

### 4.1 Autenticacao e Seguranca

- NFR-01: Login com email/senha via Supabase Auth
- NFR-02: Sessao persistente (lembrar login)
- NFR-03: Todas as rotas protegidas por autenticacao
- NFR-04: Dados armazenados no banco Supabase (PostgreSQL)
- NFR-05: RLS (Row Level Security) no Supabase para isolamento de dados

### 4.2 Performance

- NFR-06: Primeira tela carrega em menos de 2 segundos
- NFR-07: Navegacao entre modulos instantanea (SPA)
- NFR-08: Otimizado para mobile (responsivo 100%)

### 4.3 PWA

- NFR-09: Instalavel na tela inicial do celular
- NFR-10: Funciona offline para consulta (cache de dados recentes)
- NFR-11: Icone personalizado com logo Sirius

### 4.4 Design

- NFR-12: Branding Sirius (cores, tipografia, estilo)
- NFR-13: Visual moderno, clean e futurista
- NFR-14: Sem emojis nativos — usar icones SVG (Lucide)
- NFR-15: Modo escuro como padrao
- NFR-16: Animacoes suaves e profissionais

---

## 5. Arquitetura Tecnica

### 5.1 Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|--------------|
| Framework | Next.js 14 (App Router) | SSR, PWA nativo, otimo para SEO e performance |
| Estilo | Tailwind CSS + shadcn/ui | Rapido, consistente, customizavel |
| Banco de Dados | Supabase (PostgreSQL) | Ja configurado no projeto, auth incluso |
| Autenticacao | Supabase Auth | Integrado ao banco, facil de configurar |
| PDF | @react-pdf/renderer | Geracao de PDF no browser ou server |
| Graficos | Recharts | Graficos declarativos para React |
| Icones | Lucide React | SVG limpo, sem emoji |
| Hospedagem | Vercel | Deploy automatico, CDN global, gratis |
| PWA | next-pwa | Plugin oficial para Next.js |

### 5.2 Estrutura de Pastas (Next.js)

```
sirius-strategy-hub/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx              # Home / Dashboard Central
│   │   ├── projetos/
│   │   ├── estudos/
│   │   ├── certificados/
│   │   ├── reunioes/
│   │   ├── performance/
│   │   ├── ideias/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── certificados/
│   │   └── performance/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/
│   ├── projetos/
│   ├── estudos/
│   ├── certificados/
│   ├── reunioes/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── pdf/
│   └── utils/
├── public/
│   ├── icons/                    # PWA icons
│   └── manifest.json
└── types/
```

### 5.3 Schema do Banco (Supabase)

**Tabelas principais:**

```sql
-- Empresas
companies (id, name, description, logo_url, color, created_at)

-- Projetos
projects (id, company_id, name, description, status, dashboard_url,
          start_date, end_date, created_at, updated_at)

-- Atualizacoes de Projeto
project_updates (id, project_id, content, created_at)

-- Metricas de Projeto
project_metrics (id, project_id, metric_name, metric_value, recorded_at)

-- Cursos/Estudos
courses (id, title, platform, url, estimated_hours, status,
         progress_percent, started_at, completed_at)

-- Certificados
certificates (id, course_id, title, institution, completed_date,
              hours, file_url, is_generated, created_at)

-- Reunioes
meetings (id, project_id, title, date, time, participants,
          agenda, notes, created_at)

-- Action Items de Reuniao
meeting_actions (id, meeting_id, description, responsible, due_date,
                 completed, created_at)

-- Ideias
ideas (id, title, description, category, priority, status, created_at, updated_at)

-- Refinamentos de Ideia
idea_refinements (id, idea_id, content, created_at)
```

---

## 6. Epicos de Desenvolvimento

| Epic | Titulo | Prioridade |
|------|--------|-----------|
| E1 | Setup do Projeto (Next.js + Supabase + PWA + Auth) | Alta |
| E2 | Dashboard Central (Home) | Alta |
| E3 | Modulo de Projetos + Empresas | Alta |
| E4 | Modulo de Estudos | Media |
| E5 | Modulo de Certificados + Gerador PDF | Media |
| E6 | Modulo de Reunioes | Media |
| E7 | Modulo de Performance + Analytics | Media |
| E8 | Modulo de Ideias | Baixa |
| E9 | PWA + Mobile Optimization | Alta |
| E10 | Design System Sirius + Polimento Final | Alta |

---

## 7. Fora do Escopo (v1)

- Integracoes automaticas com plataformas externas (Udemy API, etc.)
- Notificacoes push no mobile
- Colaboracao multi-usuario
- App nativo iOS/Android
- IA integrada para sugestoes

---

## 8. Proximos Passos

1. Aprovacao deste PRD
2. Criar Epic E1 (Setup) e Story 1.1
3. Iniciar desenvolvimento pelo E1
4. Demo do MVP apos E1 + E2 + E3

---

*Documento gerado por Orion (AIOS Master) — 2026-03-06*
