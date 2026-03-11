'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, ChevronRight, ChevronLeft, Check, Copy,
  Zap, Star, Users, Layers, Palette, GitBranch, Plug,
  Sparkles, History, RefreshCw, Eye, TrendingUp, LayoutTemplate,
  ShoppingCart, BarChart2, Calendar, MessageSquare, CreditCard,
  BookOpen, Globe, Briefcase, Heart, Camera,
} from 'lucide-react'

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5
type TabId = 'novo' | 'templates' | 'melhorar' | 'historico'

interface WizardData {
  visao: string; publico: string; funcionalidades: string
  design: string; fluxos: string; integracoes: string
}

interface Template {
  id: string
  title: string
  description: string
  category: string
  icon: React.ElementType
  color: string
  score: number
  tags: string[]
  data: WizardData
}

function calcQuality(data: WizardData) {
  const filled = Object.values(data).filter(v => v.trim().length > 20).length
  if (filled >= 5) return { score: 95, label: 'Excelente', color: '#25D366' }
  if (filled >= 4) return { score: 78, label: 'Ótimo',     color: '#06b6d4' }
  if (filled >= 3) return { score: 60, label: 'Bom',       color: '#f59e0b' }
  return           { score: 30, label: 'Básico',            color: '#ef4444' }
}

const STEPS = [
  { id: 0, label: 'Visão',           icon: Star,      color: '#3B5BDB', key: 'visao'           as keyof WizardData, subtitle: 'Qual é o produto?',        placeholder: 'Descreva o app/site em 1-2 frases. Ex: "Um app para gestores de academia controlarem frequência dos alunos e pagamentos mensais."' },
  { id: 1, label: 'Público',         icon: Users,     color: '#7C3AED', key: 'publico'          as keyof WizardData, subtitle: 'Para quem é?',             placeholder: 'Ex: "Donos de academias pequenas, 30-55 anos, sem muita familiaridade com tecnologia."' },
  { id: 2, label: 'Funcionalidades', icon: Layers,    color: '#06b6d4', key: 'funcionalidades'  as keyof WizardData, subtitle: 'O que ele faz?',           placeholder: 'Liste as funcionalidades. Ex: "1) Dashboard com alunos ativos 2) Checkin via QR code 3) Cobranças via Stripe."' },
  { id: 3, label: 'Design',          icon: Palette,   color: '#a855f7', key: 'design'           as keyof WizardData, subtitle: 'Como vai ser visualmente?', placeholder: 'Ex: "Dark mode, minimalista. Cores: #080C18 fundo, #3B5BDB primária. Fonte: Space Grotesk."' },
  { id: 4, label: 'Fluxos',          icon: GitBranch, color: '#f59e0b', key: 'fluxos'           as keyof WizardData, subtitle: 'Como o usuário navega?',   placeholder: 'Ex: "1) Aluno chega → abre app → escaneia QR → checkin registrado. 2) Admin abre dashboard → vê lista."' },
  { id: 5, label: 'Integrações',     icon: Plug,      color: '#10b981', key: 'integracoes'      as keyof WizardData, subtitle: 'Quais ferramentas usar?',  placeholder: 'Ex: "Supabase (banco + auth), Stripe (pagamentos), shadcn/ui (componentes), Resend (emails)."' },
]

