export type ProjetoStatus = 'Planejamento' | 'Em andamento' | 'Ativo' | 'Pausado' | 'Concluído'
export type EstudoStatus = 'A fazer' | 'Em andamento' | 'Concluído'
export type IdeiaStatus = 'Rascunho' | 'Refinando' | 'Pronta'
export type LivroStatus = 'Quero ler' | 'Lendo' | 'Lido'
export type Prioridade = 'Alta' | 'Média' | 'Baixa'

export interface Projeto {
  id: string
  user_id: string
  nome: string
  empresa: string
  descricao: string
  status: ProjetoStatus
  score: number
  horas_investidas: number
  data_inicio: string
  tags: string[]
  link_externo: string
  created_at: string
}

export interface Estudo {
  id: string
  user_id: string
  titulo: string
  plataforma: string
  link: string
  carga_horaria: number
  progresso: number
  status: EstudoStatus
  categoria: string
  created_at: string
}

export interface Certificado {
  id: string
  user_id: string
  titulo: string
  instituicao: string
  data_conclusao: string
  carga_horaria: number
  categoria: string
  tipo: 'importado' | 'gerado'
  estudo_id: string
  created_at: string
}

export interface Reuniao {
  id: string
  user_id: string
  titulo: string
  projeto_id: string
  empresa: string
  data: string
  horario: string
  participantes: string[]
  pauta: string
  notas: string
  google_event_id: string
  created_at: string
}

export interface ActionItem {
  id: string
  reuniao_id: string
  descricao: string
  concluido: boolean
  created_at: string
}

export interface Ideia {
  id: string
  user_id: string
  titulo: string
  descricao: string
  categoria: string
  prioridade: Prioridade
  status: IdeiaStatus
  created_at: string
}

export interface Livro {
  id: string
  user_id: string
  titulo: string
  autor: string
  categoria: string
  subcategoria: string
  status: LivroStatus
  progresso: number
  insights: string
  frases_marcantes: string[]
  cover_color: string
  created_at: string
}

export interface NotaBrain {
  id: string
  user_id: string
  titulo: string
  conteudo: string
  categoria: string
  tags: string[]
  created_at: string
}
