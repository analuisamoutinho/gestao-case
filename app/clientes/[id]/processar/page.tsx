'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

const ETAPAS = [
  { key: 'dna',      label: 'AGENTE DNA',      desc: 'Extrai perfil, dores e linguagem literal do cliente' },
  { key: 'score',    label: 'AGENTE SCORE',    desc: 'Avalia maturidade do negócio em 6 dimensões' },
  { key: 'radar',    label: 'AGENTE RADAR',    desc: 'Identifica o gargalo principal que trava o crescimento' },
  { key: 'playbook', label: 'AGENTE PLAYBOOK', desc: 'Monta o plano de 90 dias priorizado pelo gargalo' },
]

export default function ProcessarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'processing') {
      let etapa = 0
      interval = setInterval(() => {
        if (etapa < ETAPAS.length - 1) { etapa++; setEtapaAtual(etapa) }
      }, 20000)
      return () => clearInterval(interval)
    }
  }, [status])

  useEffect(() => {
    if (status !== 'processing') return
    const poll = setInterval(async () => {
      const res = await fetch(`/api/clientes/${id}`)
      const data = await res.json()
      if (data.cliente?.status === 'concluido') {
        clearInterval(poll)
        setStatus('done')
        setTimeout(() => router.push(`/clientes/${id}/diagnostico`), 1800)
      } else if (data.cliente?.status === 'erro') {
        clearInterval(poll)
        setStatus('error')
        setErro('Os agentes encontraram um erro. Verifique os logs do servidor.')
      }
    }, 5000)
    return () => clearInterval(poll)
  }, [status, id, router])

  const iniciar = async () => {
    setStatus('processing')
    setEtapaAtual(0)
    const res = await fetch('/api/diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: id }),
    })
    if (!res.ok) {
      const data = await res.json()
      setStatus('error')
      setErro(data.error || 'Erro desconhecido')
    }
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
      {/* Header */}
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#B8864B', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, marginBottom: '0.5rem' }}>
        DIAGNÓSTICO 360°
      </p>
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#1E120D', marginBottom: '0.5rem' }}>
        Gerar Diagnóstico
      </h1>
      <p style={{ color: '#8B7060', marginBottom: '3rem', fontSize: '0.9rem' }}>
        4 agentes de IA vão analisar as informações e construir o plano estratégico
      </p>

      {/* Idle */}
      {status === 'idle' && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '2.5rem' }}>
          {/* Agentes grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem', textAlign: 'left' }}>
            {ETAPAS.map((e, i) => (
              <div key={e.key} style={{ background: '#F4E6D4', border: '1px solid #D9B794', padding: '1rem' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', color: '#B8864B', marginBottom: '0.5rem' }}>
                  {i + 1}. {e.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8B7060', lineHeight: 1.4 }}>{e.desc}</div>
              </div>
            ))}
          </div>

          {/* Seta indicando fluxo */}
          <div style={{ color: '#D9B794', fontSize: '1.5rem', marginBottom: '1.5rem' }}>↓ ↓ ↓ ↓</div>

          <button
            onClick={iniciar}
            style={{
              width: '100%', background: '#B8864B', border: 'none',
              color: 'white', padding: '1.25rem',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
              fontSize: '0.85rem', letterSpacing: '0.12em', cursor: 'pointer',
            }}
          >
            ▶ GERAR DIAGNÓSTICO 360°
          </button>
          <p style={{ color: '#A89070', fontSize: '0.75rem', marginTop: '1rem' }}>Processo pode levar 1–3 minutos</p>
        </div>
      )}

      {/* Processing */}
      {status === 'processing' && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
            {ETAPAS.map((e, i) => {
              const done   = i < etapaAtual
              const active = i === etapaAtual
              return (
                <div key={e.key} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem',
                  background: active ? '#F4E6D4' : 'transparent',
                  border: active ? '1px solid #B8864B' : '1px solid transparent',
                  opacity: !done && !active ? 0.4 : 1,
                  transition: 'all 0.3s',
                }}>
                  {/* Ícone */}
                  <div style={{
                    width: '36px', height: '36px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${done ? '#3D6B3F' : active ? '#B8864B' : '#D9B794'}`,
                    background: done ? '#D4EBCF' : active ? '#B8864B' : 'transparent',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
                    fontSize: '0.8rem',
                    color: done ? '#3D6B3F' : active ? 'white' : '#D9B794',
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', color: active ? '#1E120D' : '#8B7060' }}>
                      {e.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#A89070', marginTop: '0.15rem' }}>{e.desc}</div>
                  </div>
                  {active && (
                    <div style={{
                      width: '20px', height: '20px', flexShrink: 0,
                      border: '2px solid #B8864B', borderTopColor: 'transparent',
                      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                    }} />
                  )}
                </div>
              )
            })}
          </div>
          <p style={{ color: '#A89070', fontSize: '0.78rem', marginTop: '1.5rem' }}>
            Aguarde — os agentes estão analisando o cliente...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Done */}
      {status === 'done' && (
        <div style={{ background: 'white', border: '1px solid #B8864B', padding: '3rem' }}>
          {/* Rosa dos ventos animada */}
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 1.5rem', display: 'block' }}>
            <circle cx="28" cy="28" r="26" stroke="#B8864B" strokeWidth="1.5" />
            <circle cx="28" cy="28" r="5" fill="#B8864B" />
            <polygon points="28,4 31,22 28,19 25,22" fill="#B8864B" />
            <polygon points="28,52 31,34 28,37 25,34" fill="#4A2E1F" />
            <polygon points="4,28 22,31 19,28 22,25" fill="#B8864B" />
            <polygon points="52,28 34,31 37,28 34,25" fill="#4A2E1F" />
          </svg>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#1E120D', marginBottom: '0.5rem' }}>
            Diagnóstico Gerado
          </h2>
          <p style={{ color: '#8B7060', fontSize: '0.9rem' }}>Redirecionando para o Diagnóstico 360°...</p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{ background: 'white', border: '1px solid #C45A5A', padding: '2.5rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', color: '#8B2020', marginBottom: '1rem' }}>
            ERRO NO PROCESSAMENTO
          </p>
          <p style={{ color: '#8B7060', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{erro}</p>
          <button
            onClick={() => { setStatus('idle'); setEtapaAtual(0); setErro('') }}
            style={{
              background: 'transparent', border: '1px solid #D9B794',
              color: '#8B7060', padding: '0.75rem 1.5rem',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer',
            }}
          >
            TENTAR NOVAMENTE
          </button>
        </div>
      )}
    </div>
  )
}
