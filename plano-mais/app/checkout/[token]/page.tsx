'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Shield, Clock, Smartphone, CreditCard, FileText, ChevronDown, ChevronUp, Info, Loader } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock de checkout — em produção virá do Supabase via token
const mockCheckout = {
  token: 'abc123',
  lead: { nome: 'Ana Costa', telefone: '(21) 97777-3333' },
  plano: 'Plano Mais Familiar',
  valor_original: 1350.00,
  desconto_percentual: 15,
  valor_desconto: 202.50,
  valor_final: 1147.50,
  fase: 'mes4',
  vencimento_link: '2026-03-17',
  parcelamento_disponivel: true,
  parcelas: [
    { num: 1, valor: 1147.50, label: 'À vista' },
    { num: 2, valor: 573.75, label: '2x de R$ 573,75' },
    { num: 3, valor: 382.50, label: '3x de R$ 382,50' },
  ],
}

type MetodoPagamento = 'pix' | 'cartao' | 'boleto'
type StatusCheckout = 'idle' | 'processing' | 'success'

function LogoPlanoBaixo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#0D3DCC" />
        <text x="50%" y="52%" dominantBaseline="central" textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif" fontWeight="800" fontSize="13" fill="#50F7E8">P+</text>
      </svg>
      <div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: '#0D1B3E', letterSpacing: '0.04em' }}>PLANO MAIS</div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: '#7A90B8', letterSpacing: '0.12em', fontWeight: 600 }}>ASSISTENCIAL</div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const { token } = useParams<{ token: string }>()
  const [metodo, setMetodo] = useState<MetodoPagamento>('pix')
  const [parcelasSel, setParcelasSel] = useState(1)
  const [expandirDetalhes, setExpandirDetalhes] = useState(false)
  const [status, setStatus] = useState<StatusCheckout>('idle')

  const c = mockCheckout
  const valorParcelado = c.parcelas.find(p => p.num === parcelasSel)?.valor || c.valor_final

  function handlePagar() {
    setStatus('processing')
    setTimeout(() => setStatus('success'), 2500)
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ maxWidth: 460, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(30,132,73,0.10)', border: '2px solid rgba(30,132,73,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="var(--success)" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 800, color: '#0D1B3E', marginBottom: 10 }}>
            Pagamento Confirmado!
          </h1>
          <p style={{ color: '#3A5080', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Seu pagamento foi recebido com sucesso. Seu plano foi regularizado e você receberá uma confirmação via WhatsApp em instantes.
          </p>
          <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 14, border: '1px solid rgba(30,132,73,0.15)', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#7A90B8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>VALOR PAGO</div>
            <div style={{ fontSize: 28, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: '#1E8449' }}>{formatCurrency(valorParcelado)}</div>
            {parcelasSel > 1 && <div style={{ fontSize: 13, color: '#7A90B8', marginTop: 3 }}>{parcelasSel}x de {formatCurrency(valorParcelado)}</div>}
          </div>
          <div style={{ fontSize: 13, color: '#7A90B8' }}>Obrigado por regularizar seu plano, {c.lead.nome.split(' ')[0]}!</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EEF2FF', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,61,204,0.08)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <LogoPlanoBaixo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7A90B8' }}>
          <Shield size={13} color="#1E8449" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>Pagamento 100% seguro</span>
        </div>
      </div>

      {/* Aviso de expiração */}
      <div style={{ background: 'rgba(214,137,16,0.10)', borderBottom: '1px solid rgba(214,137,16,0.20)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Clock size={13} color="#D68910" />
        <span style={{ fontSize: 12, color: '#D68910', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
          Esta oferta expira em {c.vencimento_link} — Regularize agora
        </span>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', gap: 24, flexWrap: 'wrap' }}>

        {/* Coluna principal */}
        <div style={{ width: '100%', maxWidth: 460 }}>

          {/* Saudação */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color: '#0D1B3E', marginBottom: 6 }}>
              Olá, {c.lead.nome.split(' ')[0]}!
            </h1>
            <p style={{ color: '#3A5080', fontSize: 14, lineHeight: 1.6 }}>
              Regularize seu <strong>{c.plano}</strong> com desconto especial disponível agora.
            </p>
          </div>

          {/* Resumo do valor */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(13,61,204,0.08)', boxShadow: '0 1px 3px rgba(13,61,204,0.08)', padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#0D1B3E' }}>
                {c.plano}
              </div>
              <button
                onClick={() => setExpandirDetalhes(!expandirDetalhes)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#7A90B8', fontSize: 12 }}
              >
                <Info size={13} />
                Detalhes
                {expandirDetalhes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            {expandirDetalhes && (
              <div style={{ marginBottom: 16, padding: '12px 14px', background: '#F4F7FF', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#3A5080' }}>
                  <span>Valor em aberto</span>
                  <span style={{ textDecoration: 'line-through', color: '#7A90B8' }}>{formatCurrency(c.valor_original)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#1E8449' }}>
                  <span>Desconto {c.desconto_percentual}%</span>
                  <span>- {formatCurrency(c.valor_desconto)}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: '#7A90B8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>TOTAL A PAGAR</div>
                <div style={{ fontSize: 32, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: '#0D1B3E' }}>
                  {formatCurrency(valorParcelado)}
                </div>
                {parcelasSel > 1 && (
                  <div style={{ fontSize: 13, color: '#7A90B8', marginTop: 2 }}>{parcelasSel}x sem juros</div>
                )}
              </div>
              <div style={{ padding: '6px 12px', background: 'rgba(30,132,73,0.10)', border: '1px solid rgba(30,132,73,0.20)', borderRadius: 100 }}>
                <span style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#1E8449' }}>
                  {c.desconto_percentual}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Parcelamento */}
          {c.parcelamento_disponivel && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(13,61,204,0.08)', boxShadow: '0 1px 3px rgba(13,61,204,0.08)', padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1B3E', marginBottom: 12 }}>
                Escolha como pagar
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.parcelas.map(p => (
                  <button
                    key={p.num}
                    onClick={() => setParcelasSel(p.num)}
                    style={{
                      padding: '12px 16px', borderRadius: 10,
                      border: parcelasSel === p.num ? '2px solid var(--accent)' : '1px solid rgba(13,61,204,0.12)',
                      background: parcelasSel === p.num ? 'rgba(13,61,204,0.06)' : '#fff',
                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: parcelasSel === p.num ? '#0D3DCC' : '#0D1B3E' }}>
                      {p.label}
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: parcelasSel === p.num ? '#0D3DCC' : '#0D1B3E' }}>
                      {formatCurrency(p.num === 1 ? c.valor_final : p.valor)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Método de pagamento */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(13,61,204,0.08)', boxShadow: '0 1px 3px rgba(13,61,204,0.08)', padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1B3E', marginBottom: 12 }}>
              Método de pagamento
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {([
                { key: 'pix', label: 'PIX', desc: 'Instantâneo', icon: Smartphone },
                { key: 'cartao', label: 'Cartão', desc: 'Crédito / Débito', icon: CreditCard },
                { key: 'boleto', label: 'Boleto', desc: '1–3 dias úteis', icon: FileText },
              ] as const).map(m => (
                <button
                  key={m.key}
                  onClick={() => setMetodo(m.key)}
                  style={{
                    padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                    border: metodo === m.key ? '2px solid var(--accent)' : '1px solid rgba(13,61,204,0.12)',
                    background: metodo === m.key ? 'rgba(13,61,204,0.06)' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <m.icon size={20} color={metodo === m.key ? '#0D3DCC' : '#7A90B8'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: metodo === m.key ? '#0D3DCC' : '#0D1B3E' }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: '#7A90B8', marginTop: 2 }}>{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Campo PIX */}
            {metodo === 'pix' && (
              <div style={{ padding: '16px', background: '#F4F7FF', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ width: 120, height: 120, background: '#fff', border: '1px solid rgba(13,61,204,0.12)', borderRadius: 8, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 10, color: '#7A90B8', textAlign: 'center' }}>QR Code PIX<br/>gerado ao confirmar</div>
                </div>
                <div style={{ fontSize: 12, color: '#3A5080' }}>Após clicar em Pagar, o QR Code PIX será gerado.</div>
              </div>
            )}

            {/* Campo Cartão */}
            {metodo === 'cartao' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="input-field" placeholder="Número do cartão" style={{ background: '#F4F7FF' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input className="input-field" placeholder="Validade (MM/AA)" style={{ background: '#F4F7FF' }} />
                  <input className="input-field" placeholder="CVV" style={{ background: '#F4F7FF' }} />
                </div>
                <input className="input-field" placeholder="Nome no cartão" style={{ background: '#F4F7FF' }} />
              </div>
            )}

            {/* Boleto */}
            {metodo === 'boleto' && (
              <div style={{ padding: '14px', background: '#F4F7FF', borderRadius: 10, fontSize: 13, color: '#3A5080', lineHeight: 1.6 }}>
                O boleto será gerado e enviado para seu WhatsApp ({c.lead.telefone}). Prazo de compensação: 1 a 3 dias úteis.
              </div>
            )}
          </div>

          {/* Botão de pagamento */}
          <button
            onClick={handlePagar}
            disabled={status === 'processing'}
            style={{
              width: '100%', padding: '16px', borderRadius: 12,
              background: status === 'processing' ? '#7A90B8' : '#0D3DCC',
              color: '#fff', border: 'none', cursor: status === 'processing' ? 'not-allowed' : 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.15s',
              boxShadow: status === 'processing' ? 'none' : '0 4px 20px rgba(13,61,204,0.30)',
            }}
          >
            {status === 'processing' ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18 }} />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Pagar {formatCurrency(valorParcelado)}
                {parcelasSel > 1 && ` (${parcelasSel}x)`}
              </>
            )}
          </button>

          {/* Segurança */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <Shield size={13} color="#7A90B8" />
            <span style={{ fontSize: 12, color: '#7A90B8' }}>Pagamento processado com segurança via Asaas · SSL 256-bit</span>
          </div>
        </div>

        {/* Coluna lateral — benefícios do plano */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(13,61,204,0.08)', boxShadow: '0 1px 3px rgba(13,61,204,0.08)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1B3E', marginBottom: 14 }}>
              O que você mantém ao regularizar
            </div>
            {[
              'Consultas médicas na rede credenciada',
              'Cobertura para toda a família',
              'Atendimento de emergência 24h',
              'Consultas pediátricas e especializadas',
              'Laboratórios e exames na rede',
              'Telemedicina inclusa no plano',
            ].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <CheckCircle size={14} color="#1E8449" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: '#3A5080', lineHeight: 1.4 }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: '14px 16px', background: 'rgba(13,61,204,0.05)', border: '1px solid rgba(13,61,204,0.12)', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#7A90B8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: 6 }}>PRECISA DE AJUDA?</div>
            <div style={{ fontSize: 13, color: '#3A5080' }}>
              Entre em contato pelo WhatsApp:
            </div>
            <div style={{ fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#0D3DCC', marginTop: 4 }}>
              {c.lead.telefone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