const TEMPLATES: Template[] = [
  {
    id: 'saas-crm',
    title: 'CRM para Agências',
    description: 'Gestão de clientes, pipeline de vendas e relatórios de performance.',
    category: 'SaaS',
    icon: Briefcase,
    color: '#3B5BDB',
    score: 94,
    tags: ['CRM', 'Pipeline', 'Relatórios'],
    data: {
      visao: 'Um CRM completo para agências de marketing gerenciarem clientes, oportunidades de venda, contratos e performance de campanhas em um só lugar.',
      publico: 'Donos e gestores de agências de marketing digital, 28-45 anos, que usam planilhas e precisam de uma solução organizada para acompanhar clientes e receita.',
      funcionalidades: '1) Dashboard com MRR e pipeline de oportunidades\n2) Cadastro de clientes com histórico completo\n3) Kanban de oportunidades com etapas customizáveis\n4) Registro de interações (calls, emails, reuniões)\n5) Geração de propostas em PDF\n6) Relatório de performance por cliente\n7) Alerta de renovação de contratos\n8) Multi-usuário com permissões por papel',
      design: 'Dark mode profissional. Cores: #080C18 fundo, #3B5BDB primária, #7C3AED acento. Fonte: Space Grotesk (títulos), DM Sans (corpo). Cards com glass morphism sutil. Sidebar colapsável.',
      fluxos: '1) Login → Dashboard com métricas → Clientes → Detalhe do cliente\n2) Nova oportunidade → Formulário → Kanban → Fechar deal\n3) Criar proposta → Selecionar cliente → Preencher serviços → Gerar PDF\n4) Relatório → Filtrar por período/cliente → Exportar CSV',
      integracoes: 'Supabase (banco + auth + RLS por workspace), Stripe (assinaturas), Resend (emails automáticos), React PDF (propostas), shadcn/ui (componentes), Framer Motion (animações), Recharts (gráficos).',
    },
  },
  {
    id: 'landing-page',
    title: 'Landing Page SaaS',
    description: 'Página de vendas com hero, features, pricing e CTA otimizado.',
    category: 'Marketing',
    icon: Globe,
    color: '#06b6d4',
    score: 91,
    tags: ['Landing', 'Vendas', 'Conversão'],
    data: {
      visao: 'Landing page de alta conversão para um produto SaaS, com seções de hero impactante, features, depoimentos, pricing e call-to-action focado em trial gratuito.',
      publico: 'Visitantes frios vindos de anúncios e redes sociais. Empreendedores e gestores de 25-45 anos que buscam solução para um problema específico.',
      funcionalidades: '1) Hero com headline + subheadline + botão CTA + mockup animado\n2) Seção de logos de clientes (social proof)\n3) Features com ícones e descrições curtas\n4) Comparação Antes x Depois\n5) Depoimentos em carrossel\n6) Tabela de preços com toggle mensal/anual\n7) FAQ accordion\n8) Footer com links e newsletter\n9) Formulário de email para captura de leads',
      design: 'Dark mode premium. Gradiente de fundo: #080C18 para #0D1225. Acento ciano #06b6d4. Headlines em Space Grotesk 700+. Efeito de grid no fundo (grid de pontos). Animações de entrada com Framer Motion. Botões com glow neon.',
      fluxos: '1) Visitante chega → Hero → scrolla → Features → Depoimentos → Pricing → CTA\n2) Clica em Trial → Modal de cadastro → Redireciona para app\n3) Clica em Pricing → Âncora para seção → Clica em plano → Modal de checkout',
      integracoes: 'Supabase (leads/newsletter), Stripe (checkout), Resend (email de boas-vindas), Framer Motion (animações), shadcn/ui, Lucide React.',
    },
  },
  {
    id: 'ecommerce',
    title: 'Loja Virtual',
    description: 'E-commerce completo com catálogo, carrinho, checkout e painel admin.',
    category: 'E-commerce',
    icon: ShoppingCart,
    color: '#f59e0b',
    score: 92,
    tags: ['Loja', 'Produtos', 'Checkout'],
    data: {
      visao: 'Loja virtual completa para venda de produtos físicos ou digitais, com catálogo, busca, filtros, carrinho, checkout integrado e painel administrativo.',
      publico: 'Consumidores de 18-50 anos comprando online via desktop e mobile. Lojistas que precisam gerenciar estoque e pedidos de forma simples.',
      funcionalidades: '1) Catálogo com grid de produtos e filtros (categoria, preço, avaliação)\n2) Página de produto com galeria, variantes (cor/tamanho) e avaliações\n3) Carrinho persistente com contador no header\n4) Checkout em 3 etapas (endereço → pagamento → confirmação)\n5) Área do cliente (pedidos, endereços, favoritos)\n6) Painel admin (produtos, estoque, pedidos, relatórios)\n7) Busca com autocomplete\n8) Cupons de desconto',
      design: 'Light mode limpo com modo dark opcional. Cores: branco #FFFFFF fundo, #1a1a2e escura, primária #f59e0b. Fonte: Inter. Imagens de produto em destaque. Botão "Adicionar ao carrinho" sempre visível.',
      fluxos: '1) Home → Catálogo → Produto → Adicionar ao carrinho → Checkout → Confirmação\n2) Login → Área do cliente → Ver pedidos → Rastrear entrega\n3) Admin → Listar produtos → Editar produto → Atualizar estoque',
      integracoes: 'Supabase (banco + auth + storage para imagens), Stripe (pagamentos + webhooks), Resend (confirmação de pedido), shadcn/ui, React Hook Form, Zod, Framer Motion.',
    },
  },
  {
    id: 'dashboard-analytics',
    title: 'Dashboard Analytics',
    description: 'Painel de métricas com gráficos, KPIs e relatórios em tempo real.',
    category: 'Analytics',
    icon: BarChart2,
    color: '#7C3AED',
    score: 93,
    tags: ['Métricas', 'Gráficos', 'KPIs'],
    data: {
      visao: 'Dashboard de analytics para empresas acompanharem KPIs de negócio em tempo real, com gráficos interativos, comparações de período e exportação de relatórios.',
      publico: 'Gestores, analistas e diretores de empresas de médio porte, 30-50 anos, que precisam de visibilidade sobre performance de vendas, marketing e operações.',
      funcionalidades: '1) Overview com cards de KPIs principais (receita, crescimento, usuários, churn)\n2) Gráficos de linha/barra interativos com Recharts\n3) Filtro por período (7d, 30d, 90d, custom)\n4) Comparação com período anterior\n5) Tabela de top performers (produtos, clientes, campanhas)\n6) Mapa de calor por hora/dia\n7) Alertas automáticos quando KPI cai abaixo do threshold\n8) Export CSV/PDF\n9) Multi-fonte de dados (conectores)',
      design: 'Dark mode professional. Cores: #080C18 fundo, #7C3AED primária, #06b6d4 acento. Gráficos com cores vibrantes e tooltips customizados. Layout 12 colunas. Cards com bordas sutis.',
      fluxos: '1) Login → Overview → Clica em gráfico → Drill-down detalhado\n2) Filtrar período → Ver comparação → Exportar relatório\n3) Configurar alertas → Receber email quando threshold atingido',
      integracoes: 'Supabase (banco + real-time), Recharts (gráficos), React PDF (relatórios), Resend (alertas), date-fns, shadcn/ui, Framer Motion.',
    },
  },
  {
    id: 'agendamento',
    title: 'App de Agendamento',
    description: 'Reservas online com calendário, confirmação e lembretes automáticos.',
    category: 'Serviços',
    icon: Calendar,
    color: '#10b981',
    score: 89,
    tags: ['Agenda', 'Reservas', 'Lembretes'],
    data: {
      visao: 'App de agendamento online para prestadores de serviços (clínicas, salões, consultores) onde clientes reservam horários sem telefonema, com confirmação automática.',
      publico: 'Clientes finais de qualquer idade usando celular. Prestadores de serviços (dentistas, cabeleireiros, coaches) que querem eliminar o telefone para agendamentos.',
      funcionalidades: '1) Calendário público com horários disponíveis\n2) Seleção de serviço + profissional + horário\n3) Cadastro rápido (nome, email, telefone)\n4) Confirmação por email e WhatsApp\n5) Lembrete 24h e 1h antes\n6) Reagendamento/cancelamento pelo cliente\n7) Painel do prestador (agenda do dia, histórico, bloqueio de horários)\n8) Integração com Google Calendar\n9) Relatório de no-shows e conversões',
      design: 'Light e dark mode. Cores: #10b981 primária (verde saúde/confiança). Calendario limpo e acessível. Mobile-first. Botões grandes para touch. Confirmação com animação de sucesso.',
      fluxos: '1) Cliente acessa link → Escolhe serviço → Escolhe data/hora → Confirma dados → Recebe confirmação\n2) Prestador abre painel → Vê agenda do dia → Bloqueia horário → Confirma presença\n3) Lembrete dispara → Cliente clica → Reagendar ou confirmar',
      integracoes: 'Supabase (banco + auth), Resend (emails), Twilio (SMS/WhatsApp), Google Calendar API, date-fns, shadcn/ui, React Hook Form.',
    },
  },
  {
    id: 'comunidade',
    title: 'Plataforma de Comunidade',
    description: 'Fórum e área de membros com posts, comentários e perfis.',
    category: 'Comunidade',
    icon: MessageSquare,
    color: '#a855f7',
    score: 87,
    tags: ['Fórum', 'Membros', 'Posts'],
    data: {
      visao: 'Plataforma de comunidade privada para criadores de conteúdo ou empresas manterem sua base engajada com fórum, posts, eventos e área exclusiva de membros.',
      publico: 'Membros pagantes de uma comunidade, 20-45 anos, que buscam networking, aprendizado e acesso a conteúdo exclusivo. Criador que quer monetizar sua audiência.',
      funcionalidades: '1) Feed de posts com curtidas, comentários e compartilhamento\n2) Categorias/canais temáticos\n3) Perfil de membro com conquistas e badges\n4) Mensagens diretas (DM)\n5) Eventos com RSVP\n6) Área de recursos (arquivos, links, templates)\n7) Notificações em tempo real\n8) Mural de destaque dos membros mais ativos\n9) Painel admin com moderação',
      design: 'Dark mode. Cores: #a855f7 primária, #080C18 fundo. Estilo similar ao Discord/Circle. Avatar arredondado. Posts com card elevado. Sidebar com canais.',
      fluxos: '1) Login → Feed → Ver post → Comentar → Receber notificação de resposta\n2) Criar post → Escolher canal → Adicionar mídia → Publicar\n3) Admin → Moderar → Banir → Promover membro',
      integracoes: 'Supabase (banco + auth + real-time), Stripe (assinaturas), Resend (notificações), shadcn/ui, Framer Motion, React Query.',
    },
  },
  {
    id: 'curso-online',
    title: 'Plataforma de Cursos',
    description: 'EAD com módulos, vídeos, certificados e progresso do aluno.',
    category: 'Educação',
    icon: BookOpen,
    color: '#f97316',
    score: 90,
    tags: ['EAD', 'Vídeos', 'Certificado'],
    data: {
      visao: 'Plataforma EAD para criadores venderem e entregarem cursos online com módulos em vídeo, quizzes, trilha de progresso e emissão de certificado ao concluir.',
      publico: 'Alunos de 18-40 anos buscando capacitação profissional. Criadores de cursos que precisam de uma plataforma white-label para hospedar e vender seu conteúdo.',
      funcionalidades: '1) Catálogo de cursos com thumbnails e avaliações\n2) Player de vídeo customizado com progresso salvo\n3) Módulos e aulas organizados em árvore\n4) Quiz por módulo com pontuação\n5) Barra de progresso geral do curso\n6) Certificado PDF gerado automaticamente\n7) Comentários por aula\n8) Painel do instrutor (upload, analytics, alunos)\n9) Acesso por assinatura ou compra única',
      design: 'Híbrido light/dark. Player em dark, resto em light suave. Primária #f97316. Thumbnails em 16:9. Barra de progresso animada. Certificado elegante com QR code de validação.',
      fluxos: '1) Aluno → Catálogo → Comprar → Acessar curso → Assistir aula → Marcar como concluída\n2) Concluir módulo → Quiz → Passar → Próximo módulo\n3) Concluir curso → Tela de parabéns → Download de certificado',
      integracoes: 'Supabase (banco + auth + storage para vídeos), Stripe (pagamentos), Mux ou Cloudflare Stream (vídeo), React PDF (certificados), Resend, shadcn/ui.',
    },
  },
  {
    id: 'app-financas',
    title: 'App de Finanças Pessoais',
    description: 'Controle de gastos, metas de economia e gráficos de evolução.',
    category: 'Fintech',
    icon: CreditCard,
    color: '#25D366',
    score: 88,
    tags: ['Finanças', 'Orçamento', 'Metas'],
    data: {
      visao: 'App de finanças pessoais para controle de receitas e despesas, categorização automática, metas de economia e visão clara de onde o dinheiro está indo.',
      publico: 'Adultos de 22-45 anos que querem organizar as finanças mas acham planilhas complicadas. Pessoas com renda variável ou que querem juntar dinheiro para um objetivo.',
      funcionalidades: '1) Dashboard com saldo atual, receitas e despesas do mês\n2) Lançamento de transações (receita/despesa/transferência)\n3) Categorias customizáveis com ícones e cores\n4) Gráficos de pizza por categoria e linha temporal\n5) Metas de economia com progresso visual\n6) Alertas de orçamento por categoria\n7) Relatório mensal em PDF\n8) Importar extrato bancário (CSV OFX)\n9) Multi-conta (corrente, poupança, investimentos)',
      design: 'Dark mode financeiro. Verde #25D366 para receitas, vermelho #ef4444 para despesas. Fonte: DM Sans. Cards com valores grandes e legíveis. Gráficos limpos sem decoração.',
      fluxos: '1) Home → Ver resumo → Adicionar transação → Categorizar → Confirmar\n2) Criar meta → Definir valor → Acompanhar progresso → Comemorar ao atingir\n3) Ver relatório → Filtrar mês → Exportar PDF',
      integracoes: 'Supabase (banco + auth + RLS por usuário), React PDF (relatórios), Recharts (gráficos), date-fns, Zod, React Hook Form, shadcn/ui.',
    },
  },
  {
    id: 'portfolio-creativo',
    title: 'Portfólio Criativo',
    description: 'Site pessoal para fotógrafos, designers e artistas com galeria e contato.',
    category: 'Portfólio',
    icon: Camera,
    color: '#ec4899',
    score: 86,
    tags: ['Portfólio', 'Galeria', 'Contato'],
    data: {
      visao: 'Site portfólio premium para fotógrafos, designers ou artistas visuais apresentarem seus trabalhos com galeria dinâmica, sobre, serviços e formulário de contato.',
      publico: 'Potenciais clientes (agências, empresas, noivos para fotógrafo) buscando um profissional criativo. Visitante que chegou por indicação ou redes sociais.',
      funcionalidades: '1) Hero com foto/vídeo de fundo e nome em destaque\n2) Galeria masonry com lightbox para ampliar imagens\n3) Filtros por categoria de projeto\n4) Página de projeto individual com detalhes e história\n5) Seção Sobre com bio e conquistas\n6) Seção Serviços e Pacotes com preços\n7) Formulário de contato com notificação por email\n8) Integração com Instagram (últimas fotos)\n9) Blog/diário criativo (opcional)',
      design: 'Elegante e minimalista. Dark ou light conforme nicho. Tipografia forte (Playfair Display para nome). As imagens são protagonistas. Hover effects suaves. Scroll animations com Framer Motion.',
      fluxos: '1) Visitante → Hero → Rola → Galeria → Clica projeto → Lightbox ou detalhe\n2) Serviços → Ver pacotes → Formulário de contato → Receber resposta\n3) Instagram widget → Ver perfil → Seguir',
      integracoes: 'Supabase Storage (imagens), Resend (formulário de contato), Instagram Basic API (feed), Framer Motion, shadcn/ui, next/image.',
    },
  },
  {
    id: 'saas-marketing',
    title: 'Plataforma de Marketing',
    description: 'Gestão de campanhas, disparo de emails e analytics integrados.',
    category: 'SaaS',
    icon: TrendingUp,
    color: '#3B5BDB',
    score: 96,
    tags: ['Campanhas', 'Email', 'Analytics'],
    data: {
      visao: 'Plataforma de marketing automation para PMEs gerenciarem campanhas de email, SMS e social media em um só lugar, com analytics de performance e segmentação de audiência.',
      publico: 'Profissionais de marketing e donos de negócio de 25-45 anos que precisam automatizar comunicação com clientes sem precisar de múltiplas ferramentas caras.',
      funcionalidades: '1) Dashboard com métricas de campanhas (abertura, clique, conversão)\n2) Editor de email drag-and-drop com templates\n3) Segmentação de contatos por tags e comportamento\n4) Automações de gatilho (boas-vindas, carrinho abandonado, aniversário)\n5) A/B testing de assunto e conteúdo\n6) Agendamento de envios\n7) Lista negra e gerenciamento de descadastros\n8) Relatório de ROI por campanha\n9) Integração com CRM e e-commerce',
      design: 'Dark mode profissional. Cores: #3B5BDB primária, #7C3AED acento. Interface limpa inspirada no Mailchimp mas mais moderno. Tabelas densas com hover states. Editor de email em iframe isolado.',
      fluxos: '1) Nova campanha → Selecionar lista → Escolher template → Editar → Agendar → Enviar\n2) Ver relatório → Drill-down por campanha → Ver quem abriu → Exportar\n3) Criar automação → Definir gatilho → Construir fluxo → Ativar',
      integracoes: 'Supabase (banco + auth + RLS por workspace), Resend (envio de emails), Twilio (SMS), Stripe (planos), React Email, shadcn/ui, Recharts.',
    },
  },
  {
    id: 'app-saude',
    title: 'App de Saúde & Bem-estar',
    description: 'Tracker de hábitos, hidratação, sono e humor com gamificação.',
    category: 'Saúde',
    icon: Heart,
    color: '#ef4444',
    score: 85,
    tags: ['Hábitos', 'Tracker', 'Gamificação'],
    data: {
      visao: 'App de saúde e bem-estar para acompanhamento diário de hábitos, hidratação, qualidade do sono e humor, com gamificação para manter a consistência.',
      publico: 'Adultos de 20-40 anos interessados em saúde e autodesenvolvimento. Pessoas com metas específicas (perder peso, meditar, beber mais água, dormir melhor).',
      funcionalidades: '1) Check-in diário de hábitos customizáveis\n2) Tracker de hidratação com lembretes\n3) Registro de sono (horário, qualidade, notas)\n4) Diário de humor com emojis\n5) Streak de dias consecutivos com celebração\n6) Badges e conquistas desbloqueáveis\n7) Gráficos de consistência semanal/mensal\n8) Definição de metas semanais\n9) Compartilhar progresso (opcional)',
      design: 'Light mode vibrante com modo dark. Cores graduadas por humor (verde bem, amarelo médio, vermelho ruim). Ilustrações minimalistas. Animações de celebração ao completar streak. Fonte arredondada (Nunito).',
      fluxos: '1) Abrir app → Check-in matinal → Marcar hábitos → Ver streak\n2) Adicionar hábito → Definir frequência + lembrete → Ativar\n3) Ver relatório semanal → Identificar padrão → Ajustar meta',
      integracoes: 'Supabase (banco + auth + real-time), Push notifications (Expo se mobile, service workers se web), date-fns, Recharts, shadcn/ui, Framer Motion.',
    },
  },
  {
    id: 'marketplace',
    title: 'Marketplace de Serviços',
    description: 'Plataforma para conectar prestadores de serviço com clientes.',
    category: 'Marketplace',
    icon: Users,
    color: '#06b6d4',
    score: 91,
    tags: ['Marketplace', 'Freelancers', 'Matching'],
    data: {
      visao: 'Marketplace para conectar prestadores de serviços freelance (designers, devs, redatores) com clientes que precisam de projetos, com sistema de proposta, pagamento seguro e avaliações.',
      publico: 'Freelancers de 20-40 anos buscando trabalho e clientes empresariais que precisam de serviços pontuais sem contratar CLT.',
      funcionalidades: '1) Cadastro duplo (freelancer / cliente)\n2) Perfil de freelancer com portfólio, skills e reviews\n3) Busca e filtros avançados (categoria, preço, prazo, avaliação)\n4) Publicação de projeto pelo cliente\n5) Sistema de propostas dos freelancers\n6) Chat interno entre as partes\n7) Pagamento em escrow (liberado ao concluir)\n8) Sistema de avaliação mútua\n9) Painel admin com disputas e comissões',
      design: 'Light mode confiável. Azul #06b6d4 primário. Estilo inspirado no Workana mas mais moderno. Fotos de perfil em destaque. Rating com estrelas. Badges de verificado.',
      fluxos: '1) Cliente → Publica projeto → Recebe propostas → Escolhe freelancer → Paga → Entrega → Avalia\n2) Freelancer → Busca projetos → Envia proposta → Aceito → Entrega → Recebe pagamento\n3) Disputa → Admin media → Resolve → Libera ou devolve',
      integracoes: 'Supabase (banco + auth + real-time para chat), Stripe Connect (pagamentos marketplace com split), Resend (notificações), shadcn/ui, React Hook Form, Zod.',
    },
  },
]

