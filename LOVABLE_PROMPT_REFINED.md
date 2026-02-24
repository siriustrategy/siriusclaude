# Lovable Prompt - Zona de Genialidade Dashboard
## Com Branding Rio Mais Memorial Mais

---

## 🎨 BRANDING & DESIGN SYSTEM

### Logo
Use o logo "Memorial Mais" (lotus flower icon + text):
- **Lotus Icon**: Minimalist 5-petal lotus flower (represents spirituality, peace, clarity)
- **Text**: "MEMORIAL" em weight normal + "mais" em weight bold
- **Formato**: Usar logo horizontal para header (logo + texto lado a lado)
- **Arquivos disponíveis**: Usar SVG para web responsivo
- **Placement**: Header superior esquerdo, 40-50px height

### Color Palette (EXATO do Rio Mais)
```css
/* Primária */
--blue-primary: #2855FF;        /* Royal Blue - CTAs, buttons, accents */

/* Neutras */
--dark-gray: #2C2C2C;           /* Logo, headings */
--medium-gray: #666666;         /* Secondary text */
--light-gray: #F0F0F0;          /* Section backgrounds */
--white: #FFFFFF;               /* Main background */

/* Accents */
--blue-dark: #1F40CC;           /* Button hover state */
--blue-light: #E8F0FF;          /* Light background for info sections */
```

