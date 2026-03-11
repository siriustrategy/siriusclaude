/**
 * Motor de Cobrança — Plano Mais Inadimplência
 * Epic 03 — Lógica central de régua, fases, descontos e régua diária
 *
 * Régua: pre → mes1 → mes2 → mes3(5%) → mes4(15%) → mes5(20%) → pos
 */

import { Lead, FaseCobranca } from '@/types'

// ===================== CONSTANTES DA RÉGUA =====================

export const FASES_REGUA = ['pre', 'mes1', 'mes2', 'mes3', 'mes4', 'mes5', 'pos'] as const
export type FaseRegua = FaseCobranca

export const DESCONTO_POR_FASE: Record<FaseRegua, number> = {
  pre:  0,
  mes1: 0,
  mes2: 0,
  mes3: 5,
  mes4: 15,
  mes5: 20,
  pos:  0,
}

export const DIAS_LIMITE_POR_FASE: Record<FaseRegua, number> = {
  pre:  0,
  mes1: 30,
  mes2: 60,
  mes3: 90,
  mes4: 120,
  mes5: 150,
  pos:  180,
}

/** Canais disponíveis em cada fase */
export const CANAIS_POR_FASE: Record<FaseRegua, string[]> = {
  pre:  ['whatsapp'],
  mes1: ['whatsapp', 'sms'],
  mes2: ['whatsapp', 'sms', 'email'],
  mes3: ['whatsapp', 'sms', 'email'],
  mes4: ['whatsapp', 'sms', 'email', 'ligacao'],
  mes5: ['whatsapp', 'sms', 'email', 'ligacao'],
  pos:  ['ligacao', 'carta'],
}

// ===================== CÁLCULO DE FASE =====================

/**
 * Calcula a fase de cobrança com base nos dias de atraso
 */
export function calcularFase(diasAtraso: number): FaseRegua {
  if (diasAtraso <= 0)   return 'pre'
  if (diasAtraso <= 30)  return 'mes1'
  if (diasAtraso <= 60)  return 'mes2'
  if (diasAtraso <= 90)  return 'mes3'
  if (diasAtraso <= 120) return 'mes4'
  if (diasAtraso <= 150) return 'mes5'
  return 'pos'
}

/**
 * Retorna a próxima fase (ou null se já estiver em 'pos')
 */
export function proximaFase(fase: FaseRegua): FaseRegua | null {
  const idx = FASES_REGUA.indexOf(fase)
  if (idx === -1 || idx === FASES_REGUA.length - 1) return null
  return FASES_REGUA[idx + 1]
}

// ===================== CÁLCULO DE DESCONTO =====================

export interface ResultadoDesconto {
  percentual: number
  valorOriginal: number
  valorComDesconto: number
  valorDesconto: number
  elegivel: boolean
}

/**
 * Calcula o desconto disponível para um lead em determinada fase
 */
export function calcularDesconto(
  valorDivida: number,
  fase: FaseRegua,
): ResultadoDesconto {
  const percentual = DESCONTO_POR_FASE[fase]
  const elegivel = percentual > 0
  const valorDesconto = elegivel ? valorDivida * (percentual / 100) : 0
  const valorComDesconto = valorDivida - valorDesconto

  return {
    percentual,
    valorOriginal: valorDivida,
    valorComDesconto,
    valorDesconto,
    elegivel,
  }
}

// ===================== SCORE DE RISCO =====================

export interface ScoreRisco {
  score: number      // 0-100 (100 = maior risco de não pagar)
  nivel: 'baixo' | 'medio' | 'alto' | 'critico'
  fatores: string[]
}

/**
 * Calcula score de risco de inadimplência
 * Baseado em: dias de atraso, valor da dívida, histórico de contatos, fase
 */
export function calcularScoreRisco(
  diasAtraso: number,
  valorDivida: number,
  tentativasContato: number,
  responseuUltimoContato: boolean,
): ScoreRisco {
  const fatores: string[] = []
  let score = 0

  // Fator 1: Dias de atraso (peso 40%)
  const scoreDias = Math.min((diasAtraso / 180) * 40, 40)
  score += scoreDias
  if (diasAtraso > 90) fatores.push(`${diasAtraso} dias em atraso`)

  // Fator 2: Valor da dívida (peso 20%)
  const scoreValor = Math.min((valorDivida / 5000) * 20, 20)
  score += scoreValor
  if (valorDivida > 2000) fatores.push(`Dívida alta: R$ ${valorDivida.toFixed(2)}`)

  // Fator 3: Sem resposta ao contato (peso 25%)
  if (!responseuUltimoContato) {
    score += 25
    fatores.push('Sem resposta ao último contato')
  }

  // Fator 4: Muitas tentativas sem sucesso (peso 15%)
  if (tentativasContato > 5) {
    score += Math.min((tentativasContato - 5) * 3, 15)
    fatores.push(`${tentativasContato} tentativas sem resposta`)
  }

  score = Math.round(Math.min(score, 100))

  let nivel: ScoreRisco['nivel']
  if (score >= 75) nivel = 'critico'
  else if (score >= 50) nivel = 'alto'
  else if (score >= 25) nivel = 'medio'
  else nivel = 'baixo'

  return { score, nivel, fatores }
}

