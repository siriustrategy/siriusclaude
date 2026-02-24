# 43 Perguntas do Zona de Genialidade — Mapeamento para Banco de Dados

## Referência Rápida

| Seção | Perguntas | Campo no Banco |
|-------|-----------|--------|
| SECTION 1: Context | 6 | section_1_* |
| SECTION 2: Activities | 12 | section_2_* |
| SECTION 3: Talents | 10 | section_3_* |
| SECTION 4: Business | 7 | section_4_* |
| SECTION 5: Vision | 8 | section_5_* |
| **TOTAL** | **43** | **assessments table** |

---

## SECTION 1: CONTEXT (6 perguntas)

### Pergunta 1 | Campo: `section_1_nome`
**Pergunta:** Qual é o seu nome completo?
**Tipo de Resposta:** Texto livre (até 255 caracteres)
**Tipo de Campo:** VARCHAR(255)
**Obrigatória:** SIM
**Exemplo:** "Breno Nobre"

### Pergunta 2 | Campo: `section_1_area_atuacao`
**Pergunta:** Qual é sua área de atuação? (e.g., Tecnologia, Marketing, Vendas, etc.)
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Tecnologia, IA, Marketing Digital, Growth, Vendas"

### Pergunta 3 | Campo: `section_1_tempo_experiencia`
**Pergunta:** Quanto tempo de experiência você tem?
**Tipo de Resposta:** Múltipla escolha (dropdown)
**Opções:** "0-1 ano", "1-3 anos", "3-5 anos", "5-10 anos", "10+ anos"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "1 a 3 anos"

### Pergunta 4 | Campo: `section_1_descricao_dia_a_dia`
**Pergunta:** Descreva um dia típico seu. O que você faz? Como passa seu tempo?
**Tipo de Resposta:** Texto livre (textarea, 500+ caracteres)
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Estudo inteligência artificial, treino, trabalho em um grupo de empresas..."

### Pergunta 5 | Campo: `section_1_se_dinheiro_nao_importasse`
**Pergunta:** Se dinheiro não fosse problema, o que você faria da vida?
**Tipo de Resposta:** Texto livre (textarea)
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Viajaria o mundo, ajudaria pessoas necessitadas, ensinaria..."

### Pergunta 6 | Campo: `section_1_espectro_introextro`
**Pergunta:** Você é mais introvertido ou extrovertido?
**Tipo de Resposta:** Múltipla escolha com escala
**Opções:** "Muito introvertido", "Mais introvertido", "Equilibrado", "Mais extrovertido", "Muito extrovertido"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Mais introvertido - gosto de pessoas mas preciso de tempo sozinho"

---

## SECTION 2: ACTIVITIES (12 perguntas)

### Pergunta 7 | Campo: `section_2_atividades_drenam`
**Pergunta:** Quais atividades/tarefas você sente que drenam sua energia?
**Tipo de Resposta:** Múltipla seleção (checkboxes) + texto livre
**Tipo de Campo:** TEXT[] (Array de strings)
**Obrigatória:** SIM
**Opções Sugeridas:**
- Tarefas administrativas e burocráticas
- Trabalho repetitivo e operacional
- Reuniões longas
- Detalhes técnicos
- Execução operacional
**Exemplo:** ["Tarefas administrativas", "Trabalho repetitivo"]

### Pergunta 8 | Campo: `section_2_atividades_energizam`
**Pergunta:** Quais atividades/tarefas você sente que energizam você?
**Tipo de Resposta:** Múltipla seleção (checkboxes) + texto livre
**Tipo de Campo:** TEXT[]
**Obrigatória:** SIM
**Opções Sugeridas:**
- Criar coisas novas (produtos, conteúdo, arte)
- Ensinar e mentorar pessoas
- Estratégia e planejamento
- Inovação e experimentação
- Resolver problemas complexos
**Exemplo:** ["Criar coisas novas", "Ensinar e mentorar"]

### Pergunta 9 | Campo: `section_2_outros_agradecem_por`
**Pergunta:** Pelo o quê outras pessoas mais agradecem a você? O que você faz bem?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Resolver problemas que ninguém conseguia, dar motivação, enxergar soluções"

