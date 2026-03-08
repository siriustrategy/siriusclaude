# Sirius Strategy Hub — Design Specification

**Versao:** 1.0
**Data:** 2026-03-06
**Referencia:** Brandbook Sirius v1.0 + Estilo HUD Neon (imagem aprovada)

---

## 1. Filosofia Visual do Hub

O Sirius Strategy Hub e um **cockpit profissional pessoal**.
A metafora visual e: sala de controle de missao espacial — escuro, preciso, cheio de dados vivos.

Nao e um dashboard de startup.
E uma central de inteligencia pessoal.

---

## 2. Extensao da Paleta — Neon para Graficos

Baseado no Brandbook Sirius v1.0 + referencia visual aprovada.

### 2.1 Cores Base (do Brandbook)

```css
--color-abyss: #050508;          /* Fundo principal */
--color-deep-surface: #0A0A14;   /* Cards, containers */
--color-sirius-mark: #0C1566;    /* Bordas, linhas sutis */
--color-pulse: #3B5BDB;          /* Accent principal */
--color-dim-star: #6B7A9E;       /* Textos secundarios */
--color-cold-white: #E8EEFF;     /* Texto principal */
```

### 2.2 Extensao Neon — Hub Charts

```css
/* NEON PRIMARY — Cyan (graficos principais, linhas de destaque) */
--neon-cyan: #00D4FF;
--neon-cyan-bright: #00F0FF;
--neon-cyan-dim: #0090B8;
--neon-cyan-glow: rgba(0, 212, 255, 0.3);
--neon-cyan-glow-strong: rgba(0, 212, 255, 0.6);

/* NEON SECONDARY — Blue (graficos secundarios, barras) */
--neon-blue: #3B5BDB;            /* Pulse do brandbook */
--neon-blue-bright: #5C7AFF;
--neon-blue-dim: #1E3A8A;
--neon-blue-glow: rgba(59, 91, 219, 0.35);

/* NEON ACCENT — Teal (indicadores, sparklines) */
--neon-teal: #00B4D8;
--neon-teal-bright: #00D0F5;
--neon-teal-glow: rgba(0, 180, 216, 0.25);

/* NEON STATUS */
--neon-success: #00FF87;         /* Positivo, crescimento */
--neon-warning: #FFB700;         /* Atencao */
--neon-danger: #FF2D55;          /* Risco, queda */

/* GRADIENTS (para area charts e fills) */
--gradient-cyan-fade: linear-gradient(180deg, rgba(0, 212, 255, 0.4) 0%, rgba(0, 212, 255, 0) 100%);
--gradient-blue-fade: linear-gradient(180deg, rgba(59, 91, 219, 0.4) 0%, rgba(59, 91, 219, 0) 100%);
--gradient-card: linear-gradient(135deg, #0A0A14 0%, #0C1020 100%);
```

---

## 3. Efeitos de Glow (CSS)

```css
/* Glow para linhas de graficos */
.chart-line-cyan {
  filter: drop-shadow(0 0 6px #00D4FF) drop-shadow(0 0 12px rgba(0, 212, 255, 0.5));
}

.chart-line-blue {
  filter: drop-shadow(0 0 6px #3B5BDB) drop-shadow(0 0 12px rgba(59, 91, 219, 0.5));
}

/* Glow para numeros e KPIs */
.kpi-value {
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.4);
}

/* Glow para bordas de cards */
.card-neon-border {
  border: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow:
    0 0 0 1px rgba(0, 212, 255, 0.05),
    0 0 20px rgba(0, 212, 255, 0.05),
    inset 0 0 20px rgba(0, 212, 255, 0.02);
}

/* Glow para barras de progresso */
.progress-neon {
  box-shadow: 0 0 10px #00D4FF, 0 0 20px rgba(0, 212, 255, 0.5);
}

/* Grid lines dos graficos */
.chart-grid {
  stroke: rgba(59, 91, 219, 0.15);
}
```

---

## 4. Componentes de Grafico

### 4.1 Line Chart (Recharts)
- Stroke: `#00D4FF` (cyan) ou `#3B5BDB` (blue)
- Stroke width: 2px
- Filter: `drop-shadow` neon
- Area fill: gradiente fade (20% opacity no topo, 0% no fundo)
- Dots: circle fill com glow
- Grid: linhas `#0C1566` (15% opacity)
- Animacao: ease-in-out 1.5s no mount

### 4.2 Bar Chart (Recharts)
- Fill: gradiente vertical azul/cyan
- Radius: [4, 4, 0, 0]
- Hover: brightness 1.3 + glow intensificado
- Animacao: crescimento de baixo para cima 0.8s

