# wf-deploy-pipeline — Do GitHub ao Ar

**Tipo:** Workflow de Deploy
**Input:** Repositorio GitHub com codigo completo (de wf-create-site.md)
**Output:** Site no ar com dominio customizado + SSL + CI/CD configurado
**Executor principal:** @guillermo-rauch → @lee-robinson → @matt-biilmann (se Netlify)

---

## PRE-REQUISITO

**BLOCKER:** Repositorio GitHub deve existir com:
- Codigo do site completo
- Core Web Vitals passando
- Schema markup implementado
- Nenhum secret ou .env no repositorio

---

## FASE 1 — Setup GitHub (@lee-robinson)

### 1.1 Repositorio
```bash
# Se repositorio nao existe
git init
git add .
git commit -m "feat: initial site setup"
gh repo create [nome-do-projeto] --private --push

# SE repositorio ja existe
git remote add origin https://github.com/[usuario]/[repo].git
git push -u origin main
```

### 1.2 Branch Protection
- Configurar branch protection em `main`:
  - Require pull request review antes de merge
  - Require status checks to pass

### 1.3 Secrets & Variables
Adicionar no GitHub (Settings → Secrets and variables → Actions):
- `VERCEL_TOKEN` (obtido no Vercel dashboard)
- Qualquer outra env var de producao

---

## FASE 2 — Setup Vercel (@lee-robinson)

### 2.1 Criar Projeto no Vercel
```bash
# Via CLI (recomendado)
npm i -g vercel
vercel login
vercel # Na pasta do projeto — segue o wizard
```

OU via Dashboard:
1. vercel.com/new
2. Import Git Repository
3. Selecionar repositorio GitHub
4. Configurar: Framework Preset → Next.js
5. Adicionar Environment Variables
6. Deploy

### 2.2 Environment Variables no Vercel
Adicionar no Vercel Dashboard (Settings → Environment Variables):
- `DATABASE_URL` (se banco de dados)
- `NEXTAUTH_SECRET` (se autenticacao)
- `NEXTAUTH_URL` (URL de producao)
- Qualquer outra var do `.env.example`

**REGRA:** Configurar separadamente para: Production | Preview | Development

### 2.3 Automatic Deploys
- Verificar que "Automatic Deployments" esta ativado
- Branch: main → Production
- Outras branches → Preview

---

## FASE 3 — Dominio Customizado (@lee-robinson)

### 3.1 Adicionar Dominio
No Vercel Dashboard → Project → Settings → Domains:
1. Adicionar dominio (ex: www.meusite.com.br)
2. Vercel gera os DNS records necessarios

### 3.2 Configurar DNS
No provedor do dominio (Registro.br, GoDaddy, Cloudflare, etc.):
```
# Para www:
CNAME  www  cname.vercel-dns.com

# Para apex (meusite.com.br):
A      @    76.76.19.61
A      @    76.76.21.9
```

### 3.3 SSL Automatico
- Vercel configura SSL automaticamente via Let's Encrypt
- Aguardar propagacao de DNS (2-48h dependendo do TTL)
- Verificar: https://[dominio] funcionando

---

## FASE 4 — Preview Pipeline (@lee-robinson)

### 4.1 Verificar Preview Deploys
- Criar branch de teste: `git checkout -b feature/test-preview`
- Fazer pequena alteracao
- `git push origin feature/test-preview`
- Verificar que Vercel gerou URL de preview automaticamente

### 4.2 Configurar Comentarios Automaticos
- Vercel automaticamente comenta na PR com a URL de preview
- Verificar que GitHub App do Vercel esta instalado no repositorio

---

## FASE 5 — Validacao Final

**Executor:** squadsiteslp-chief — checklist completo antes de comunicar "site no ar"

### Performance
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Core Web Vitals: todos PASS

### SEO
- [ ] Title tags corretos em todas as paginas
- [ ] Meta descriptions presentes
- [ ] Schema markup validado (Google Rich Results Test)
- [ ] sitemap.xml acessivel em /sitemap.xml
- [ ] robots.txt configurado
- [ ] HTTPS funcionando

### Design & UX
- [ ] Anti-AI check: nenhum padrao de template detectado
- [ ] Animacoes funcionando corretamente
- [ ] Responsivo em mobile, tablet e desktop
- [ ] CTAs visiveis e funcionais
- [ ] Formularios enviando corretamente

### Deploy
- [ ] Dominio customizado funcionando com HTTPS
- [ ] Deploy automatico funcionando (push → deploy)
- [ ] Preview deploys funcionando (branch → preview URL)
- [ ] Rollback testado (Vercel Dashboard → Deployments → Promote)

---

## FASE 6 — Handoff ao Usuario

**Executor:** squadsiteslp-chief

Entregar ao usuario:

```markdown
# Site no Ar — [Nome do Projeto]

## URLs
- Producao: https://[dominio]
- Preview: https://[projeto].vercel.app
- Dashboard Vercel: https://vercel.com/[usuario]/[projeto]
- Repositorio: https://github.com/[usuario]/[repo]

## Como Atualizar o Site
1. Editar arquivos no repositorio
2. git add . && git commit -m "update: [descricao]"
3. git push origin main
4. Vercel faz o deploy automaticamente (2-3 minutos)

## Como Ver Versoes Anteriores
- Vercel Dashboard → Deployments → clicar em versao anterior → Promote

## Onde Estao os Textos
- /src/app/page.tsx (ou pages/index.tsx) — pagina principal
- /src/components/ — componentes reutilizaveis
- /public/ — imagens e assets estaticos

## Credenciais
- Vercel: [login]
- GitHub: [repositorio]
- Supabase (se aplicavel): [dashboard URL]
```

---

## VETO CONDITIONS

- Dominio sem HTTPS → nao comunicar "site no ar"
- Core Web Vitals falhando → corrigir antes do handoff
- Preview deploy nao funcionando → configurar antes do handoff
- .env ou secrets no repositorio → PARAR TUDO, remover e rotar keys

---

## ROLLBACK PROCEDURE

SE algo der errado apos deploy:

```bash
# Via Vercel CLI
vercel rollback

# Via Dashboard
# Vercel → Project → Deployments → Versao anterior → "..." → Promote to Production
```