const CATEGORIES = ['Todos', 'SaaS', 'Marketing', 'E-commerce', 'Analytics', 'Serviços', 'Comunidade', 'Educação', 'Fintech', 'Portfólio', 'Saúde', 'Marketplace']

const historyItems = [
  { id: '1', title: 'App academia — Controle de alunos',   date: 'hoje',     score: 92, steps: 6 },
  { id: '2', title: 'Landing page — Sirius Academy v2',    date: 'ontem',    score: 88, steps: 5 },
  { id: '3', title: 'Dashboard CRM — Agência marketing',   date: '3 dias',   score: 95, steps: 6 },
  { id: '4', title: 'App de agenda — Clínica de estética', date: '1 semana', score: 79, steps: 4 },
]

function generatePrompt(data: WizardData): string {
  return `# Prompt Lovable.dev — Sirius Architect

## VISÃO
${data.visao || '[Preencha a visão]'}

## PÚBLICO-ALVO
${data.publico || '[Descreva o público]'}

## FUNCIONALIDADES
${data.funcionalidades || '[Liste as funcionalidades]'}

## DESIGN SYSTEM
${data.design || '[Defina o visual]'}
Regras: NUNCA emojis na UI — sempre Lucide React. Cores em HEX. Dark mode padrão.

## FLUXOS DE USUÁRIO
${data.fluxos || '[Descreva os fluxos]'}

## STACK & INTEGRAÇÕES
${data.integracoes || '[Liste integrações]'}
Stack: Next.js 14 + Tailwind + shadcn/ui + Supabase (RLS obrigatório) + React Hook Form + Framer Motion.

## REGRAS PARA O LOVABLE
1. Comece pelo layout base antes de qualquer feature
2. Use shadcn/ui quando disponível — não reinvente
3. Cada tela: loading + empty state + error state
4. RLS no Supabase para todos os dados do usuário
5. Secrets apenas em .env.local`
}

