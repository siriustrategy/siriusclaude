'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Shield, Clock, Smartphone, CreditCard, FileText, ChevronDown, ChevronUp, Info, AlertTriangle, Copy, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// ====================================================================
// TIPOS
// ====================================================================
interface CheckoutData {
  token: string
  expira_em: string
  lead: { nome: string; telefone: string; plano: string }
  fase: string
  valor_original: number
  desconto_percentual: number
  valor_desconto: number
  valor_final: number
  parcelamento_disponivel: boolean
  parcelas: { num: number; valor: number; label: string }[]
}

type MetodoPagamento = 'pix' | 'cartao' | 'boleto'
type StatusCheckout = 'idle' | 'processing' | 'success' | 'error_pagamento'
type TipoErro = 'invalido' | 'expirado' | 'pago' | null

function LogoPlanoBaixo() {
  return (
    <img
      src="/logo-mais-assistencial.png"
      alt="Plano Mais Assistencial"
      style={{ height: 36, width: 'auto', display: 'block' }}
    />
  )
}

function PixQRPlaceholder({ qrCode }: { qrCode?: string }) {
  const [copiado, setCopiado] = useState(false)
  async function copiar() {
    if (!qrCode) return
    await navigator.clipboard.writeText(qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }
  return (
    <div style={{ padding: '16px', background: '#F4F7FF', borderRadius: 10, textAlign: 'center' }}>
      {qrCode ? (
        <>
          <div style={{ fontSize: 12, color: '#3A5080', marginBottom: 12 }}>QR Code PIX gerado:</div>
          {/* QR Code real — usar img com URL ou biblioteca qrcode */}
          <div style={{ width: 140, height: 140, background: '#fff', border: '1px solid rgba(13,61,204,0.12)', borderRadius: 8, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(qrCode)}`} alt="QR Code PIX" style={{ width: 130, height: 130 }} />
          </div>
          <div style={{ fontSize: 11, color: '#7A90B8', marginBottom: 8, wordBreak: 'break-all', fontFamily: 'monospace', padding: '6px 8px', background: '#fff', borderRadius: 6, border: '1px solid rgba(13,61,204,0.10)' }}>
            {qrCode.slice(0, 40)}...
          </div>
          <button onClick={copiar} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: copiado ? 'rgba(30,132,73,0.12)' : 'rgba(13,61,204,0.08)', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: copiado ? '#1E8449' : '#0D3DCC', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
            <Copy size={13} />
            {copiado ? 'Copiado!' : 'Copiar código PIX'}
          </button>
        </>
      ) : (
        <>
          <div style={{ width: 120, height: 120, background: '#fff', border: '1px solid rgba(13,61,204,0.12)', borderRadius: 8, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 10, color: '#7A90B8', textAlign: 'center' }}>QR Code PIX<br />gerado ao confirmar</div>
          </div>
          <div style={{ fontSize: 12, color: '#3A5080' }}>Após clicar em Pagar, o QR Code PIX será gerado via Cell Coin.</div>
        </>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const { token } = useParams<{ token: string }>()

  // Dados do checkout (vindos da API)
  const [dados, setDados] = useState<CheckoutData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [tipoErro, setTipoErro] = useState<TipoErro>(null)
  const [msgErro, setMsgErro] = useState<string>('')

  // Estado do pagamento
  const [metodo, setMetodo] = useState<MetodoPagamento>('pix')
  const [parcelasSel, setParcelasSel] = useState(1)
  const [expandirDetalhes, setExpandirDetalhes] = useState(false)
  const [status, setStatus] = useState<StatusCheckout>('idle')
  const [erroPagamento, setErroPagamento] = useState('')

  // Dados de cartão
  const [cartaoNum, setCartaoNum] = useState('')
  const [cartaoVal, setCartaoVal] = useState('')
  const [cartaoCvv, setCartaoCvv] = useState('')
  const [cartaoNome, setCartaoNome] = useState('')

  // Resultado do pagamento (Cell Coin)
  const [pixQrCode, setPixQrCode] = useState<string | undefined>()
  const [boletoUrl, setBoletoUrl] = useState<string | undefined>()
  const [boletoCodigo, setBoletoCodigo] = useState<string | undefined>()

  // Carrega dados do token via API
  useEffect(() => {
    if (!token) return
    fetch(`/api/checkout/${token}`)
      .then(async res => {
        const json = await res.json()
        if (!res.ok) {
          if (res.status === 409) setTipoErro('pago')
          else if (res.status === 410) setTipoErro('expirado')
          else setTipoErro('invalido')
          setMsgErro(json.error || 'Erro desconhecido')
        } else {
          setDados(json)
        }
      })
      .catch(() => { setTipoErro('invalido'); setMsgErro('Erro ao carregar. Tente novamente.') })
      .finally(() => setCarregando(false))
  }, [token])

  async function handlePagar() {
    if (!dados) return
    setStatus('processing')
    setErroPagamento('')

    const res = await fetch('/api/checkout/pagar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: dados.token,
        metodo,
        parcelas: parcelasSel,
        cartao_numero: cartaoNum,
        cartao_validade: cartaoVal,
        cartao_cvv: cartaoCvv,
        cartao_nome: cartaoNome,
      }),
    })
    const json = await res.json()

    if (res.ok && json.ok) {
      if (metodo === 'pix' && json.qr_code) {
        setPixQrCode(json.qr_code)
        setStatus('idle') // fica na tela aguardando scan
      } else if (metodo === 'boleto') {
        setBoletoUrl(json.boleto_url)
        setBoletoCodigo(json.boleto_codigo)
        setStatus('idle')
      } else {
        // Cartão aprovado imediatamente
        setStatus('success')
      }
    } else {
      setErroPagamento(json.error || json._dev || 'Erro ao processar pagamento')
      setStatus('error_pagamento')
    }
  }

  // ====================================================================
  // ESTADOS DE TELA
  // ====================================================================

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px', borderColor: '#0D3DCC', borderTopColor: 'transparent' }} />
          <div style={{ fontSize: 14, color: '#7A90B8', fontFamily: 'Space Grotesk, sans-serif' }}>Carregando seu link de pagamento...</div>
        </div>
      </div>
    )
  }

  // Erro: token inválido / expirado / já usado
  if (tipoErro) {
    const configs = {
      invalido: { cor: '#DC2626', bg: 'rgba(220,38,38,0.08)', titulo: 'Link inválido', sub: 'Este link de pagamento não existe ou foi removido.' },
      expirado: { cor: '#D68910', bg: 'rgba(214,137,16,0.08)', titulo: 'Link expirado', sub: 'Este link de pagamento expirou. Entre em contato pelo WhatsApp para receber um novo link.' },
      pago: { cor: '#1E8449', bg: 'rgba(30,132,73,0.08)', titulo: 'Plano já regularizado!', sub: 'Este link já foi utilizado e seu plano está regularizado. Obrigado!' },
    }
    const cfg = configs[tipoErro] || configs.invalido
    return (
      <div style={{ minHeight: '100vh', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            {tipoErro === 'pago'
              ? <CheckCircle size={36} color={cfg.cor} strokeWidth={1.5} />
              : <AlertTriangle size={36} color={cfg.cor} strokeWidth={1.5} />
            }
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color: '#0D1B3E', marginBottom: 10 }}>{cfg.titulo}</h1>
          <p style={{ color: '#3A5080', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{cfg.sub}</p>
          {msgErro && <p style={{ color: cfg.cor, fontSize: 12 }}>{msgErro}</p>}
        </div>
      </div>
    )
  }

  if (!dados) return null

  // Pagamento aprovado (cartão)
  if (status === 'success') {
    const parcelaSel = dados.parcelas.find(p => p.num === parcelasSel)
    return (
      <div style={{ minHeight: '100vh', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ maxWidth: 460, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(30,132,73,0.10)', border: '2px solid rgba(30,132,73,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="#1E8449" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 800, color: '#0D1B3E', marginBottom: 10 }}>
            Pagamento Confirmado!
          </h1>
          <p style={{ color: '#3A5080', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Seu pagamento foi recebido com sucesso. Seu plano foi regularizado e você receberá uma confirmação via WhatsApp em instantes.
          </p>
          <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 14, border: '1px solid rgba(30,132,73,0.15)', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#7A90B8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>VALOR PAGO</div>
            <div style={{ fontSize: 28, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: '#1E8449' }}>{formatCurrency(parcelaSel?.valor || dados.valor_final)}</div>
            {parcelasSel > 1 && <div style={{ fontSize: 13, color: '#7A90B8', marginTop: 3 }}>{parcelasSel}x de {formatCurrency(parcelaSel?.valor || 0)}</div>}
          </div>
          <div style={{ fontSize: 13, color: '#7A90B8' }}>Obrigado por regularizar seu plano, {dados.lead.nome.split(' ')[0]}!</div>
        </div>
      </div>
    )
  }

  const valorParcelado = dados.parcelas.find(p => p.num === parcelasSel)?.valor || dados.valor_final
  const diasExpira = Math.max(0, Math.ceil((new Date(dados.expira_em).getTime() - Date.now()) / 86400000))

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
          {diasExpira === 0
            ? 'Esta oferta expira hoje — Regularize agora'
            : `Esta oferta expira em ${diasExpira} dia${diasExpira > 1 ? 's' : ''} — Regularize agora`}
        </span>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', gap: 24, flexWrap: 'wrap' }}>

        {/* Coluna principal */}
        <div style={{ width: '100%', maxWidth: 460 }}>

          {/* Saudação */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color: '#0D1B3E', marginBottom: 6 }}>
              Olá, {dados.lead.nome.split(' ')[0]}!
            </h1>
            <p style={{ color: '#3A5080', fontSize: 14, lineHeight: 1.6 }}>
              Regularize seu <strong>{dados.lead.plano}</strong> com desconto especial disponível agora.
            </p>
          </div>

          {/* Resumo do valor */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(13,61,204,0.08)', boxShadow: '0 1px 3px rgba(13,61,204,0.08)', padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#0D1B3E' }}>
                {dados.lead.plano}
              </div>
              {dados.desconto_percentual > 0 && (
                <button
                  onClick={() => setExpandirDetalhes(!expandirDetalhes)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#7A90B8', fontSize: 12 }}
                >
                  <Info size={13} />
                  Detalhes
                  {expandirDetalhes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>

            {expandirDetalhes && dados.desconto_percentual > 0 && (
              <div style={{ marginBottom: 16, padding: '12px 14px', background: '#F4F7FF', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#3A5080' }}>
                  <span>Valor em aberto</span>
                  <span style={{ textDecoration: 'line-through', color: '#7A90B8' }}>{formatCurrency(dados.valor_original)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#1E8449' }}>
                  <span>Desconto {dados.desconto_percentual}%</span>
                  <span>- {formatCurrency(dados.valor_desconto)}</span>
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
              {dados.desconto_percentual > 0 && (
                <div style={{ padding: '6px 12px', background: 'rgba(30,132,73,0.10)', border: '1px solid rgba(30,132,73,0.20)', borderRadius: 100 }}>
                  <span style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#1E8449' }}>
                    {dados.desconto_percentual}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Parcelamento — só aparece se disponível (mes4, mes5) */}
          {dados.parcelamento_disponivel && dados.parcelas.length > 1 && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(13,61,204,0.08)', boxShadow: '0 1px 3px rgba(13,61,204,0.08)', padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1B3E', marginBottom: 12 }}>
                Escolha como pagar
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dados.parcelas.map(p => (
                  <button
                    key={p.num}
                    onClick={() => setParcelasSel(p.num)}
                    style={{
                      padding: '12px 16px', borderRadius: 10,
                      border: parcelasSel === p.num ? '2px solid #0D3DCC' : '1px solid rgba(13,61,204,0.12)',
                      background: parcelasSel === p.num ? 'rgba(13,61,204,0.06)' : '#fff',
                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: parcelasSel === p.num ? '#0D3DCC' : '#0D1B3E' }}>
                      {p.label}
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: parcelasSel === p.num ? '#0D3DCC' : '#0D1B3E' }}>
                      {formatCurrency(p.num === 1 ? dados.valor_final : p.valor)}
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
                { key: 'cartao', label: 'Cartão', desc: 'Crédito', icon: CreditCard },
                { key: 'boleto', label: 'Boleto', desc: '1–3 dias úteis', icon: FileText },
              ] as const).map(m => (
                <button
                  key={m.key}
                  onClick={() => setMetodo(m.key)}
                  style={{
                    padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                    border: metodo === m.key ? '2px solid #0D3DCC' : '1px solid rgba(13,61,204,0.12)',
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

            {/* PIX */}
            {metodo === 'pix' && (
              <PixQRPlaceholder qrCode={pixQrCode} />
            )}

            {/* Cartão */}
            {metodo === 'cartao' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  className="input-field"
                  placeholder="Número do cartão"
                  style={{ background: '#F4F7FF' }}
                  value={cartaoNum}
                  onChange={e => setCartaoNum(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                  maxLength={19}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input
                    className="input-field"
                    placeholder="Validade (MM/AA)"
                    style={{ background: '#F4F7FF' }}
                    value={cartaoVal}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setCartaoVal(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v)
                    }}
                    maxLength={5}
                  />
                  <input
                    className="input-field"
                    placeholder="CVV"
                    style={{ background: '#F4F7FF' }}
                    value={cartaoCvv}
                    onChange={e => setCartaoCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>
                <input
                  className="input-field"
                  placeholder="Nome no cartão"
                  style={{ background: '#F4F7FF' }}
                  value={cartaoNome}
                  onChange={e => setCartaoNome(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {/* Boleto */}
            {metodo === 'boleto' && (
              <div>
                {boletoUrl ? (
                  <div style={{ padding: '14px', background: '#F4F7FF', borderRadius: 10 }}>
                    <div style={{ fontSize: 13, color: '#1E8449', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8 }}>Boleto gerado!</div>
                    {boletoCodigo && (
                      <div style={{ fontSize: 11, color: '#3A5080', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 8, padding: '8px', background: '#fff', borderRadius: 6, border: '1px solid rgba(13,61,204,0.10)' }}>
                        {boletoCodigo}
                      </div>
                    )}
                    <a href={boletoUrl} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0D3DCC', color: '#fff', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, textDecoration: 'none' }}>
                      <ExternalLink size={14} />
                      Ver boleto
                    </a>
                  </div>
                ) : (
                  <div style={{ padding: '14px', background: '#F4F7FF', borderRadius: 10, fontSize: 13, color: '#3A5080', lineHeight: 1.6 }}>
                    O boleto será gerado e enviado para seu WhatsApp ({dados.lead.telefone}). Prazo de compensação: 1 a 3 dias úteis.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Erro de pagamento */}
          {status === 'error_pagamento' && erroPagamento && (
            <div style={{ marginBottom: 12, padding: '12px 14px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.20)', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertTriangle size={14} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#DC2626' }}>{erroPagamento}</span>
            </div>
          )}

          {/* Botão de pagamento — não aparece se boleto/pix já gerado */}
          {!(metodo === 'pix' && pixQrCode) && !(metodo === 'boleto' && boletoUrl) && (
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
                  <div className="spinner" style={{ width: 18, height: 18, borderColor: '#fff', borderTopColor: 'transparent' }} />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {metodo === 'boleto' ? 'Gerar Boleto' : metodo === 'pix' ? 'Gerar QR Code PIX' : `Pagar ${formatCurrency(valorParcelado)}${parcelasSel > 1 ? ` (${parcelasSel}x)` : ''}`}
                </>
              )}
            </button>
          )}

          {/* Segurança */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <Shield size={13} color="#7A90B8" />
            <span style={{ fontSize: 12, color: '#7A90B8' }}>Pagamento processado com segurança via Cell Coin · SSL 256-bit</span>
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
              {dados.lead.telefone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
