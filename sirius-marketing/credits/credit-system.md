# Sistema de Créditos — Sirius-Marketing

## Filosofia
Simples como o Lovable: cada ação tem um custo em créditos claro e previsível.
O usuário sempre sabe quanto tem e quanto vai gastar antes de executar.

## Tabela de Créditos

### Criacao (Creative Studio)
| Ação | Créditos |
|------|---------|
| Gerar 1 imagem (qualquer engine) | 5 |
| Variação de formato (adaptar imagem) | 3 |
| Criar personagem (Character Sheet completo) | 8 |
| Remix de asset existente | 5 |
| Animação Remotion | 20 |

### Conteudo (Content Factory)
| Ação | Créditos |
|------|---------|
| Copy Engine (sessão com variações A/B) | 3 |
| Storyboard completo | 10 |
| Content Calendar mensal | 8 |
| Brief to Campaign | 5 |
| Presentation Deck | 12 |

### Inteligencia
| Ação | Créditos |
|------|---------|
| Ideas Generator (sessão completa) | 3 |
| Competitor Analysis | 5 |
| Viral Intelligence Report (manual) | 5 |
| Trend Adaptation Brief | 2 |

### Analytics
| Ação | Créditos |
|------|---------|
| Análise de perfil próprio | 0 (grátis sempre) |
| Análise de perfil público | 8 |
| Monitoramento de campanha (por campanha) | 2 |
| Weekly Insights Report | 5 |

### Distribuicao
| Ação | Créditos |
|------|---------|
| Agendar post | 2 |
| Publicar agora | 2 |
| Post no lote (bulk schedule) | 1 por post |

### Lovable Architect
| Ação | Créditos |
|------|---------|
| Gerar prompt Lovable completo | 4 |

### Pacotes (desconto)
| Pacote | O que inclui | Custo | Valor separado |
|--------|-------------|-------|---------------|
| Post Completo | Imagem + Copy + Agendamento | 8 | 10 |
| Campanha Semanal | 5x imagens + copies + 5x agendamentos | 35 | 60 |
| Launch Package | Storyboard + imagens de cena + copies + agendamento | 30 | 50 |

## Planos

### Free
- 30 créditos por mês (renovam todo dia 1)
- 1 marca
- Recursos disponíveis: Copy Engine, Ideas Generator, Viral Feed (leitura)
- Sem auto-publicação

### Pro — R$97/mês
- 500 créditos por mês
- 3 marcas
- Todos os recursos
- Auto-publicação ativada
- Suporte prioritário

### Academy — Para alunos Sirius
- 300 créditos por mês
- 2 marcas
- Todos os recursos
- Modo "Aprender Fazendo" (ver logs dos workflows)
- Preço especial: R$57/mês (verificação de matrícula ativa)

### Enterprise
- Créditos personalizados
- White-label disponível
- SLA garantido
- Consultar comercial

## Compra de Créditos Avulsos
| Pacote | Créditos | Preço |
|--------|---------|-------|
| Básico | 100 | R$19 |
| Popular | 300 | R$47 |
| Pro | 600 | R$79 |

## UX do Sistema de Créditos

1. **Saldo sempre visível:** Badge no header com créditos restantes
2. **Antes de executar:** Tooltip mostra custo da ação antes de confirmar
3. **Aviso com antecedência:** Alerta quando restar < 30 créditos
4. **Histórico completo:** Dashboard de uso com gráfico de consumo por categoria
5. **Nunca bloqueia sem aviso:** Ação bloqueada mostra custo e botão de recarga
6. **Pacotes sugeridos:** "Você usa muito Ideas Generator — considere o plano Pro"

## Regras de Negócio

- Créditos não acumulam entre meses (renovam no dia 1)
- Créditos avulsos não expiram por 12 meses
- Ação só desconta créditos se completada com sucesso
- Erro de API não desconta créditos
- Free trial: 7 dias com 100 créditos (sem cartão)
