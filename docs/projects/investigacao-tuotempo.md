# 🔍 Guia de Investigação — TuoTempo
**Objetivo:** Entender 100% como a ferramenta funciona e identificar oportunidades de IA e automação
**Status:** A fazer
**Data de criação:** 2026-03-03

---

## O que é o TuoTempo?

> TuoTempo é uma plataforma de gestão voltada para planos de saúde e clínicas.
> Faz agendamento, gestão de pacientes/beneficiários, comunicação e relatórios.

**Nossa missão aqui:** Entender o que a Plano Mais usa HOJE e o que ainda é possível usar.

---

## PARTE 1 — O que eu mesmo devo explorar (antes da conversa)

Antes de falar com a gestora, passe um tempo navegando na plataforma sozinho. Anotar:

### 1.1 — Mapa das telas
Abrir cada menu e responder:

| Módulo / Tela | Existe? | A gente usa? | O que faz? |
|---------------|---------|--------------|------------|
| Agendamento | | | |
| Cadastro de beneficiários | | | |
| Histórico / prontuário | | | |
| Comunicação (email/SMS/WhatsApp) | | | |
| Relatórios e extrações | | | |
| Financeiro / cobrança | | | |
| Painel de administração | | | |
| Configurações de automação | | | |
| Integrações com outras ferramentas | | | |

### 1.2 — Perguntas que você mesmo pode responder navegando

- [ ] Consigo ver uma lista de todos os beneficiários?
- [ ] Consigo filtrar por situação (adimplente / inadimplente)?
- [ ] Tem algum campo de status de pagamento?
- [ ] Tem histórico de contato com o cliente?
- [ ] Consigo exportar dados em Excel ou CSV?
- [ ] Existe algum módulo de comunicação (disparo de mensagens)?
- [ ] Existe alguma área de "integrações" ou "API"?

---

## PARTE 2 — Perguntas para a Gestora

> Use estas perguntas quando for conversar com quem cuida do TuoTempo hoje.
> Anote tudo. Grave se puder (com permissão).

### BLOCO A — O que usamos hoje

1. **"Quais módulos do TuoTempo a gente realmente usa no dia a dia?"**
   - Qual a rotina dela dentro da plataforma?
   - O que ela faz toda manhã / toda semana?

2. **"Quem mais acessa o TuoTempo além de você? O que cada pessoa faz lá?"**
   - Mapear quantas pessoas usam e para quê.

3. **"Quais tarefas você faz no TuoTempo que são repetitivas ou chatas?"**
   - Essas são candidatas a automação.

4. **"Tem alguma coisa que você faz fora do TuoTempo que deveria estar dentro?"**
   - Ex: planilha paralela, anotação em papel, mensagem manual.

5. **"Tem alguma coisa que você vê na plataforma mas nunca usou e não sabe pra que serve?"**
   - Pode revelar funcionalidades escondidas.

---

### BLOCO B — Dados de clientes e inadimplência

6. **"Como a gente identifica hoje quem está inadimplente?"**
   - Isso aparece no TuoTempo automaticamente?
   - Tem algum relatório de inadimplência?

7. **"Qual o caminho desde que o cliente fica inadimplente até alguém do call center ligar?"**
   - Quem vê? Como sabe que tem que ligar? De onde tira o número?

8. **"Os dados de pagamento ficam no TuoTempo ou em outro sistema?"**
   - O financeiro usa o TuoTempo ou tem outra ferramenta?

9. **"Consigo puxar uma lista de clientes inadimplentes com nome, telefone e valor devido?"**
   - Se sim, em que formato? (Excel? Relatório dentro da plataforma?)

10. **"Os clientes novos entram no TuoTempo automaticamente ou alguém cadastra na mão?"**
    - Fluxo de entrada de novos clientes.

---

### BLOCO C — Comunicação com clientes

11. **"A empresa manda mensagem (WhatsApp, email, SMS) pelo TuoTempo?"**
    - Se sim, como funciona? É manual ou automático?
    - Tem template de mensagem salvo?

12. **"Tem alguma régua de comunicação hoje? (Ex: dia do vencimento manda lembrete)"**
    - Se tiver, quem configurou? Funciona bem?

13. **"O TuoTempo tem integração com WhatsApp? Ou só email?"**

---

### BLOCO D — Técnico (API e integração)

14. **"Você sabe se o TuoTempo tem API? (integração com outros sistemas)"**
    - Não precisa saber detalhes. Só saber se já usamos ou se já alguém perguntou sobre isso.

15. **"Tem alguma outra ferramenta que se conecta com o TuoTempo hoje?"**
    - Ex: sistema financeiro, planilha automática, outro app.

16. **"Quem é o suporte / representante do TuoTempo que atende vocês?"**
    - Pegar contato para eu poder tirar dúvidas técnicas diretamente com eles.

---

### BLOCO E — Problemas e frustrações

17. **"Qual a maior dor que você tem com o TuoTempo hoje?"**
    - O que não funciona direito? O que é lento? O que falta?

18. **"Tem alguma coisa que você tenta fazer e a plataforma não deixa?"**
    - Limitações da ferramenta.

19. **"Se você pudesse mudar uma coisa no TuoTempo, o que seria?"**
    - Oportunidade direta de melhoria.

---

## PARTE 3 — O que eu preciso sair da conversa sabendo

Ao final da conversa, tenho que conseguir responder:

- [ ] Quais módulos a gente usa
- [ ] Como identificamos inadimplentes hoje
- [ ] De onde vêm os dados que o call center usa para ligar
- [ ] Se tem API (ou como acessar isso)
- [ ] Quem é o contato técnico da ferramenta
- [ ] Quais são as maiores dores da gestora com a plataforma
- [ ] Se tem alguma forma de exportar dados de clientes

---

## PARTE 4 — Após a conversa: O que analisar

Com as informações coletadas, avaliar:

### 4.1 — O que podemos automatizar?
- Tarefa repetitiva X → pode virar automação com agente de IA?
- Lista de inadimplentes → pode ser puxada automaticamente?
- Comunicação com clientes → pode ser disparada por régua automática?

### 4.2 — Pontos de integração
- TuoTempo tem API? → podemos integrar com CRM (RD Station)
- Exporta CSV? → podemos criar pipeline de dados para dashboards

### 4.3 — O que NÃO usamos que deveríamos?
- Funcionalidades escondidas que resolveriam problemas que temos hoje

---

## Anotações da conversa

> (Preencher após a reunião com a gestora)

**Data da conversa:** ___________
**Duração:** ___________
**Participantes:** ___________

**Resumo:**

**Principais aprendizados:**
1.
2.
3.

**Oportunidades identificadas:**
1.
2.
3.

**Próximos passos:**
- [ ]
- [ ]

---

*Documento criado por Orion (AIOS Master) · 2026-03-03*
