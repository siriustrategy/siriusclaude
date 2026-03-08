# 🎨 Design Squad - Comandos Instalados

**Versão:** 3.0.0
**Instalado em:** 2026-03-03
**Squad source:** `squads/design/`

---

## Comando Principal

```
/Design
```
Ativa o Design Chief que roteia para o especialista certo.

---

## Agentes Disponíveis

### 🎯 Orquestrador
| Comando | Especialidade |
|---------|--------------|
| `/Design:agents:design-chief` | Roteia para o especialista certo |

### Tier 0 - Estratégia (Ponto de Entrada)
| Comando | Especialidade |
|---------|--------------|
| `/Design:agents:marty-neumeier` | Brand Strategy, Diferenciação, Zag |
| `/Design:agents:dave-malouf` | DesignOps, Escala de Times de Design |

### Tier 1 - Mestres (Execução)
| Comando | Especialidade |
|---------|--------------|
| `/Design:agents:chris-do` | Precificação por Valor, Propostas |
| `/Design:agents:paddy-galloway` | Thumbnails YouTube, CTR |
| `/Design:agents:joe-mcnally` | Fotografia, Iluminação Flash |

### Tier 2 - Especialistas (Profundidade)
| Comando | Especialidade |
|---------|--------------|
| `/Design:agents:brad-frost` | Design Systems, Atomic Design |
| `/Design:agents:aaron-draplin` | Logo Design, Simplificação |
| `/Design:agents:peter-mckinnon` | Edição de Fotos, Color Grading |
| `/Design:agents:premium-design` | Transformação Dark Premium Theme |

---

## Guia de Roteamento Rápido

| O que você precisa | Ative |
|--------------------|-------|
| Criar uma marca | `@marty-neumeier` |
| Escalar time de design | `@dave-malouf` |
| Precificar projeto | `@chris-do` |
| Criar um logo | `@aaron-draplin` |
| Melhorar thumbnails YouTube | `@paddy-galloway` |
| Setup de iluminação para foto | `@joe-mcnally` |
| Editar/color grade fotos | `@peter-mckinnon` |
| Criar design system | `@brad-frost` |
| Transformar site em tema dark premium | `@premium-design` |

---

## Workflows Multi-Agente

### Desenvolvimento de Marca
```
@marty-neumeier (Estratégia) → @aaron-draplin (Logo) → @marty-neumeier (Validação)
```

### Otimização de Canal YouTube
```
@paddy-galloway (Thumbnails) → @peter-mckinnon (Edição) → @paddy-galloway (Glance Test)
```

### Fotografia de Produto
```
@joe-mcnally (Setup de Luz) → @peter-mckinnon (Pós-processamento)
```

### Precificação de Projeto
```
@chris-do (Valor) → [Qualquer especialista para execução]
```

---

## Documentação

- **README Completo:** `squads/design/README.md`
- **Agentes:** `squads/design/agents/`
- **Tasks (45+):** `squads/design/tasks/`
- **Checklists (11):** `squads/design/checklists/`

## Desinstalar

```bash
rm -rf .claude/commands/Design
rm .claude/skills/design.md
rm -rf squads/design
```