export default function LovablePage() {
  const [tab, setTab] = useState<TabId>('novo')
  const [step, setStep] = useState<WizardStep>(0)
  const [data, setData] = useState<WizardData>({
    visao: '', publico: '', funcionalidades: '',
    design: 'Dark mode, minimalista. Fonte: Space Grotesk. Cores: #080C18 fundo, #3B5BDB primária, #7C3AED acento.',
    fluxos: '',
    integracoes: 'Supabase (banco + auth), Stripe (pagamentos), shadcn/ui, Lucide React.',
  })
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [existingPrompt, setExistingPrompt] = useState('')
  const [improving, setImproving] = useState(false)
  const [improved, setImproved] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [templateCopied, setTemplateCopied] = useState<string | null>(null)

  const quality = calcQuality(data)
  const currentStep = STEPS[step]
  const StepIcon = currentStep.icon

  const filteredTemplates = selectedCategory === 'Todos'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory)

  function copyPrompt() { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  function startImprove() {
    if (!existingPrompt.trim()) return
    setImproving(true)
    setTimeout(() => { setImproving(false); setImproved(true) }, 2000)
  }

  function useTemplate(tpl: Template) {
    setData(tpl.data)
    setGenerated(false)
    setStep(0)
    setTab('novo')
  }

  function copyTemplatePrompt(tpl: Template) {
    const text = generatePrompt(tpl.data)
    navigator.clipboard.writeText(text).catch(() => {})
    setTemplateCopied(tpl.id)
    setTimeout(() => setTemplateCopied(null), 2000)
  }

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={18} color="#06b6d4" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#E8EEFF', lineHeight: 1.1 }}>Lovable Architect</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prompts profissionais para criar apps com Lovable.dev</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(59,91,219,0.12)' }}>
        {([
          { id: 'novo',      label: 'Novo Projeto',    icon: Sparkles },
          { id: 'templates', label: 'Templates',        icon: LayoutTemplate },
          { id: 'melhorar',  label: 'Melhorar Prompt',  icon: TrendingUp },
          { id: 'historico', label: 'Histórico',         icon: History },
        ] as const).map(t => {
          const TIcon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#06b6d4' : 'transparent'}`, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: tab === t.id ? '#06b6d4' : 'var(--text-muted)', transition: 'all 0.15s', marginBottom: -1 }}>
              <TIcon size={13} />
              {t.label}
              {t.id === 'templates' && (
                <span style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 800, color: '#06b6d4', marginLeft: 2 }}>
                  {TEMPLATES.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* NOVO */}
        {tab === 'novo' && (
          <motion.div key="novo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

            <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 16, overflow: 'hidden' }}>
              {/* Progress */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(59,91,219,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>Etapa {step + 1} / {STEPS.length}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: currentStep.color }}>{currentStep.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {STEPS.map((s, i) => (
                    <div key={s.id} onClick={() => setStep(s.id as WizardStep)} style={{ flex: 1, height: 4, borderRadius: 2, cursor: 'pointer', background: i <= step ? s.color : 'rgba(59,91,219,0.12)', transition: 'background 0.3s', boxShadow: i === step ? `0 0 6px ${s.color}88` : 'none' }} />
                  ))}
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${currentStep.color}18`, border: `1px solid ${currentStep.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StepIcon size={17} color={currentStep.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: '#E8EEFF' }}>{currentStep.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentStep.subtitle}</div>
                  </div>
                </div>
                <textarea className="input-field" rows={8} placeholder={currentStep.placeholder} value={data[currentStep.key]} onChange={e => setData(prev => ({ ...prev, [currentStep.key]: e.target.value }))} style={{ width: '100%', resize: 'none', fontSize: 13, lineHeight: 1.6 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <button onClick={() => step > 0 && setStep(s => (s - 1) as WizardStep)} disabled={step === 0}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: 'var(--muted-bg)', border: '1px solid var(--border)', color: step === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>
                    <ChevronLeft size={14} />Anterior
                  </button>
                  {step < 5 ? (
                    <button onClick={() => setStep(s => (s + 1) as WizardStep)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: `linear-gradient(135deg, ${currentStep.color}cc, ${currentStep.color})`, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13 }}>
                      Próximo<ChevronRight size={14} />
                    </button>
                  ) : (
                    <button onClick={() => setGenerated(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, background: 'linear-gradient(135deg, #06b6d4, #3B5BDB)', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, boxShadow: '0 4px 16px rgba(6,182,212,0.3)' }}>
                      <Zap size={14} />Gerar Prompt
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Qualidade do Prompt</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ position: 'relative', width: 60, height: 60 }}>
                    <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={30} cy={30} r={24} fill="none" stroke="rgba(59,91,219,0.1)" strokeWidth={4} />
                      <circle cx={30} cy={30} r={24} fill="none" stroke={quality.color} strokeWidth={4}
                        strokeDasharray={`${(quality.score / 100) * 2 * Math.PI * 24} ${2 * Math.PI * 24}`}
                        strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${quality.color}88)`, transition: 'stroke-dasharray 0.5s' }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 15, color: '#E8EEFF' }}>{quality.score}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: quality.color }}>{quality.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score do prompt</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {STEPS.map(s => {
                    const filled = (data[s.key] ?? '').trim().length > 20
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: filled ? `${s.color}20` : 'rgba(59,91,219,0.08)', border: `1.5px solid ${filled ? s.color : 'rgba(59,91,219,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {filled && <Check size={9} color={s.color} />}
                        </div>
                        <span style={{ fontSize: 12, color: filled ? 'var(--text-secondary)' : 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Botão usar template */}
              <button onClick={() => setTab('templates')} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.18)', color: '#06b6d4', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <LayoutTemplate size={13} />
                Usar um template
              </button>

              {generated && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(6,182,212,0.22)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={13} color="#06b6d4" />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#06b6d4' }}>Prompt gerado</span>
                    </div>
                    <button onClick={copyPrompt} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: copied ? 'rgba(37,211,102,0.15)' : 'rgba(6,182,212,0.12)', border: `1px solid ${copied ? 'rgba(37,211,102,0.3)' : 'rgba(6,182,212,0.25)'}`, color: copied ? '#25D366' : '#06b6d4', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11 }}>
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <div style={{ padding: '12px 16px', maxHeight: 260, overflowY: 'auto' }}>
                    <pre style={{ fontSize: 10, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7 }}>{generatePrompt(data)}</pre>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* TEMPLATES */}
        {tab === 'templates' && !selectedTemplate && (
          <motion.div key="templates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Filtros de categoria */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  style={{ padding: '5px 13px', borderRadius: 20, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, cursor: 'pointer', border: `1px solid ${selectedCategory === cat ? '#06b6d4' : 'rgba(59,91,219,0.2)'}`, background: selectedCategory === cat ? 'rgba(6,182,212,0.12)' : 'transparent', color: selectedCategory === cat ? '#06b6d4' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid de templates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {filteredTemplates.map((tpl, i) => {
                const TplIcon = tpl.icon
                return (
                  <motion.div key={tpl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${tpl.color}40`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(59,91,219,0.14)')}>

                    {/* Header colorido */}
                    <div style={{ padding: '14px 16px', background: `linear-gradient(135deg, ${tpl.color}10, ${tpl.color}05)`, borderBottom: `1px solid ${tpl.color}20` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: `${tpl.color}18`, border: `1px solid ${tpl.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <TplIcon size={16} color={tpl.color} />
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: '#E8EEFF' }}>{tpl.title}</div>
                            <div style={{ fontSize: 10, color: `${tpl.color}cc`, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>{tpl.category}</div>
                          </div>
                        </div>
                        <div style={{ background: `${tpl.score >= 90 ? '#25D366' : '#06b6d4'}18`, border: `1px solid ${tpl.score >= 90 ? '#25D366' : '#06b6d4'}30`, borderRadius: 20, padding: '2px 8px', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 11, color: tpl.score >= 90 ? '#25D366' : '#06b6d4' }}>{tpl.score}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{tpl.description}</p>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                        {tpl.tags.map(tag => (
                          <span key={tag} style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.16)', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>

                      {/* Ações */}
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button onClick={() => setSelectedTemplate(tpl)}
                          style={{ flex: 1, padding: '8px', borderRadius: 8, background: `${tpl.color}18`, border: `1px solid ${tpl.color}30`, color: tpl.color, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                          <Eye size={11} />Ver detalhes
                        </button>
                        <button onClick={() => useTemplate(tpl)}
                          style={{ flex: 1, padding: '8px', borderRadius: 8, background: `linear-gradient(135deg, ${tpl.color}cc, ${tpl.color})`, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                          <Zap size={11} />Usar template
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* DETALHE DO TEMPLATE */}
        {tab === 'templates' && selectedTemplate && (
          <motion.div key="template-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setSelectedTemplate(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '8px 14px', borderRadius: 9, background: 'transparent', border: '1px solid rgba(59,91,219,0.2)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12 }}>
              <ChevronLeft size={13} />Voltar aos templates
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
              {/* Conteúdo do template */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {STEPS.map(s => {
                  const val = selectedTemplate.data[s.key]
                  const SIcon = s.icon
                  return (
                    <div key={s.id} style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${s.color}18`, background: `${s.color}08`, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SIcon size={13} color={s.color} />
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: s.color }}>{s.label}</span>
                      </div>
                      <div style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'DM Sans, sans-serif' }}>{val}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Sidebar de ação */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: 'rgba(13,18,37,0.8)', border: `1px solid ${selectedTemplate.color}25`, borderRadius: 14, padding: '20px' }}>
                  {(() => {
                    const TplIcon = selectedTemplate.icon
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 11, background: `${selectedTemplate.color}18`, border: `1px solid ${selectedTemplate.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TplIcon size={20} color={selectedTemplate.color} />
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: '#E8EEFF' }}>{selectedTemplate.title}</div>
                            <div style={{ fontSize: 11, color: `${selectedTemplate.color}cc`, fontWeight: 700 }}>{selectedTemplate.category}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 12px', borderRadius: 10, background: `${selectedTemplate.score >= 90 ? 'rgba(37,211,102,0.08)' : 'rgba(6,182,212,0.08)'}`, border: `1px solid ${selectedTemplate.score >= 90 ? 'rgba(37,211,102,0.2)' : 'rgba(6,182,212,0.2)'}` }}>
                          <Star size={14} color={selectedTemplate.score >= 90 ? '#25D366' : '#06b6d4'} />
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: selectedTemplate.score >= 90 ? '#25D366' : '#06b6d4' }}>Score {selectedTemplate.score}/100</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— prompt completo</span>
                        </div>

                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
                          {selectedTemplate.tags.map(tag => (
                            <span key={tag} style={{ padding: '3px 9px', borderRadius: 20, background: `${selectedTemplate.color}12`, border: `1px solid ${selectedTemplate.color}25`, fontSize: 11, color: selectedTemplate.color, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>{tag}</span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <button onClick={() => useTemplate(selectedTemplate)}
                            style={{ width: '100%', padding: '12px', borderRadius: 10, background: `linear-gradient(135deg, ${selectedTemplate.color}cc, ${selectedTemplate.color})`, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 16px ${selectedTemplate.color}40` }}>
                            <Zap size={14} />Editar e gerar prompt
                          </button>
                          <button onClick={() => copyTemplatePrompt(selectedTemplate)}
                            style={{ width: '100%', padding: '11px', borderRadius: 10, background: templateCopied === selectedTemplate.id ? 'rgba(37,211,102,0.12)' : `${selectedTemplate.color}12`, border: `1px solid ${templateCopied === selectedTemplate.id ? 'rgba(37,211,102,0.3)' : `${selectedTemplate.color}30`}`, color: templateCopied === selectedTemplate.id ? '#25D366' : selectedTemplate.color, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            {templateCopied === selectedTemplate.id ? <Check size={14} /> : <Copy size={14} />}
                            {templateCopied === selectedTemplate.id ? 'Copiado!' : 'Copiar prompt direto'}
                          </button>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MELHORAR */}
        {tab === 'melhorar' && (
          <motion.div key="melhorar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Prompt atual (cole aqui)</div>
              <textarea className="input-field" rows={14} placeholder="Cole aqui o prompt que você já usou no Lovable..." value={existingPrompt} onChange={e => setExistingPrompt(e.target.value)} style={{ width: '100%', resize: 'none', fontSize: 12 }} />
              <button onClick={startImprove} disabled={!existingPrompt.trim() || improving}
                style={{ marginTop: 14, width: '100%', padding: '12px', borderRadius: 10, background: improving ? 'rgba(6,182,212,0.15)' : 'linear-gradient(135deg, #06b6d4, #3B5BDB)', border: improving ? '1px solid rgba(6,182,212,0.3)' : 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, cursor: !existingPrompt.trim() || improving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {improving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} />Analisando...</> : <><Zap size={14} />Melhorar Prompt</>}
              </button>
            </div>
            <div style={{ background: 'rgba(13,18,37,0.8)', border: `1px solid ${improved ? 'rgba(37,211,102,0.22)' : 'rgba(59,91,219,0.14)'}`, borderRadius: 14, padding: '20px 22px' }}>
              {!improved ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, opacity: 0.4 }}>
                  <Eye size={28} color="var(--text-muted)" />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>Prompt melhorado aparece aqui</span>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Check size={14} color="#25D366" />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#25D366' }}>Otimizado</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score: <strong style={{ color: '#ef4444' }}>52</strong> → <strong style={{ color: '#25D366' }}>91</strong></span>
                  </div>
                  <div style={{ background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.12)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>Melhorias aplicadas:</div>
                    {['Design system completo com HEX','Stack definida (Next.js, Supabase)','Fluxos detalhados por persona','RLS e regras de segurança incluídas','Termos vagos removidos'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                        <Check size={10} color="#25D366" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Copy size={12} />Copiar prompt otimizado
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* HISTÓRICO */}
        {tab === 'historico' && (
          <motion.div key="historico" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {historyItems.map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Code2 size={17} color="#06b6d4" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{h.steps}/6 etapas · {h.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${h.score >= 85 ? '#25D366' : '#06b6d4'}15`, border: `1px solid ${h.score >= 85 ? '#25D366' : '#06b6d4'}30`, borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: h.score >= 85 ? '#25D366' : '#06b6d4' }}>{h.score}</span>
                  </div>
                  <button style={{ padding: '7px 13px', borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', color: '#06b6d4', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Copy size={12} />Reusar
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