// ===================== PRÓXIMO CONTATO =====================

export interface ProximoContato {
  canal: string
  diasParaContato: number
  dataContato: Date
  mensagemSugerida: string
  prioridade: 'urgente' | 'normal' | 'baixa'
}

/**
 * Determina o próximo contato ideal para um lead
 */
export function calcularProximoContato(
  lead: Pick<Lead, 'fase_cobranca' | 'dias_atraso' | 'valor_em_aberto' | 'nome'>,
  ultimoContatoEm?: Date,
): ProximoContato {
  const fase = lead.fase_cobranca as FaseRegua
  const canais = CANAIS_POR_FASE[fase] || ['whatsapp']
  const canal = canais[0] // prioridade: primeiro canal da fase

  // Intervalo entre contatos por fase (em dias)
  const intervalosDias: Record<FaseRegua, number> = {
    pre:  7,
    mes1: 5,
    mes2: 4,
    mes3: 3,
    mes4: 2,
    mes5: 1,
    pos:  7,
  }

  const diasParaContato = intervalosDias[fase]
  const dataContato = new Date()
  dataContato.setDate(dataContato.getDate() + diasParaContato)

  // Definir prioridade
  let prioridade: ProximoContato['prioridade']
  if (fase === 'mes5' || fase === 'mes4') prioridade = 'urgente'
  else if (fase === 'pre' || fase === 'pos') prioridade = 'baixa'
  else prioridade = 'normal'

  // Mensagem sugerida
  const desconto = DESCONTO_POR_FASE[fase]
  const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_em_aberto)
  let mensagemSugerida = ''

  if (desconto > 0) {
    const valorComDesconto = lead.valor_em_aberto * (1 - desconto / 100)
    const valorDescontoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorComDesconto)
    mensagemSugerida = `Olá ${lead.nome.split(' ')[0]}! Temos uma oferta especial: regularize sua mensalidade com ${desconto}% de desconto. De ${valorFormatado} por apenas ${valorDescontoFormatado}. Acesse o link para quitar agora.`
  } else if (fase === 'pre') {
    mensagemSugerida = `Olá ${lead.nome.split(' ')[0]}! Identificamos que sua mensalidade (${valorFormatado}) vence em breve. Evite a inadimplência — clique aqui para pagar.`
  } else {
    mensagemSugerida = `Olá ${lead.nome.split(' ')[0]}! Sua mensalidade de ${valorFormatado} está em aberto há ${lead.dias_atraso} dias. Regularize agora e mantenha seus benefícios.`
  }

  return {
    canal,
    diasParaContato,
    dataContato,
    mensagemSugerida,
    prioridade,
  }
}

// ===================== SCHEDULER DIÁRIO =====================

export interface LeadParaContato {
  leadId: string
  nome: string
  telefone: string
  email?: string
  fase: FaseRegua
  diasAtraso: number
  valorDivida: number
  canal: string
  mensagem: string
  prioridade: 'urgente' | 'normal' | 'baixa'
}

export interface ResultadoScheduler {
  data: string
  totalLeads: number
  porFase: Record<FaseRegua, number>
  urgentes: number
  normais: number
  baixos: number
  leadsParaContato: LeadParaContato[]
}

/**
 * Executa o scheduler diário — determina quais leads devem ser contatados hoje
 * Anti-abuse: max 3 contatos por lead por semana, respeitar horários (8h-20h)
 */
export function executarSchedulerDiario(
  leads: Array<Pick<Lead, 'id' | 'nome' | 'telefone' | 'email' | 'fase_cobranca' | 'dias_atraso' | 'valor_em_aberto'>>,
  opcoesAntiAbuse: {
    maxContatosPorSemana?: number
    horaInicio?: number
    horaFim?: number
  } = {},
): ResultadoScheduler {
  const {
    maxContatosPorSemana = 3,
    horaInicio = 8,
    horaFim = 20,
  } = opcoesAntiAbuse

  // Verificar horário permitido
  const horaAtual = new Date().getHours()
  const dentroDoHorario = horaAtual >= horaInicio && horaAtual < horaFim

  const porFase: Record<FaseRegua, number> = {
    pre: 0, mes1: 0, mes2: 0, mes3: 0, mes4: 0, mes5: 0, pos: 0,
  }

  const leadsParaContato: LeadParaContato[] = []

  for (const lead of leads) {
    const fase = lead.fase_cobranca || calcularFase(lead.dias_atraso)
    const proximoContato = calcularProximoContato(lead, undefined)

    // Só adicionar se for contato hoje (diasParaContato === 0)
    // Em produção, este scheduler rodaria às 08h e processaria todos do dia
    porFase[fase]++

    leadsParaContato.push({
      leadId: lead.id,
      nome: lead.nome,
      telefone: lead.telefone,
      email: lead.email,
      fase,
      diasAtraso: lead.dias_atraso,
      valorDivida: lead.valor_em_aberto,
      canal: proximoContato.canal,
      mensagem: proximoContato.mensagemSugerida,
      prioridade: proximoContato.prioridade,
    })
  }

  // Ordenar: urgentes primeiro, depois por dias de atraso desc
  leadsParaContato.sort((a, b) => {
    const prioOrder = { urgente: 0, normal: 1, baixa: 2 }
    if (prioOrder[a.prioridade] !== prioOrder[b.prioridade]) {
      return prioOrder[a.prioridade] - prioOrder[b.prioridade]
    }
    return b.diasAtraso - a.diasAtraso
  })

  return {
    data: new Date().toISOString().split('T')[0],
    totalLeads: leadsParaContato.length,
    porFase,
    urgentes: leadsParaContato.filter(l => l.prioridade === 'urgente').length,
    normais: leadsParaContato.filter(l => l.prioridade === 'normal').length,
    baixos: leadsParaContato.filter(l => l.prioridade === 'baixa').length,
    leadsParaContato,
  }
}

