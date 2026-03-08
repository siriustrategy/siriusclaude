# 🚀 Guia de Integração Lovable - Zona de Genialidade

## Status Atual

✅ **Código criado e commitado localmente**
- API de geração de perfil: `/app/api/genius-profile/route.ts`
- Página de resultados: `/app/dashboard/results/[id]/page.tsx`
- Dashboard melhorado: `/app/dashboard/page.tsx`
- Commit: `e66b2e2` (feat: implement genius profile generation and results dashboard)

❌ **Aguardando**: Push para GitHub (problema de autenticação temporário)

---

## 📋 O que foi implementado

### 1. **API de Geração de Perfil** (`/app/api/genius-profile/route.ts`)
- ✅ Gera perfil de genialidade a partir das respostas do assessment
- ✅ Análise simples baseada em 7 frameworks
- ✅ Salva resultado no banco de dados (tabela `genius_profiles`)
- ✅ Endpoints: `POST /api/genius-profile` (gerar) e `GET /api/genius-profile?assessmentId=xxx` (recuperar)

**Dados Gerados:**
```javascript
{
  user_name: string,
  email: string,
  primary_strength: string,      // Ex: "Talentos Naturais"
  secondary_strengths: string[],  // Ex: ["Empreendedor", "Inovação Tecnológica"]
  wealth_dynamic: string,         // Ex: "CRIADOR"
  risk_tolerance: string,         // Ex: "Equilibrado"
  ai_proficiency: string,         // Ex: "Intermediário"
  main_blocker: string,
  revenue_goal: string,
  available_time: string,
  narrative: string,              // Texto personalizado sobre o usuário
  blueprint: {                    // Plano de ação 90 dias
    objective: string,
    blockers_to_address: string[],
    daily_practices: string[],
    weekly_milestones: string[],
    resources_needed: string[],
    success_metrics: string[]
  },
  squad_recommendations: [        // Pessoas ideais para trabalhar
    { role, description, why }
  ],
  frameworks_analysis: {          // Análise dos 7 frameworks
    gay_hendricks: { framework, insight, recommendation },
    don_clifton: { ... },
    dan_sullivan: { ... },
    roger_hamilton: { ... },
    alex_hormozi: { ... },
    kathy_kolbe: { ... },
    sally_hogshead: { ... }
  }
}
```

### 2. **Página de Resultados** (`/app/dashboard/results/[id]/page.tsx`)

**4 Abas com conteúdo completo:**

1. **📊 Visão Geral**
   - Força principal + forças complementares (cards coloridos)
   - Tolerância a risco
   - Tempo disponível
   - Principal bloqueio (card vermelho com atenção)
   - Meta de receita (card verde)

2. **🎯 Blueprint 90 Dias**
   - Objetivo primário (em destaque azul)
   - Marcos semanais (numerados 1-4)
   - Práticas diárias (checklist com ✓)
   - Métricas de sucesso
   - Recursos necessários

3. **👥 Squad Ideal**
   - 3 pessoas recomendadas
   - Cada uma com role, descrição e motivo
   - Cards coloridos e organizados

4. **📚 Análise de Frameworks**
   - Grid com 7 frameworks
   - Para cada: Insight + Recomendação
   - Texto destacado em boxes azuis