### Pergunta 10 | Campo: `section_2_perde_tempo_em`
**Pergunta:** Em quais atividades você sente que perde tempo ou não deveria estar focando?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Implementação de detalhes operacionais"

### Pergunta 11 | Campo: `section_2_como_inicia_projetos`
**Pergunta:** Como você gosta de iniciar projetos? Qual é seu estilo?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Planejamento detalhado", "Brainstorming rápido", "Prototipar logo", "Pesquisar bastante"
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Brainstorming, ideias visionárias pensando em detalhes importantes"

### Pergunta 12 | Campo: `section_2_como_resolve_problemas`
**Pergunta:** Como você resolve problemas típicos?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Paro e analiso todas as opções", "Ajo rapidamente por intuição", "Delegam para alguém", "Pesquiso soluções prontas"
**Tipo de Campo:** VARCHAR(255)
**Obrigatória:** SIM
**Exemplo:** "Paro e analiso todas as opções"

### Pergunta 13 | Campo: `section_2_manual_vs_conceitual`
**Pergunta:** Você prefere trabalhar com coisas concretas/manuais ou abstratas/conceituais?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Muito concreto", "Mais concreto", "Equilibrado", "Mais abstrato", "Muito abstrato"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Coisas abstratas - modelos mentais, frameworks, ideias"

### Pergunta 14 | Campo: `section_2_nivel_detalhe`
**Pergunta:** Como você se relaciona com detalhes?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Muito detalhista", "Detalhista", "Equilibrado", "Visão ampla", "Muito visão ampla"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Cuida dos detalhes importantes mas não se perde nos pequenos"

### Pergunta 15 | Campo: `section_2_estilo_delegacao`
**Pergunta:** Como você se sente com delegação? Delega facilmente?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Adoro delegar e estou no caminho. Sou inexperiente mas aprendendo."

### Pergunta 16 | Campo: `section_2_ritmo_trabalho`
**Pergunta:** Qual é seu ritmo de trabalho ideal? Em que horas do dia você funciona melhor?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Melhor de manhã e depois das 16h. Muito bem na madrugada quando animado."

### Pergunta 17 | Campo: `section_2_inovacao_vs_otimizacao`
**Pergunta:** Você prefere inovar/criar do zero ou otimizar/melhorar o que já existe?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Criar do zero", "Mais criar", "Equilibrado", "Mais otimizar", "Otimizar existentes"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Gosto mais de criar algo do zero, mas também adora melhorar com inovação"

### Pergunta 18 | Campo: `section_2_foco_vs_multitask`
**Pergunta:** Você funciona melhor com foco total em uma coisa ou com múltiplos projetos?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Foco total em uma", "Melhor com foco", "Ambos funcionam", "Melhor com múltiplos", "Preciso de múltiplos"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Funciono bem com hiperfoco, mas máximo 1-3 projetos"

---

## SECTION 3: TALENTS (10 perguntas)

### Pergunta 19 | Campo: `section_3_padrao_sucesso`
**Pergunta:** Qual é o padrão nos seus sucessos/vitórias? O que eles têm em comum?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Em todos estava criando algo novo e inovador"

### Pergunta 20 | Campo: `section_3_como_outros_descrevem`
**Pergunta:** Como os outros te descrevem? Quais adjetivos usam?
**Tipo de Resposta:** Texto livre (tags/comma-separated)
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Criativo, visionário, inovador, carismático, aprendo rápido"

### Pergunta 21 | Campo: `section_3_facilidade_natural`
**Pergunta:** Qual é a sua facilidade natural/inata? O que você faz naturalmente bem?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Enxergar tendências e oportunidades antes dos outros"

### Pergunta 22 | Campo: `section_3_dominio_strengths`
**Pergunta:** Qual é seu domínio de forças (área em que você é muito forte)?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "PENSADOR ESTRATÉGICO - trago visão de futuro"

### Pergunta 23 | Campo: `section_3_frustracao_recorrente`
**Pergunta:** Qual é a frustração mais recorrente que você sente?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Processos lentos e burocráticos"

### Pergunta 24 | Campo: `section_3_estilo_comunicacao`
**Pergunta:** Qual é seu estilo de comunicação?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Direto e objetivo", "Amigável e detalhado", "Inspirador e visão", "Analytical e dados"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Direto e objetivo - vou ao ponto"

