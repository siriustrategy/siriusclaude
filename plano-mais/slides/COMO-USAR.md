# Como Criar os Slides Google

## Dois arquivos, dois presentations separados

| Arquivo | Presentation gerado |
|---------|-------------------|
| `playbook-humano.gs` | Playbook das Atendentes (14 slides) |
| `playbook-automacoes.gs` | Playbook de Automações (13 slides) |

---

## Passo a Passo

### 1. Abrir o Google Apps Script
Acesse: **script.google.com**

### 2. Criar novo projeto
- Clique em **"Novo projeto"**
- Apague o código que já aparece

### 3. Colar o código
- Abra o arquivo `.gs` desejado aqui no computador
- Copie TODO o conteúdo
- Cole no editor do Apps Script

### 4. Executar
- Clique no menu **"Executar"** → selecione a função:
  - `criarPlaybookHumano` (para o playbook das atendentes)
  - `criarPlaybookAutomacoes` (para as automações)

### 5. Autorizar
- Na primeira execução, o Google vai pedir permissão
- Clique em "Revisar permissões" → escolha sua conta → "Permitir"

### 6. Pronto!
- O presentation será criado no seu Google Drive
- O link aparece no log (Visualizar → Logs)

---

## Dica
Você pode criar os dois ao mesmo tempo em abas separadas do Apps Script.