**Funcionalidades:**
- ✅ Carregamento automático de dados
- ✅ Geração automática se não existir perfil
- ✅ Role-based access (Colaborador vê só seu, Gestor vê todos)
- ✅ Botão "🖨️ Imprimir" (usa print do navegador)
- ✅ Botão "📥 Baixar PDF" (HTML-to-PDF built-in)
- ✅ Design responsivo com cores Rio Mais (#2855FF)

### 3. **Dashboard Melhorado** (`/app/dashboard/page.tsx`)

**Para Colaborador:**
- Lista de seus assessments
- Status: Completo ✅ | Em Progresso ⏳ | Rascunho 📝
- Barra de progresso visual
- Ação rápida: "Ver Resultado" ou "Continuar"
- Botão "+ Novo Assessment"

**Para Gestor:**
- Vê TODOS os assessments da equipe
- Mesma interface + badge "👤 Você é GESTOR"
- Gerenciamento centralizado

**Layout:**
```
┌─ Header com boas-vindas
├─ CTA azul "Comece seu Assessment" + botão "+ Novo"
├─ Tabela com assessments
│  ├─ Usuário
│  ├─ Status (badge colorida)
│  ├─ Progresso (barra visual)
│  ├─ Data
│  └─ Ação (Link/Botão)
└─ Info box "Como Funciona?"
```

---

## 🔄 Como Sincronizar com Lovable

### Opção 1: **Push GitHub + Lovable Pull** (Recomendado)

1. **Fazer Push para GitHub:**
   ```bash
   # Na pasta do projeto
   git push origin main
   ```
   (Se houver erro de autenticação, use GitHub CLI: `gh auth login`)

2. **No Lovable, sincronizar do GitHub:**
   - Abra https://zonadegenialidademais.lovable.app
   - Vá para Settings → GitHub Integration
   - Clique "Sync from GitHub" ou "Pull Latest"
   - Lovable vai baixar os arquivos mais recentes
   - Refresh a página para ver as mudanças

### Opção 2: **Copiar Arquivos Manualmente para Lovable**

Se o GitHub não funcionar:

1. **Copie os 3 arquivos principais:**
   - `/zona-genius-dashboard/app/api/genius-profile/route.ts`
   - `/zona-genius-dashboard/app/dashboard/results/[id]/page.tsx`
   - `/zona-genius-dashboard/app/dashboard/page.tsx`

2. **No Lovable:**
   - Navegue até a pasta correspondente em Files
   - Delete os arquivos antigos (se existentes)
   - Crie novos arquivos com o conteúdo copiado
   - Salve

3. **Teste:**
   - Vá para `/dashboard`
   - Crie um novo assessment
   - Complete e veja o resultado gerado automaticamente

---

## 🧪 Como Testar

### 1. **Teste Local (Antes do Push)**

```bash
cd /Users/bn/siriusclaude/zona-genius-dashboard

# Install dependencies (se não tiver)
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### 2. **Login com suas credenciais**
```
Email: gestor@teste.com
Senha: Teste1234!
```

### 3. **Fluxo Completo**
1. Dashboard → "+ Novo Assessment"
2. Preencha as 5 seções (ou quickfill com dados fake)
3. Clique "Enviar e Ver Resultados"
4. Página de resultados carrega automaticamente
5. Teste as 4 abas
6. Teste "Imprimir" e "Baixar PDF"

---

## 🐛 Troubleshooting

### Problema: "Perfil não disponível"
**Solução:** Clique "Gerar Perfil" na página de resultados. A API vai gerar automaticamente.

### Problema: Dados vazios nas abas
**Solução:** Verifique se o assessment foi salvo com dados. Volte e preencha todas as seções.

### Problema: "Falha ao gerar perfil"
**Verificar:**
- Supabase está conectado? (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão no `.env.local`)
- Tabela `genius_profiles` existe no Supabase?
- RLS policies estão corretas?

### Problema: "Você é Gestor" não aparece
**Verificar:** Usuário tem `role = 'gestor'` na tabela `users`?

---

## 📊 Estrutura de Dados

### Tabela: `genius_profiles`
```sql
CREATE TABLE genius_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id),
  user_id uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id),
  profile_data jsonb,  -- Todo o objeto gerado
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

**Já foi criada** na schema.sql anterior.

---

## 🎨 Customizações Possíveis

### 1. **Mudar Cores**
- Edite no componente: `#2855FF` → sua cor (ex: `#FF6B00` para Rio Mais primary)
- Arquivo: `/app/dashboard/results/[id]/page.tsx`

### 2. **Adicionar mais Campos**
- Edite `generateGeniusProfile()` em `/app/api/genius-profile/route.ts`
- Adicione novos `frameworks_analysis` ou seções

### 3. **Melhorar PDF Export**
- Instale lib: `npm install html2pdf.js` ou `npm install jspdf html2canvas`
- Substitua a função `generatePrintableHTML()` por mais robusta

---

## 📝 Próximos Passos

1. ✅ **Fazer Push para GitHub** (quando autenticação funcionar)
2. ✅ **Sincronizar no Lovable**
3. ✅ **Testar fluxo completo** com novo usuário
4. ⏳ **Publicar em produção** (Deploy para Vercel)
5. ⏳ **Convidar gestor e colaboradores** para testar
6. ⏳ **Feedback e ajustes**

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique o Console do Navegador** (F12)
2. **Verifique Logs do Supabase** (Dashboard → Logs)
3. **Verifique Network** (F12 → Network → busque `/api/genius-profile`)

---

**Arquivo de Branding Refined:** `LOVABLE_PROMPT_REFINED.md`
**Documentação Lovable:** `.aios-core/development/tasks/LOVABLE.md`

Tudo pronto para sincronizar! 🚀