### Pergunta 25 | Campo: `section_3_estilo_aprendizado`
**Pergunta:** Como você aprende melhor?
**Tipo de Resposta:** Múltipla escolha / Texto livre
**Opções:** "Vídeos/tutoriais", "Leitura", "Conversas/mentoria", "Aprender fazendo", "Observando outros"
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Vídeos focados em mentor/especialista, observando outras estratégias"

### Pergunta 26 | Campo: `section_3_reacao_feedback`
**Pergunta:** Como você reage ao feedback crítico?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Fico defensivo", "Levo pessoalmente", "Analiso friamente e extraio útil", "Ignoro na maioria", "Peço mais detalhes"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Analisa friamente e extrai o que é útil"

### Pergunta 27 | Campo: `section_3_contribuicao_mundo`
**Pergunta:** Se pudesse escolher, como gostaria de contribuir para o mundo?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Ensinar e capacitar pessoas a se desenvolverem"

### Pergunta 28 | Campo: `section_3_competencia_vs_genialidade`
**Pergunta:** O que é competência para você vs genialidade? Onde você acha que está?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Competência: executar detalhes operacionais. Genialidade: ideias inovadoras."

### Pergunta 29 | Campo: `section_3_principal_forca`
**Pergunta:** Qual é sua principal força? O que você faria se o mundo dependesse disso?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Soluções inovadoras e aprender coisas muito rápido"

---

## SECTION 4: BUSINESS (7 perguntas)

### Pergunta 30 | Campo: `section_4_modelo_preferido`
**Pergunta:** Qual é seu modelo de negócio ideal/preferido?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Produtos digitais em escala", "Consultoria 1-a-1", "Membros/comunidades", "Empresário (criando empresa)", "Freelancer/serviços"
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Criar produtos digitais e vender em escala"

### Pergunta 31 | Campo: `section_4_tolerancia_risco`
**Pergunta:** Qual é sua tolerância a risco?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Muito conservador", "Conservador", "Equilibrado", "Amo risco", "Muito alto risco"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Amo risco"

### Pergunta 32 | Campo: `section_4_solo_vs_time`
**Pergunta:** Você prefere trabalhar solo ou em time?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Sempre solo", "Prefiro solo", "Equilibrado", "Prefiro time", "Sempre em time"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Nunca tive oportunidade, mas com mentor e liderando time pequeno"

### Pergunta 33 | Campo: `section_4_timing_mercado`
**Pergunta:** Como você pensa em timing/oportunidades de mercado?
**Tipo de Resposta:** Múltipla escolha / Texto livre
**Opções:** "Ser o primeiro", "Entrar cedo mas validado", "Fast follower", "Não importa timing"
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Entrar cedo em algo validado (trazer estratégias dos EUA para Brasil)"

### Pergunta 34 | Campo: `section_4_fonte_receita_ideal`
**Pergunta:** Qual seria sua fonte de receita ideal?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "SaaS/apps (recorrente)", "Produtos digitais", "Consultoria", "Royalties/passiva", "Mis diferentesensurado"
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "SaaS/apps, mas também consultoria e ensino"

### Pergunta 35 | Campo: `section_4_relacao_preco`
**Pergunta:** Como você se relaciona com precificação? Entende o valor do seu trabalho?
**Tipo de Resposta:** Múltipla escolha / Texto livre
**Opções:** "Entendo e preço alto", "Entendo bem", "Preciso de ajuda", "Não consigo enxergar valor", "Subpreço por insegurança"
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Não consigo enxergar valor no trabalho e conhecimento"

### Pergunta 36 | Campo: `section_4_escala_vs_profundidade`
**Pergunta:** Você prefere atender poucos clientes com profundidade ou muitos com solução básica?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Poucos com profundidade", "Melhor poucos", "Equilibrado", "Melhor muitos", "Escala máxima"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Poucos clientes com profundidade (mentoria) mas também produtos para muitos"

### Pergunta 37 | Campo: `section_4_perfil_wealth_dynamics`
**Pergunta:** Qual é seu perfil Wealth Dynamics? (Creator, Mechanic, Deal Maker, Star, Supporter, Accumulator)
**Tipo de Resposta:** Múltipla escolha ou texto
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "CRIADOR - muitas ideias, começam coisas novas, visionário"

