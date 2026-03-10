// ===================== ENUMS / UNION TYPES =====================

export type UserRole = 'gestor' | 'atendente_senior' | 'atendente_junior'
export type PerfilAtendimento = 'A' | 'B' | 'C'
export type LeadStatus = 'ativo' | 'inadimplente' | 'cancelado' | 'arquivado' | 'pago'
export type FaseCobranca = 'pre' | 'mes1' | 'mes2' | 'mes3' | 'mes4' | 'mes5' | 'pos'
export type RiscoChurn = 'baixo' | 'medio' | 'alto'
export type PrioridadeNotificacao = 'baixa' | 'media' | 'alta' | 'urgente'

// ===================== ENTIDADES =====================

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone?: string
  role: UserRole
  perfil_atendimento?: PerfilAtendimento
  ativo: boolean
  ultimo_acesso?: string
  created_at: string
}

export interface Lead {
  id: string
  nome: string
  telefone: string
  email?: string
  cpf?: string
  plano: string
  valor_mensalidade: number
  data_vencimento: string
  status: LeadStatus
  dias_atraso: number
  valor_em_aberto: number
  fase_cobranca: FaseCobranca

  // Dados pessoais
  idade?: number
  cidade?: string
  bairro?: string
  cep?: string
  profissao?: string

  // Dependentes e pets
  tem_pet: boolean
  num_pets: number
  tem_dependentes: boolean
  num_dependentes: number
  idades_dependentes: number[]

  // Scores e riscos
  score_reputacao: number
  risco_churn: RiscoChurn

  // Relacionamentos
  atendente_responsavel_id?: string

  // Negociação
  desconto_ativo_percentual: number
  desconto_ativo_validade?: string

  // Preferências
  horario_preferido_resposta?: string
  tags: string[]

  // Timestamps e última interação
  ultima_interacao?: string
  ultima_mensagem_enviada?: string
  data_entrada: string
  created_at: string
  updated_at: string
}

export interface NotaCRM {
  id: string
  lead_id: string
  usuario_id: string
  conteudo: string
  tipo: 'geral' | 'negociacao' | 'pagamento' | 'cancelamento' | 'retencao'
  created_at: string
}

export interface HistoricoStatus {
  id: string
  lead_id: string
  status_anterior: LeadStatus
  status_novo: LeadStatus
  motivo?: string
  usuario_id?: string
  created_at: string
}

export interface Conversa {
  id: string
  lead_id: string
  tipo: 'BOT' | 'HUMANO' | 'MISTO'
  atendente_id?: string
  status: 'aberta' | 'fechada' | 'pausada' | 'transferida'
  motivo_encerramento?: string
  inicio: string
  fim?: string
}

export interface Mensagem {
  id: string
  conversa_id: string
  lead_id: string
  remetente: 'BOT' | 'LEAD' | 'ATENDENTE'
  conteudo: string
  tipo: 'texto' | 'imagem' | 'audio' | 'documento' | 'template' | 'botao'
  timestamp: string
  status_entrega: 'enviado' | 'entregue' | 'lido' | 'falhou'
  custo_estimado: number
}

export interface DescontoConcedido {
  id: string
  lead_id: string
  atendente_id: string
  percentual: number
  valor_original: number
  valor_com_desconto: number
  motivo?: string
  validade: string
  aceito: boolean
  created_at: string
}

export interface Pagamento {
  id: string
  lead_id: string
  valor: number
  valor_original: number
  desconto_aplicado: number
  metodo: 'pix' | 'boleto' | 'cartao' | 'transferencia' | 'dinheiro'
  status: 'pendente' | 'confirmado' | 'cancelado' | 'estornado'
  data_pagamento?: string
  referencia?: string
  created_at: string
}

export interface TemplateMensagem {
  id: string
  nome: string
  categoria: string
  conteudo: string
  variaveis: string[]
  fase_cobranca?: FaseCobranca
  ativo: boolean
  aprovado_meta: boolean
  created_at: string
}

export type StatusCampanha = 'rascunho' | 'agendada' | 'em_execucao' | 'pausada' | 'concluida' | 'cancelada'

export interface Campanha {
  id: string
  nome: string
  descricao?: string
  template_id: string
  segmento_leads: object
  status: StatusCampanha
  agendada_para?: string
  iniciada_em?: string
  concluida_em?: string
  total_leads: number
  enviados: number
  entregues: number
  lidos: number
  respondidos: number
  convertidos: number
  created_by: string
  created_at: string
}

export interface ResultadoCampanha {
  id: string
  campanha_id: string
  lead_id: string
  mensagem_enviada: string
  enviado_em: string
  status: 'enviado' | 'entregue' | 'lido' | 'respondido' | 'convertido' | 'falhou'
  resposta_lead?: string
  converteu: boolean
  valor_recuperado: number
}

export interface CustoOperacao {
  id: string
  data: string
  tipo: 'mensagem_whatsapp' | 'sms' | 'email' | 'ia_processamento' | 'storage'
  quantidade: number
  custo_unitario: number
  custo_total: number
  referencia_id?: string
  referencia_tipo?: string
}

export interface Notificacao {
  id: string
  usuario_id: string
  tipo: string
  titulo: string
  mensagem: string
  lida: boolean
  lida_em?: string
  lead_id?: string
  conversa_id?: string
  prioridade: PrioridadeNotificacao
  acao_url?: string
  created_at: string
}

export interface CheckoutToken {
  id: string
  lead_id: string
  token: string
  usado: boolean
  expira_em: string
  valor: number
  desconto: number
  created_at: string
}

export interface ScoreLead {
  id: string
  lead_id: string
  score_pagamento: number
  score_engajamento: number
  score_retencao: number
  score_final: number
  calculado_em: string
}

export interface Diagnostico {
  id: string
  lead_id: string
  tipo: 'churn_prediction' | 'best_time' | 'offer_recommendation' | 'sentiment'
  resultado: object
  confianca: number
  gerado_em: string
}

export interface Auditoria {
  id: string
  usuario_id?: string
  acao: string
  tabela: string
  registro_id: string
  dados_anteriores?: object
  dados_novos?: object
  ip?: string
  created_at: string
}

// ===================== HELPERS DE UI =====================

export interface KPICard {
  titulo: string
  valor: string | number
  variacao?: number
  variacao_tipo?: 'positivo' | 'negativo' | 'neutro'
  icon?: string
}
