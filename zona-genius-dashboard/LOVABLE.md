# 🎨 Lovable Development Guide

Projeto pronto para desenvolvimento visual com **Lovable**!

## ✅ Status Atual

### Backend (Completo)
- ✅ Supabase PostgreSQL schema (8 tabelas com RLS)
- ✅ TypeScript types (`types/assessment.ts`)
- ✅ Supabase client setup (`lib/supabase.ts`)
- ✅ API helpers (`lib/api.ts`)
- ✅ Assessment API endpoint (`app/api/assessment/route.ts`)
- ✅ Tailwind CSS configurado
- ✅ .env.local com credenciais

### Frontend (Scaffold Pronto)
- ✅ Next.js 14 app/ structure
- ✅ Home page (`app/page.tsx`)
- ✅ Layout base (`app/layout.tsx`)
- ✅ Globals CSS com estilos base
- ✅ Section1 component (exemplo)
- ✅ ProgressBar component

### Estrutura de Diretórios
```
zona-genius-dashboard/
├── app/
│   ├── auth/                  # Auth pages (login, register)
│   ├── dashboard/             # User dashboard
│   │   ├── assessment/        # Assessment form (5 sections)
│   │   ├── results/           # Results display
│   │   └── profile/           # User profile
│   ├── api/
│   │   ├── assessment/        # Assessment CRUD
│   │   └── auth/              # Auth endpoints
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Tailwind + custom styles
├── components/
│   ├── assessment/            # Assessment form sections (Section1-5)
│   ├── results/               # Results components (Profile, Blueprint, etc)
│   └── shared/                # Reusable components (ProgressBar, etc)
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── api.ts                 # API call helpers
├── types/
│   └── assessment.ts          # TypeScript types
├── public/                    # Static assets
├── .env.local                 # Supabase credentials
├── next.config.js             # Next.js config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

---

## 🚀 Como Usar Lovable

### 1. Setup
1. Acesse https://lovable.dev
2. Conecte seu GitHub
3. Selecione `zona-genius-dashboard` projeto

### 2. Desenvolvimento Visual

**Você vai criar (Lovable vai gerar React code):**

#### Assessment Form (5 seções)
- Section 1: Context (✅ exemplo já existe)
- Section 2: Activities
- Section 3: Talents
- Section 4: Business
- Section 5: Vision

**Cada seção tem:**
- Form inputs com validação
- Progress tracking
- Save/continue functionality

#### Results Pages
- **Genius Profile**: Display dos 7 frameworks
- **Squad Recommendations**: Top 3 squads + dream squad
- **Genius Zone Blueprint**: Plano de ação 90 dias

#### Auth Pages
- Login (email + password)
- Register (company setup)
- Password recovery

### 3. Lovable → GitHub Workflow

```
1. Abra componente no Lovable
2. Faça mudanças visuais
3. Lovable gera React code
4. Auto-commit para GitHub (`feature/lovable-xyz`)
5. Você faz PR review
6. Merge para main
7. Vercel auto-deploy
```

### 4. Componentes Prontos para Estender

**Section1.tsx (exemplo completo)**
- Form fields com validação
- Error handling
- Next button com validation
- Tailwind styles aplicados

**Use como template para:**
- Section2.tsx (Activities)
- Section3.tsx (Talents)
- Section4.tsx (Business)
- Section5.tsx (Vision)

---

## 🎨 Design System (Rio Mais PlayBooks)

### Cores
```css
--color-primary: #FF6B00      /* Orange - Main */
--color-primary-dark: #E55A00
--color-secondary: #1e293b    /* Dark slate */
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
```

### CSS Classes (Tailwind)
```css
.assessment-section   /* Main form container */
.form-group          /* Input group wrapper */
.form-label          /* Label styling */
.form-input          /* Text input styling */
.form-textarea       /* Textarea styling */
.form-select         /* Select dropdown styling */
.btn-primary         /* Primary button */
.btn-secondary       /* Secondary button */
.progress-bar        /* Progress bar container */
.progress-bar-fill   /* Progress bar fill */
```

---

## 📊 API Endpoints (Ready to Call)

### Assessment CRUD
```bash
# Create
POST /api/assessment
{ organization_id: "uuid" }

# Get
GET /api/assessment/:id

# Update
PATCH /api/assessment/:id
{ section_1_nome: "value", ... }

# List
GET /api/assessment
```

### Analysis (Phase 3)
```bash
# Generate Genius Profile
POST /api/genius-profile
{ assessment_id: "uuid" }

# Squad Recommendations
POST /api/squad-recommendations/:profile-id

# Blueprint
POST /api/genius-zone-blueprint/:recommendation-id
```

---

## 🔗 GitHub Setup

**Main workflow:**
```bash
# Start in Lovable
# Edit component → Save → Auto-commit to feature branch
# Push to GitHub → Opens PR
# You review & merge
# Vercel auto-deploys
```

**Branches:**
- `main` → Production (Vercel auto-deploys)
- `develop` → Staging
- `feature/*` → Feature branches (from Lovable)

---

## ⚡ Quick Start (Dev Mode)

```bash
cd zona-genius-dashboard

# Install (already done)
npm install

# Dev server
npm run dev
# → http://localhost:3000

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## 📋 Lovable Development Checklist

### Phase 2.1: Assessment Form
- [ ] Section1 (copy from example)
- [ ] Section2 (Activities)
- [ ] Section3 (Talents)
- [ ] Section4 (Business)
- [ ] Section5 (Vision)
- [ ] Form validation
- [ ] Save/draft functionality
- [ ] Progress tracking

### Phase 2.2: Results Pages
- [ ] Genius Profile display
- [ ] Squad Recommendations
- [ ] Genius Zone Blueprint
- [ ] PDF export option

### Phase 2.3: Auth & Dashboard
- [ ] Login page
- [ ] Register page
- [ ] User dashboard
- [ ] Assessment list
- [ ] Gestor dashboard (admin features)

### Phase 3: Backend APIs
- [ ] Complete assessment CRUD
- [ ] Genius Profile generation
- [ ] Squad Recommendations logic
- [ ] Blueprint generation

---

## 🎯 Success Metrics

✅ When complete:
- [ ] Full assessment form working
- [ ] Results display accurate
- [ ] Authentication working
- [ ] Responsive design
- [ ] Tests passing
- [ ] Deployed to Vercel

---

## 💡 Tips

1. **Use Section1.tsx as template** — Copy structure for other sections
2. **API calls use lib/api.ts** — Don't call fetch directly
3. **Tailwind classes are ready** — `btn-primary`, `form-input`, etc
4. **Types are strict** — Use `Assessment` type for form data
5. **Auto-save to Supabase** — Call `updateAssessment()` on change

---

## 🚀 Next Step

1. Open Lovable
2. Create Section2 component (copy Section1 pattern)
3. Add 12 questions for Activities
4. Commit to GitHub
5. PR → Merge → Done

**Estimated time: 2-3 hours per section in Lovable**

---

*Generated: 2026-02-23*
*Project: Zona de Genialidade Dashboard*
*Status: Ready for Visual Development*
