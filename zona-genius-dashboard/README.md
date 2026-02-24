# 🧠 Zona de Genialidade — Corporate Dashboard

Dashboard corporativo para assessments de Genius Zone. Permite que colaboradores façam uma avaliação completa baseada em 7 frameworks de desenvolvimento pessoal e profissional.

**Status:** 🚀 Em desenvolvimento (Phase 1)
**Timeline:** 4-6 semanas até MVP
**Tech Stack:** Next.js 14 + Supabase + Tailwind + Lovable

---

## 📋 O que é Zona de Genialidade?

Assessment de 43 perguntas que mapeia:

- **7 Frameworks Psicométricos:**
  - Gay Hendricks (Zone of Genius)
  - Don Clifton (CliftonStrengths)
  - Dan Sullivan (Unique Ability)
  - Roger Hamilton (Wealth Dynamics)
  - Alex Hormozi (Value Equation)
  - Kathy Kolbe (Action Modes)
  - Sally Hogshead (Fascination Advantage)

- **5 Seções do Assessment:**
  - Context (6 perguntas) — Quem você é
  - Activities (12 perguntas) — O que energiza/drena
  - Talents (10 perguntas) — Suas forças
  - Business (7 perguntas) — Seu modelo de negócio ideal
  - Vision (8 perguntas) — Seus objetivos 90 dias

- **Saídas Geradas:**
  - Genius Profile (análise multi-framework)
  - Squad Recommendations (squad ideal para você)
  - Genius Zone Blueprint (plano de ação 90 dias)

---

## 🚀 Quick Start

### 1. Setup Ambiente

```bash
# Clone o repositório
git clone https://github.com/your-org/zona-genius-dashboard.git
cd zona-genius-dashboard

# Instale dependências
npm install

# Configure .env.local
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase
```

### 2. Setup Supabase

```bash
# Acesse https://supabase.com/dashboard
# Crie um novo projeto
# Copie credenciais para .env.local:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Execute schema.sql no SQL Editor do Supabase
# Copie e cole todo o conteúdo de schema.sql
```

### 3. Inicie Dev

```bash
npm run dev
# App estará em http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
zona-genius-dashboard/
├── app/
│   ├── (auth)/                 # Páginas públicas (login, register)
│   ├── (dashboard)/            # Páginas autenticadas
│   │   ├── assessment/         # Fluxo do assessment
│   │   ├── results/            # Exibição de resultados
│   │   └── profile/            # Perfil do usuário
│   ├── api/                    # API routes
│   │   ├── assessment/         # CRUD assessment
│   │   ├── genius-profile/     # Gerar análise
│   │   └── auth/               # Autenticação
│   ├── layout.tsx              # Layout root
│   └── page.tsx                # Home
├── components/
│   ├── assessment/             # Componentes do assessment
│   ├── results/                # Componentes de resultados
│   └── shared/                 # Componentes reutilizáveis
├── lib/
│   ├── supabase.ts             # Cliente Supabase
│   ├── auth.ts                 # Helpers autenticação
│   ├── api.ts                  # Helpers API
│   └── frameworks/             # Lógica dos 7 frameworks
├── types/
│   ├── assessment.ts           # Types do assessment
│   └── profiles.ts             # Types dos profiles
├── styles/
│   └── globals.css             # Estilos globais
├── public/
│   └── assets/                 # Imagens, logos
├── .env.example                # Template de variáveis
├── schema.sql                  # Schema Supabase
├── 43-questions-mapping.md     # Mapeamento perguntas
├── package.json                # Dependências
└── README.md                   # Este arquivo
```

---

## 🔐 Autenticação & Segurança

### Roles Disponíveis

- **Colaborador:** Faz seu próprio assessment, vê seus resultados
- **Gestor:** Vê assessments de seus colaboradores, analytics
- **Admin:** Acesso total, gerencia organização

### RLS Policies

Todas as tabelas usam Row-Level Security (RLS):

```sql
-- Colaborador vê só seus dados
-- Gestor vê dados de colaboradores
-- Admin vê tudo na organização
```

---

## 📊 API Endpoints

### Assessment

```
POST   /api/assessment              # Criar novo assessment
GET    /api/assessment/:id          # Obter assessment
PATCH  /api/assessment/:id          # Atualizar assessment
GET    /api/assessment              # Listar meus assessments
```

### Genius Profile

```
POST   /api/genius-profile/:assessment-id    # Gerar análise
GET    /api/genius-profile/:id               # Obter profile
```

### Squad Recommendations

```
POST   /api/squad-recommendations/:profile-id   # Gerar recomendações
GET    /api/squad-recommendations/:id           # Obter recomendações
```

### Genius Zone Blueprint

```
POST   /api/genius-zone-blueprint/:recommendation-id  # Gerar blueprint
GET    /api/genius-zone-blueprint/:id                 # Obter blueprint
```

---

## 🎯 Roadmap (4-6 semanas)

### Week 1-2: Scaffolding
- [x] Schema SQL + RLS
- [ ] Auth (Supabase Magic Link)
- [ ] API routes básicas
- [ ] Assessment form (5 sections)

### Week 3: Core Assessment
- [ ] UI do assessment com validação
- [ ] Save/draft functionality
- [ ] Progress tracking

### Week 4: Analysis & Results
- [ ] Gerar Genius Profile (7 frameworks)
- [ ] Squad Recommendations
- [ ] Genius Zone Blueprint PDF

### Week 5: Gestor Dashboard
- [ ] Ver assessments de colaboradores
- [ ] Analytics & trends
- [ ] Export relatórios

### Week 6: Polish & Deploy
- [ ] Testes
- [ ] Otimizações
- [ ] Deploy Vercel
- [ ] Documentação

---

## 🛠️ Desenvolvimento com Lovable

O desenvolvimento frontend é feito em **Lovable** (UI builder):

1. Abra [Lovable](https://lovable.dev)
2. Conecte ao GitHub deste repositório
3. Crie/edite componentes visualmente
4. Lovable gera React code automaticamente
5. Commits são feitos direto no GitHub
6. CI/CD pega as mudanças automaticamente

---

## 📝 Commits & Git Workflow

```bash
# Branch principal
main          # Produção

# Branches de desenvolvimento
develop       # Staging
feature/xyz   # Features

# Workflow
1. Crie branch: git checkout -b feature/assessment-form
2. Faça changes no Lovable
3. Commits automáticos pelo Lovable
4. Crie PR para develop
5. Merge para main (depois de QA)
6. Deploy automático para Vercel
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## 📚 Documentação Adicional

- [43-questions-mapping.md](./43-questions-mapping.md) — Mapeamento completo das perguntas
- [schema.sql](./schema.sql) — Schema Supabase com RLS
- [.env.example](./.env.example) — Variáveis de ambiente

---

## 🤝 Contribuindo

```bash
# 1. Clone o repo
git clone https://github.com/your-org/zona-genius-dashboard.git

# 2. Crie branch
git checkout -b feature/sua-feature

# 3. Faça mudanças (Lovable ou direto no code)
# 4. Commit
git commit -m "feat: descrição da feature"

# 5. Push
git push origin feature/sua-feature

# 6. Abra PR no GitHub
```

---

## 📞 Suporte

- **Documentação:** [docs/](./docs)
- **Issues:** GitHub Issues
- **Slack:** #zona-genialidade

---

## 📄 License

MIT

---

**Status da Semana:** Phase 1 iniciado - Schema criado, templates prontos, Lovable integration aguardando.

**Próximo passo:** Iniciar UI development em Lovable com Assessment Form (Section 1).
