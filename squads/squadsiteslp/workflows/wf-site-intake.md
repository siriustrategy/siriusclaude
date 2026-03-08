# wf-site-intake — PRD Estruturado

**Tipo:** Workflow Elicitativo
**Executor:** squadsiteslp-chief
**Obrigatorio:** SIM — nenhum site comeca sem este workflow completo
**Output:** `site-brief.md` validado

---

## GATE DE ENTRADA

**BLOCKER:** Este workflow DEVE ser executado antes de qualquer criacao de site.
Se usuario pedir site sem passar por aqui → redirecionar para este workflow.

---

## FASE 1 — Branding & Identidade

**Executor:** squadsiteslp-chief
**Pergunta ao usuario:**

> Voce tem materiais de branding? Pode ser uma pasta com: logo, paleta de cores, fontes, exemplos de como a marca se comunica.

**SE SIM:**
- Solicitar caminho da pasta ou upload dos arquivos
- Extrair: logo (formato, cores), paleta, fontes primaria e secundaria, tom de voz
- Prosseguir para Fase 2

**SE NAO:**
- Executar mini-intake de branding inline:
  1. Qual o nome do projeto/empresa?
  2. Que palavras descrevem a personalidade visual? (ex: minimalista, premium, vibrante, tecnica)
  3. Ha cores que representam a marca? Ou cores que voce ODEIA ver associadas?
  4. Ha algum site ou marca que voce admira o visual?
  5. Ha restricoes: sem emojis, sem icones genericos, sem gradientes?

**VETO:** Se nenhum material ou informacao de branding for fornecida → nao avancar.

---

## FASE 2 — Publico & Objetivo

**Executor:** squadsiteslp-chief

Perguntas obrigatorias:

1. **Quem e o publico principal?**
   - Perfil: (ex: empresarios de 30-50 anos, profissionais de marketing, estudantes)
   - Principal dor ou desejo desse publico em relacao a este produto/servico

2. **Qual e o UNICO objetivo principal deste site/LP?**
   Opcoes: [ ] Captar leads  [ ] Vender produto/servico diretamente  [ ] Apresentar portfolio  [ ] Construir autoridade/blog  [ ] Outro: ___

3. **Qual e a acao que o usuario deve tomar ao visitar?**
   (ex: preencher formulario, clicar em WhatsApp, comprar, agendar demo)

**VETO:** Se objetivo nao e claro e unico → perguntar novamente antes de avancar.

---

## FASE 3 — Conteudo & Estrutura

**Executor:** squadsiteslp-chief

1. **O site precisa de quantas paginas?**
   [ ] Landing page unica  [ ] Site com home + paginas internas  [ ] Quantas: ___

2. **Ha conteudo ja existente?**
   (textos, imagens, videos, depoimentos, logos de clientes)
   SE SIM: solicitar

3. **Ha referencias de sites que voce gosta?** (visual OU estrutura)
   - Gosta de: ___
   - NAO quer nada parecido com: ___

4. **Ha funcionalidades especificas necessarias?**
   [ ] Formulario de contato  [ ] Blog  [ ] E-commerce  [ ] Autenticacao
   [ ] Integracao com CRM  [ ] Outro: ___

---

## FASE 4 — Stack & Deploy

**Executor:** squadsiteslp-chief / guillermo-rauch

1. **Ja tem conta no GitHub?** [ ] Sim  [ ] Nao (criar durante o processo)

2. **Preferencia de hosting?**
   [ ] Vercel (recomendado — mais simples)
   [ ] Netlify
   [ ] Sem preferencia (decidir baseado na stack)

3. **Precisa de dominio customizado?**
   SE SIM: qual dominio? Ja tem registrado?

4. **O site precisa de backend/banco de dados?**
   [ ] Nao (site estatico/landing page)
   [ ] Sim, autenticacao de usuarios
   [ ] Sim, armazenar dados de formularios
   [ ] Sim, outro: ___

---

## FASE 5 — Validacao do Brief

**Executor:** squadsiteslp-chief

Antes de avancar, validar que `site-brief.md` tem:

- [ ] Nome do projeto / cliente
- [ ] Branding definido (cores, fontes, tom)
- [ ] Publico-alvo descrito com dores/desejos
- [ ] Objetivo unico e claro
- [ ] Acao principal do usuario definida
- [ ] Stack definida (default: Next.js + Vercel se nao especificado)
- [ ] Dominio ou subdominio definido

**SE algum item esta faltando → voltar a fase correspondente.**
**SE todos os itens presentes → gerar site-brief.md e passar para wf-create-site.md**

---

## OUTPUT: site-brief.md

```markdown
# Site Brief — [Nome do Projeto]
Data: [YYYY-MM-DD]

## Branding
- Logo: [descricao/caminho]
- Cores: primaria #, secundaria #, neutro #
- Fontes: [nome] / [nome]
- Tom de voz: [adjetivos]
- Anti-patterns de marca: [o que evitar]

## Publico
- Perfil: [descricao]
- Dor principal: [texto]
- Desejo: [texto]
- Linguagem que usam: [exemplos VOC se disponivel]

## Objetivo & Acao
- Objetivo: [unico objetivo]
- Acao principal: [o que usuario deve fazer]
- KPI de sucesso: [metrica]

## Estrutura
- Tipo: [landing page / site multipaginas]
- Secoes: [lista]
- Funcionalidades: [lista]

## References
- Gosta de: [urls ou descricoes]
- Nao quer: [urls ou descricoes]

## Stack & Deploy
- Framework: [Next.js / Astro / outro]
- Hosting: [Vercel / Netlify]
- Database: [nao / Supabase / outro]
- Dominio: [url]
- GitHub repo: [url ou a criar]
```