### 4.3 Circular Progress (custom SVG)
- Track: `rgba(59, 91, 219, 0.15)` (quase invisivel)
- Fill: stroke cyan com glow
- Centro: numero em JetBrains Mono com text-shadow neon
- Animacao: stroke-dashoffset de 0 a valor 1.2s ease-out

### 4.4 KPI Cards (numero grande)
- Numero: Space Grotesk Black, 48-60px, `#00D4FF`
- Text-shadow: glow cyan
- Sparkline abaixo: mini linha animada
- Border: neon border sutil

### 4.5 Progress Bars (horizontal)
- Track: `rgba(255,255,255,0.06)`
- Fill: gradiente linear cyan
- Box-shadow: glow neon
- Label: DM Sans, `#6B7A9E`
- Porcentagem: JetBrains Mono, `#E8EEFF`

---

## 5. Animacoes

### 5.1 Principios
- Todos os graficos animam no mount (entram da base)
- Hover em cards: `scale(1.02)` + intensificacao do glow
- Numeros KPI: contador animado de 0 ao valor real
- Transicoes de pagina: fade + slide suave

### 5.2 Timings
```css
--animation-fast: 0.15s;      /* Hover, micro-interacoes */
--animation-normal: 0.3s;     /* Transicoes de estado */
--animation-slow: 0.8s;       /* Entrada de graficos */
--animation-chart: 1.5s;      /* Animacao de linha/area */
--animation-count: 1.2s;      /* Contador de numeros */
--easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 6. Layout e Espacamento

### 6.1 Grid do Dashboard
- Layout: CSS Grid responsivo
- Desktop: 12 colunas, 24px gap
- Tablet: 6 colunas, 16px gap
- Mobile: 1 coluna, 16px gap

### 6.2 Cards
- Background: `#0A0A14` (Deep Surface)
- Border: 1px solid `rgba(0, 212, 255, 0.12)`
- Border-radius: 12px
- Padding: 24px
- Box-shadow neon sutil no hover

### 6.3 Sidebar de Navegacao
- Width: 240px (desktop), colapsavel em mobile
- Background: `#050508` (Abyss)
- Border-right: 1px solid `#0C1566`
- Icones: Lucide, 20px, `#6B7A9E` (inativo), `#00D4FF` (ativo)
- Item ativo: background `rgba(0, 212, 255, 0.08)`, icon neon

---

## 7. Tipografia no Hub

Mesma escala do brandbook, com adicoes para dados:

| Elemento | Fonte | Tamanho | Cor |
|----------|-------|---------|-----|
| KPI numero | JetBrains Mono Black | 48-60px | `#00D4FF` com glow |
| KPI label | DM Sans Medium | 12px | `#6B7A9E` uppercase |
| Titulo de card | Space Grotesk SemiBold | 16px | `#E8EEFF` |
| Dado de tabela | JetBrains Mono | 14px | `#E8EEFF` |
| Label de eixo | DM Sans | 11px | `#6B7A9E` |
| Tooltip | DM Sans | 13px | `#E8EEFF` |

---

## 8. Icones

- **Biblioteca:** Lucide React (exclusivamente)
- **Tamanhos:** 16px (inline), 20px (nav), 24px (headings)
- **Cores:** `#6B7A9E` padrao, `#00D4FF` ativo/hover
- **Proibido:** emojis nativos, Font Awesome, Material Icons

---

## 9. Responsividade (PWA)

### Desktop (1440px+)
- Sidebar expandida, grid 12 colunas, graficos grandes

### Laptop (1024px-1440px)
- Sidebar condensada, grid 8 colunas

### Tablet (768px-1024px)
- Sidebar colapsada (toggle), grid 4 colunas

### Mobile (< 768px)
- Bottom navigation (4 itens principais)
- Graficos full-width
- KPI cards em 2 colunas
- Swipe entre modulos

---

## 10. Checklist de Qualidade Visual

- [ ] Fundo sempre `#050508` — nunca branco, nunca cinza
- [ ] Todos os graficos tem animacao de entrada
- [ ] Numeros grandes tem glow neon
- [ ] Icones SVG (Lucide), nunca emojis
- [ ] Hover em todo elemento interativo
- [ ] Contraste WCAG AA no minimo
- [ ] Mobile: bottom nav funcional
- [ ] Scrollbar custom (dark, thin, neon)

---

*Especificacao criada por Orion (AIOS Master) — 2026-03-06*
*Baseada no Brandbook Sirius v1.0 e referencia visual aprovada*