### Typography
- **Font Family**: Inter, Segoe UI, system-ui (sans-serif modernista)
- **Headings**: Bold (700 weight), dark gray (#2C2C2C)
- **Body**: Regular (400 weight), medium gray (#666666)
- **CTA Text**: Semibold (600 weight), white on blue
- **Accent Text**: Bold blue (#2855FF) para números, preços, destacados
- **Line Height**: 1.6 para body, 1.2 para headings

---

## 📋 PROJECT STRUCTURE

**Nome do Projeto**: Zona de Genialidade - Assessment Dashboard
**Stack**: Next.js 14, TypeScript, Supabase, Tailwind CSS
**GitHub Integration**: siriustrategy/siriusclaude (already initialized)

**Database Credentials** (to be provided during setup):
- Supabase Project URL
- Supabase Anon Key
- Tables: organizations, users, assessments, genius_profiles, squad_recommendations, genius_zone_blueprints, chat_responses, audit_logs

---

## 🔐 AUTHENTICATION SYSTEM

### Dual-Role Authentication
**Two User Types**:
1. **Colaborador**: Assessment taker
   - Can access: Own assessments, own results, squad page
   - Cannot: Manage users, see other assessments

2. **Gestor**: Team manager
   - Can access: All team member assessments, analytics, invitations
   - Can manage: User invitations, view team results dashboard

### Auth Flow
1. **Login Page**: Email + Password (Supabase Auth)
2. **Register Page**: Full Name + Email + Organization Name + Password
   - Auto-creates organization on first registration (admin/gestor)
   - Subsequent registrations join existing org

---

## 🏠 LAYOUT STRUCTURE

### Header (Consistent across all pages)
- Logo (left) - clickable to dashboard
- Navigation (center):
  - Dashboard | Assessment | Results | Squad (if completed)
  - For Gestor: + "Team Analytics" | "Manage Users"
- User Profile (right):
  - Avatar + Name
  - Dropdown: Profile | Settings | Logout

### Navigation States
- Active link: Blue (#2855FF) with underline
- Inactive link: Gray (#666666)
- Hover: Light blue background (#E8F0FF)

---

## 📱 PAGE SPECIFICATIONS

### 1. HOME PAGE (`/`)
**Purpose**: Landing + Login/Register
**Layout**: Two-column responsive
- **Left Column** (50% on desktop, 100% mobile):
  - Memorial Mais Logo (large)
  - "🧠 Zona de Genialidade"
  - Tagline: "Descubra seu potencial único e crie seu caminho de sucesso"
  - Features list (bullet points with blue dots):
    - ✓ Assessment baseado em 7 frameworks
    - ✓ Profil de genialidade personalizado
    - ✓ Recomendações de squad
    - ✓ Plano 90 dias implementação

- **Right Column** (Login/Register Card):
  - White card on light gray background
  - Blue-accented tabs: "Entrar | Registrar"
  - Form fields with placeholders
  - Blue CTA button (rounded pill shape)
  - Alternative: "Continuar com Google"

**Colors**:
- Background: Linear gradient white → light gray
- Card: White with subtle shadow
- CTA Button: #2855FF with hover state #1F40CC

---

### 2. ASSESSMENT PAGE (`/dashboard/assessment`)
**Purpose**: 5-section form with progress

**Header Section**:
- Progress bar: "Seção X de 5" (numerical progress + visual bar)
- Title + description for current section
- Progress bar color: Blue (#2855FF)

**Form Layout**:
- Max-width: 600px centered
- Background: White with light gray container
- Section card: White with padding 40px
- Spacing: 32px between form groups

**Form Components**:
1. **Text Input**:
   - Border: 1px light gray (#E0E0E0)
   - Focus: Blue border (#2855FF)
   - Placeholder text: Medium gray
   - Padding: 12px 16px
   - Border-radius: 8px

2. **Textarea**:
   - Same styling as text input
   - Min-height: 100px
   - Resize: Vertical

3. **Select/Dropdown**:
   - Same border styling
   - Blue checkmark icon
   - Option hover: Light blue background

4. **Checkbox** (for multi-select):
   - Blue checkmark (#2855FF)
   - Label text: Gray (#666666)

**Validation**:
- Error message: Red (#DC2626) below field
- Success state: Green checkmark
- Info boxes: Light blue (#E8F0FF) background with blue icon

**Navigation Buttons**:
- "← Voltar": Gray button, white text, rounded pill
- "Próximo →": Blue button (#2855FF), white text, rounded pill
- On Section 5: "🎉 Enviar e Ver Resultados" (blue CTA)
- Button styling: 12px height, 24px padding horizontal, 8px radius

**Section-Specific Details**:

#### Section 1: Contexto (Basic Info)
- Full Name, Email, Organization, Role
- Background info about user

#### Section 2: Atividades (Activities)
- Checkboxes for activities (Don Clifton StrengthsFinder)
- Multi-select with visual feedback

#### Section 3: Talentos (Talents/Strengths)
- Text fields for strength descriptions
- Textarea for narrative

#### Section 4: Negócio (Business Model)
- Wealth Dynamics profile selector
- Risk tolerance dropdown
- Team preference slider

#### Section 5: Visão (Vision & Goals)
- 90-day vision textarea
- Revenue goal input
- Blocking factors textarea
- Available time per week selector
- AI proficiency level selector
- Info box: "✅ Parabéns! Você está prestes a completar..."

**Save Indicator**:
- "Salvando progresso..." text appears during submission
- Gray text, small font, center-aligned below form

---

### 3. RESULTS PAGE (`/dashboard/results/:assessmentId`)
**Purpose**: Show Genius Profile + Recommendations

**Layout**: Three-column (desktop), single column (mobile)

**Column 1: Genius Profile**
- Card: White background, blue top border (4px)
- Title: "🧠 Seu Perfil Genius"
- Profile name: Bold blue (#2855FF)
- Framework breakdown (7 frameworks):
  - Each as mini-card with:
    - Framework icon
    - Score/Level
    - 2-3 key insights
    - Blue accent bar on left
- Personal narrative: Italic gray text
- Strength summary: Bulleted list with blue dots

**Column 2: Squad Recommendations**
- Card: White background, gradient top border (blue → light blue)
- Title: "👥 Seu Squad Ideal"
- Squad composition:
  - Each role as individual card:
    - Role icon
    - Profile type
    - How you complement them
    - Color-coded by archetype
- "Próximos Passos": Button to invite squad members or connect

**Column 3: Blueprint**
- Card: White background, green top border (or accent color)
- Title: "🎯 Seu Blueprint 90 Dias"
- Sections:
  - Objetivo Primário (big blue #2855FF text)
  - Blockers to Address
  - Daily/Weekly Practices
  - Metrics to Track
  - Resources Needed
- CTA: "Compartilhar Blueprint" (blue button)

**Print/Export**:
- "📥 Baixar Relatório" button (gray outline)
- Exports PDF with all three sections
- Logo + date on PDF

**Sharing Options**:
- "🔗 Compartilhar Resultado" modal with:
  - Unique link generation
  - Email invitation form
  - WhatsApp share button
  - Copy link to clipboard

---

### 4. TEAM ANALYTICS PAGE (Gestor only) (`/dashboard/team`)
**Purpose**: View all team member assessments

**Header**:
- "📊 Analytics da Equipe"
- Dropdown filter: "Todos | Completados | Em Progresso"
- Search bar: Find team member

**Main Content**: Grid/Table of assessments
- **Columns**:
  - Name (clickable to individual result)
  - Profile Type (color-coded)
  - Progress (visual progress bar blue)
  - Status (badge: Completo/Em Progresso/Não Iniciado)
  - Date Completed
  - Action: View Results

**Aggregated Insights** (above table):
- Cards showing:
  - Total team members
  - Assessments completed
  - Average profile type
  - Top 3 patterns

---

### 5. USER MANAGEMENT PAGE (Gestor only) (`/dashboard/manage-users`)
**Purpose**: Invite and manage team members

**Layout**:
- **Left**: Invitation form
  - "📨 Convidar Novo Membro"
  - Email input field
  - Role selector: Colaborador | Gestor
  - "Enviar Convite" blue button
  - Success message: Green badge with email

- **Right**: Current team members list
  - Table with Name | Email | Role | Joined Date | Actions
  - Actions: Edit Role | Remove | Resend Invite (if not joined)
  - Confirmation modal for remove action

---

## 🎯 BRANDING-SPECIFIC UI COMPONENTS

### Buttons
**Primary CTA** (Blue Pill):
```
Background: #2855FF
Text: White, Semibold (600)
Padding: 12px 32px
Border-radius: 24px
Hover: #1F40CC (darker blue)
Active: #1530AA (even darker)
Transition: all 0.2s ease
```

**Secondary Button** (Gray Outline):
```
Background: Transparent
Border: 2px #E0E0E0
Text: #666666
Padding: 12px 32px
Border-radius: 24px
Hover: Light gray background (#F5F5F5)
```

### Cards
```
Background: White
Border: None (or 1px #E8E8E8 on edges)
Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
Border-radius: 12px
Padding: 24px
```

### Progress Bar
```
Background: Light gray (#E8E8E8)
Fill: Blue (#2855FF)
Height: 6px
Border-radius: 3px
Animation: Smooth fill transition
```

### Icons
- Use Feather Icons or Heroicons (minimal style matching Rio Mais)
- Color: Blue (#2855FF) for active, Gray (#999999) for inactive
- Size: 24px default, 32px for large sections

### Spacing System
- Base unit: 8px
- Use 8px, 16px, 24px, 32px, 40px
- Margins between sections: 32px
- Margins within sections: 16px
- Padding in containers: 24px-40px

---

## ✨ SPECIAL EFFECTS & MICRO-INTERACTIONS

### Transitions
- Button hover: 0.2s ease
- Card hover: Shadow increase (2px → 8px)
- Form focus: Border color change with smooth transition
- Page transitions: Fade in 0.3s

### Loading States
- Progress indicator: Blue animated spinner
- Skeleton loading: Gray placeholder boxes with pulse animation
- Text: "Carregando..." in gray

### Success/Error States
- **Success**: Green checkmark (#10B981), message in green
- **Error**: Red X (#DC2626), message in red with light red background
- **Warning**: Orange/amber (#F59E0B)
- **Info**: Blue info circle (#2855FF) with light blue background

### Empty States
- Illustration: Simple line drawing
- Message: "Nenhum resultado ainda" in gray
- CTA: "Começar Assessment" in blue

---

## 📐 RESPONSIVE DESIGN

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adaptations
- Single column layout for all pages
- Navigation: Hamburger menu (blue icon)
- Buttons: Full width on mobile (with padding)
- Forms: Larger touch targets (min 44px height)
- Progress bar: Horizontal bar with percentage text

### Desktop Optimizations
- Multi-column layouts as specified
- Sidebar navigation (collapsible)
- Hover states for all interactive elements
- Max-width containers: 1200px

---

## 🔒 SECURITY & DATA HANDLING

### Form Data
- All sensitive data encrypted in transit (HTTPS)
- Server-side validation required
- XSS protection on all inputs
- CSRF tokens on forms

### Authentication
- Supabase Auth integration
- Session tokens stored securely
- Auto-logout after 30 minutes inactivity
- Password requirements: Min 8 chars, 1 uppercase, 1 number

### RLS Policies
- Colaborador: Can only view own assessments
- Gestor: Can view all team assessments
- Admin: Full access

---

## 🔄 WORKFLOW INTEGRATION

### Assessment Flow
1. User logs in (or registers)
2. Redirected to `/dashboard/assessment`
3. Completes 5 sections with auto-save
4. Final submit triggers:
   - Assessment marked as "completo"
   - Genius profile generated
   - Squad recommendations generated
   - Blueprint created
   - User redirected to `/dashboard/results/:assessmentId`

### Team Workflow (Gestor)
1. Gestor logs in
2. Can see `/dashboard/team` tab
3. Invites team members via `/dashboard/manage-users`
4. Team members receive email invite
5. Team members complete assessment
6. Gestor can view all results in analytics

---

## 📤 GITHUB INTEGRATION

**Repository**: siriustrategy/siriusclaude
**Branch**: Connect Lovable to `main` branch
**Auto-deploy**: Enable Vercel integration for auto-deploy on commits
**Environment Variables**: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## 🎨 DESIGN TOKENS SUMMARY

| Token | Value | Usage |
|-------|-------|-------|
| `color-primary` | #2855FF | Buttons, links, accents |
| `color-dark` | #2C2C2C | Headings, logo |
| `color-gray-medium` | #666666 | Body text |
| `color-gray-light` | #F0F0F0 | Section backgrounds |
| `color-white` | #FFFFFF | Main background |
| `border-radius-sm` | 8px | Input fields, small elements |
| `border-radius-md` | 12px | Cards |
| `border-radius-lg` | 24px | Buttons (pill shape) |
| `shadow-sm` | 0 2px 8px rgba(0,0,0,0.08) | Cards |
| `font-sans` | Inter, Segoe UI | All text |
| `font-weight-bold` | 700 | Headings |
| `font-weight-semibold` | 600 | CTA text |
| `font-weight-regular` | 400 | Body text |

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Logo implemented (responsive SVG)
- [ ] Color system applied globally
- [ ] Typography hierarchy implemented
- [ ] Authentication flow (login/register)
- [ ] Assessment pages (Section 1-5)
- [ ] Results display (Profile + Squad + Blueprint)
- [ ] Team analytics (Gestor only)
- [ ] User management (Gestor only)
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Form validation & error handling
- [ ] Loading states & empty states
- [ ] GitHub integration verified
- [ ] Database connection tested
- [ ] Security review passed
- [ ] Performance optimization done
- [ ] Browser compatibility tested (Chrome, Safari, Firefox, Edge)

---

## 🚀 NEXT STEPS

1. Copy this prompt into Lovable's project creation wizard
2. Lovable will generate the initial project structure
3. You'll review and approve the generated design
4. Make manual adjustments as needed
5. Connect to GitHub repository (siriustrategy/siriusclaude)
6. Deploy to Vercel with Supabase integration
7. Test complete workflow end-to-end
8. Invite team members and gather feedback

---

**Created by**: Claude Code AIOS
**Based on**: Rio Mais Memorial brand guidelines + Genius Zone Assessment requirements
**Last Updated**: 2026-02-24