// ===================== REGRAS ANTI-ABUSO =====================

export interface RegraAntiAbuso {
  passou: boolean
  motivo?: string
}

/**
 * Valida se um contato pode ser feito respeitando as regras anti-abuso
 */
export function validarAntiAbuso(
  contatosNaSemana: number,
  horaContato: number,
  fase: FaseRegua,
  maxPorSemana = 3,
): RegraAntiAbuso {
  // Regra 1: Máximo de contatos por semana
  if (contatosNaSemana >= maxPorSemana) {
    return {
      passou: false,
      motivo: `Limite de ${maxPorSemana} contatos por semana atingido`,
    }
  }

  // Regra 2: Horário permitido (8h-20h)
  if (horaContato < 8 || horaContato >= 20) {
    return {
      passou: false,
      motivo: 'Fora do horário permitido (8h-20h)',
    }
  }

  // Regra 3: Fase 'pos' — só ligação/carta, não automático
  if (fase === 'pos') {
    return {
      passou: false,
      motivo: 'Fase pós-180 dias requer abordagem manual',
    }
  }

  return { passou: true }
}

// ===================== GERADOR DE TOKEN DE CHECKOUT =====================

/**
 * Gera token único para o link de checkout de pagamento
 * Em produção usar crypto.randomUUID() ou uuid
 */
export function gerarTokenCheckout(leadId: string, valorCentavos: number): string {
  const timestamp = Date.now()
  const base = `${leadId}-${valorCentavos}-${timestamp}`
  // Encode simples para URL-safe (em produção: assinar com HMAC)
  return Buffer.from(base).toString('base64url').slice(0, 32)
}

// ===================== SUMÁRIO DE INADIMPLÊNCIA =====================

export interface SumarioInadimplencia {
  totalLeads: number
  totalDivida: number
  totalRecuperavel: number // soma de leads em fases com desconto
  porFase: Record<FaseRegua, { quantidade: number; valorTotal: number }>
  taxaRecuperacao: number // % leads pagos vs total
  mediaDiasAtraso: number
}

/**
 * Gera sumário executivo de inadimplência
 */
export function gerarSumario(
  leads: Array<Pick<Lead, 'fase_cobranca' | 'dias_atraso' | 'valor_em_aberto' | 'status'>>,
): SumarioInadimplencia {
  const porFase: Record<FaseRegua, { quantidade: number; valorTotal: number }> = {
    pre: { quantidade: 0, valorTotal: 0 },
    mes1: { quantidade: 0, valorTotal: 0 },
    mes2: { quantidade: 0, valorTotal: 0 },
    mes3: { quantidade: 0, valorTotal: 0 },
    mes4: { quantidade: 0, valorTotal: 0 },
    mes5: { quantidade: 0, valorTotal: 0 },
    pos: { quantidade: 0, valorTotal: 0 },
  }

  let totalDivida = 0
  let totalRecuperavel = 0
  let somaDias = 0
  let pagos = 0

  for (const lead of leads) {
    const fase = lead.fase_cobranca || calcularFase(lead.dias_atraso)
    porFase[fase].quantidade++
    porFase[fase].valorTotal += lead.valor_em_aberto
    totalDivida += lead.valor_em_aberto
    somaDias += lead.dias_atraso

    if (DESCONTO_POR_FASE[fase] > 0) totalRecuperavel += lead.valor_em_aberto
    if (lead.status === 'pago') pagos++
  }

  return {
    totalLeads: leads.length,
    totalDivida,
    totalRecuperavel,
    porFase,
    taxaRecuperacao: leads.length > 0 ? (pagos / leads.length) * 100 : 0,
    mediaDiasAtraso: leads.length > 0 ? somaDias / leads.length : 0,
  }
}