---

## SECTION 5: VISION (8 perguntas)

### Pergunta 38 | Campo: `section_5_resultado_90_dias`
**Pergunta:** Qual seria seu resultado ideal nos próximos 90 dias?
**Tipo de Resposta:** Texto livre (visão)
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Abrir empresa de omnicanalidade. 10+ clientes pagando por automações."

### Pergunta 39 | Campo: `section_5_meta_receita_mensal`
**Pergunta:** Qual é sua meta de receita mensal para os próximos 6 meses?
**Tipo de Resposta:** Range de valor
**Tipo de Campo:** VARCHAR(100)
**Obrigatória:** SIM
**Formato:** "R$ 5.000 a R$ 10.000" ou "R$ 15.000 a R$ 50.000"
**Exemplo:** "R$ 15.000 a R$ 50.000/mês"

### Pergunta 40 | Campo: `section_5_maior_bloqueio`
**Pergunta:** Qual é seu maior bloqueio ou desafio nesse momento?
**Tipo de Resposta:** Texto livre
**Tipo de Campo:** TEXT
**Obrigatória:** SIM
**Exemplo:** "Conhecimento - estudar como fazer automações, mas já faz na empresa"

### Pergunta 41 | Campo: `section_5_tempo_disponivel`
**Pergunta:** Quanto tempo você tem disponível por semana para esse projeto?
**Tipo de Resposta:** Múltipla escolha / Range
**Opções:** "5-10 horas", "10-20 horas", "20-30 horas", "30-40 horas", "40+ horas"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "20+ horas/semana"

### Pergunta 42 | Campo: `section_5_nivel_ai`
**Pergunta:** Qual é seu nível de proficiência com IA/Automações?
**Tipo de Resposta:** Múltipla escolha
**Opções:** "Iniciante", "Intermediário", "Intermediário/Avançado", "Avançado", "Especialista"
**Tipo de Campo:** VARCHAR(50)
**Obrigatória:** SIM
**Exemplo:** "Intermediário/Avançado (usa IA no dia a dia)"

### Pergunta 43+ (BÔNUS - Contexto Adicional)
**Nota:** Podem haver perguntas adicionais/abertas capturadas via `chat_responses` table:
- Perguntas abertas de contexto
- Follow-ups do AI
- Validações adicionais

---

## Campos Adicionais no Banco (não perguntas diretas, mas contexto)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `started_at` | TIMESTAMP | Quando começou o assessment |
| `completed_at` | TIMESTAMP | Quando completou |
| `last_updated_at` | TIMESTAMP | Última atualização |
| `status` | ENUM | rascunho, em_progresso, completo |
| `completeness` | ENUM | 0%, 20%, 40%, 60%, 80%, 100% |

---

## Fluxo de Captura de Dados

```
1. Usuário começa assessment
   → started_at = NOW()
   → status = "em_progresso"

2. Usuário completa Section 1 (6 perguntas)
   → section_1_* fields preenchidas
   → completeness = "20%"

3. Usuário completa Section 2 (12 perguntas)
   → section_2_* fields preenchidas
   → completeness = "40%"

4. Usuário completa Section 3 (10 perguntas)
   → section_3_* fields preenchidas
   → completeness = "60%"

5. Usuário completa Section 4 (7 perguntas)
   → section_4_* fields preenchidas
   → completeness = "80%"

6. Usuário completa Section 5 (8 perguntas)
   → section_5_* fields preenchidas
   → completeness = "100%"

7. Assessment completo
   → completed_at = NOW()
   → status = "completo"
   → Trigger análise de frameworks (genius_profiles)
   → Gerar squad recommendations
   → Gerar blueprint
```

---

## Validação de Resposta

| Pergunta | Validação |
|----------|-----------|
| Nome | Min 2 caracteres, Max 255 |
| Área de atuação | Min 5 caracteres |
| Tempo experiência | Deve ser enum válido |
| Descrição dia a dia | Min 50 caracteres |
| Atividades (array) | Min 1 item, Max 10 |
| Texto livre | Min 10 caracteres, Max 5000 |
| Múltipla escolha | Deve ser opção válida |
| Valores monetários | Formato: "R$ X.XXX a R$ X.XXX" |

