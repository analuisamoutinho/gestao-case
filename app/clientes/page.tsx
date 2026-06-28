'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Cliente = {
  id: string
  nome: string
  status: string
  criado_em: string
  gargalo: { principal: string } | null
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  aguardando: { label: 'Aguardando', color: '#8B7060', bg: '#E9D2B6' },
  processando: { label: 'Processando...', color: '#B8864B', bg: '#F0DEC0' },
  concluido:  { label: 'Concluído', color: '#3D6B3F', bg: '#D4EBCF' },
  erro:       { label: 'Erro', color: '#8B2020', bg: '#F2CECE' },
}

const GARGALO: Record<string, string> = {
  trafego: 'Tráfego', conversao: 'Conversão', oferta: 'Oferta',
  comercial: 'Comercial', posicionamento: 'Posicionamento', retencao: 'Retenção',
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clientes')
      .then(r => r.json())
      .then(d => { setClientes(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  return (
    <div>
      {/* Header da página */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#B8864B', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, marginBottom: '0.5rem' }}>
            BASE DE CONHECIMENTO
          </p>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#1E120D' }}>
            Clientes
          </h1>
          <p style={{ color: '#8B7060', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Gerencie os onboardings e diagnósticos da Case
          </p>
        </div>
        <Link href="/clientes/novo">
          <button style={{
            background: '#B8864B',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            + NOVO CLIENTE
          </button>
        </Link>
      </div>

      {/* Divisor ornamental */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#D9B794' }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2" fill="#B8864B" />
          <line x1="8" y1="0" x2="8" y2="5" stroke="#B8864B" strokeWidth="1" />
          <line x1="8" y1="11" x2="8" y2="16" stroke="#B8864B" strokeWidth="1" />
          <line x1="0" y1="8" x2="5" y2="8" stroke="#B8864B" strokeWidth="1" />
          <line x1="11" y1="8" x2="16" y2="8" stroke="#B8864B" strokeWidth="1" />
        </svg>
        <div style={{ flex: 1, height: '1px', background: '#D9B794' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#A89070' }}>Carregando...</div>
      ) : clientes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 1rem' }}>
            <circle cx="24" cy="24" r="22" stroke="#D9B794" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="4" fill="#D9B794" />
            <line x1="24" y1="4" x2="24" y2="17" stroke="#D9B794" strokeWidth="1.5" />
            <line x1="24" y1="31" x2="24" y2="44" stroke="#D9B794" strokeWidth="1.5" />
            <line x1="4" y1="24" x2="17" y2="24" stroke="#D9B794" strokeWidth="1.5" />
            <line x1="31" y1="24" x2="44" y2="24" stroke="#D9B794" strokeWidth="1.5" />
          </svg>
          <p style={{ color: '#A89070', marginBottom: '1rem', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            NENHUM CLIENTE CADASTRADO
          </p>
          <Link href="/clientes/novo" style={{ color: '#B8864B', fontWeight: 600, fontSize: '0.9rem' }}>
            Cadastrar primeiro cliente →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clientes.map((c) => {
            const st = STATUS[c.status] || STATUS.aguardando
            return (
              <div key={c.id} style={{
                background: 'white',
                border: '1px solid #D9B794',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8864B')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#D9B794')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Monograma */}
                  <div style={{
                    width: '44px', height: '44px',
                    background: '#F4E6D4', border: '1px solid #D9B794',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
                    fontSize: '1.1rem', color: '#B8864B',
                  }}>
                    {c.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#1E120D', fontSize: '0.95rem' }}>
                      {c.nome}
                    </p>
                    <p style={{ color: '#A89070', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                      {new Date(c.criado_em).toLocaleDateString('pt-BR')}
                      {c.gargalo && (
                        <span style={{ color: '#B8864B', marginLeft: '0.5rem', fontWeight: 600 }}>
                          · {GARGALO[c.gargalo.principal] || c.gargalo.principal}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    fontSize: '0.7rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                    letterSpacing: '0.1em', padding: '0.3rem 0.75rem',
                    color: st.color, background: st.bg,
                  }}>
                    {st.label.toUpperCase()}
                  </span>
                  {c.status === 'concluido' && (
                    <Link href={`/clientes/${c.id}/diagnostico`} style={{ color: '#B8864B', fontWeight: 600, fontSize: '0.85rem' }}>
                      Ver diagnóstico →
                    </Link>
                  )}
                  {c.status === 'aguardando' && (
                    <Link href={`/clientes/${c.id}/processar`} style={{ color: '#8B7060', fontSize: '0.85rem' }}>
                      Processar →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
