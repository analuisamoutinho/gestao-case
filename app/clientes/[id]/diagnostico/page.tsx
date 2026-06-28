'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

type Cliente = {
  id: string; nome: string
  perfil_negocio: { modelo: string; ticket_medio: string; produtos_servicos: string[]; margem_estimada: string; estrutura_comercial: string }
  dna: { dores: string[]; desejos: string[]; objecoes: string[]; linguagem: string[]; diferenciais: string[] }
  scores: Record<string, { nota: number; justificativa: string }>
  gargalo: { principal: string; justificativa: string; sinais: string[] }
  meta: { faturamento_alvo?: string; prazo?: string }
}
type Playbook = {
  diagnostico_executivo: string
  prioridades: { ordem: number; acao: string; impacto: string; prazo: string }[]
  hipoteses: { hipotese: string; como_testar: string; prazo: string }[]
  roadmap_90d: { dias_1_30: { foco: string; acoes: string[] }; dias_31_60: { foco: string; acoes: string[] }; dias_61_90: { foco: string; acoes: string[] } }
  engenharia_reversa?: { meta_faturamento: string; calculos: string }
}

const GARGALO_CFG: Record<string, { label: string; cor: string; bg: string; borda: string }> = {
  trafego:        { label: 'TRÁFEGO',        cor: '#2563EB', bg: '#EFF6FF', borda: '#BFDBFE' },
  conversao:      { label: 'CONVERSÃO',      cor: '#B8864B', bg: '#FDF6EC', borda: '#E9D2B6' },
  oferta:         { label: 'OFERTA',         cor: '#7C3AED', bg: '#F5F3FF', borda: '#DDD6FE' },
  comercial:      { label: 'COMERCIAL',      cor: '#B8864B', bg: '#F4E6D4', borda: '#D9B794' },
  posicionamento: { label: 'POSICIONAMENTO', cor: '#9D174D', bg: '#FDF2F8', borda: '#FBCFE8' },
  retencao:       { label: 'RETENÇÃO',       cor: '#991B1B', bg: '#FEF2F2', borda: '#FECACA' },
}
const SCORE_LABELS: Record<string, string> = {
  marca: 'Marca', marketing: 'Marketing', comercial: 'Comercial', dados: 'Dados', operacao: 'Operação', gestao: 'Gestão',
}
const DNA_CFG = [
  { key: 'dores',       label: 'DORES',       cor: '#8B2020', bg: '#FEF2F2', borda: '#FECACA' },
  { key: 'desejos',     label: 'DESEJOS',     cor: '#3D6B3F', bg: '#F0FDF4', borda: '#BBF7D0' },
  { key: 'objecoes',    label: 'OBJEÇÕES',    cor: '#92400E', bg: '#FFFBEB', borda: '#FDE68A' },
  { key: 'linguagem',   label: 'LINGUAGEM',   cor: '#1E40AF', bg: '#EFF6FF', borda: '#BFDBFE' },
  { key: 'diferenciais',label: 'DIFERENCIAIS',cor: '#5B21B6', bg: '#F5F3FF', borda: '#DDD6FE' },
]
const IMPACTO: Record<string, { cor: string; bg: string }> = {
  alto:  { cor: '#8B2020', bg: '#FEF2F2' },
  medio: { cor: '#92400E', bg: '#FFFBEB' },
  baixo: { cor: '#3D6B3F', bg: '#F0FDF4' },
}

const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
    <div style={{ flex: 1, height: '1px', background: '#D9B794' }} />
    <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="2" fill="#B8864B" />
      <line x1="6" y1="0" x2="6" y2="3.5" stroke="#B8864B" strokeWidth="1" />
      <line x1="6" y1="8.5" x2="6" y2="12" stroke="#B8864B" strokeWidth="1" />
      <line x1="0" y1="6" x2="3.5" y2="6" stroke="#B8864B" strokeWidth="1" />
      <line x1="8.5" y1="6" x2="12" y2="6" stroke="#B8864B" strokeWidth="1" />
    </svg>
    <div style={{ flex: 1, height: '1px', background: '#D9B794' }} />
  </div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.2em', color: '#B8864B', marginBottom: '1.25rem' }}>
    {children}
  </p>
)

export default function DiagnosticoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [playbook, setPlaybook] = useState<Playbook | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/clientes/${id}`).then(r => r.json()).then(d => {
      setCliente(d.cliente); setPlaybook(d.playbook); setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#A89070', fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
      CARREGANDO DIAGNÓSTICO...
    </div>
  )
  if (!cliente) return <div style={{ textAlign: 'center', padding: '5rem', color: '#A89070' }}>Cliente não encontrado</div>

  const gcfg = GARGALO_CFG[cliente.gargalo?.principal] || GARGALO_CFG.trafego
  const radarData = cliente.scores
    ? Object.entries(cliente.scores).map(([k, v]) => ({ area: SCORE_LABELS[k] || k, nota: v.nota }))
    : []

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem' }} className="no-print">
        <div>
          <button onClick={() => router.push('/clientes')} style={{ color: '#A89070', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '1rem' }}>
            ← Voltar para clientes
          </button>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.2em', color: '#B8864B', marginBottom: '0.4rem' }}>
            DIAGNÓSTICO 360°
          </p>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#1E120D' }}>
            {cliente.nome}
          </h1>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            background: 'transparent', border: '1px solid #D9B794',
            color: '#8B7060', padding: '0.75rem 1.5rem',
            fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
            fontSize: '0.72rem', letterSpacing: '0.1em', cursor: 'pointer',
          }}
        >
          ↓ EXPORTAR PDF
        </button>
      </div>

      {/* GARGALO PRINCIPAL — destaque total */}
      {cliente.gargalo && (
        <div style={{ background: gcfg.bg, border: `2px solid ${gcfg.borda}`, padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
            <div style={{ flexShrink: 0 }}>
              {/* Rosa dos ventos */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke={gcfg.cor} strokeWidth="1.5" />
                <circle cx="24" cy="24" r="4" fill={gcfg.cor} />
                <polygon points="24,3 26.5,19 24,16 21.5,19" fill={gcfg.cor} />
                <polygon points="24,45 26.5,29 24,32 21.5,29" fill={gcfg.cor} opacity="0.5" />
                <polygon points="3,24 19,26.5 16,24 19,21.5" fill={gcfg.cor} />
                <polygon points="45,24 29,26.5 32,24 29,21.5" fill={gcfg.cor} opacity="0.5" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.2em', color: gcfg.cor, marginBottom: '0.25rem' }}>
                GARGALO PRINCIPAL IDENTIFICADO
              </p>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: '2.5rem', color: gcfg.cor, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                {gcfg.label}
              </h2>
              <p style={{ color: '#4A2E1F', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>{cliente.gargalo.justificativa}</p>
              {cliente.gargalo.sinais && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {cliente.gargalo.sinais.map((s, i) => (
                    <span key={i} style={{ fontSize: '0.72rem', color: gcfg.cor, background: 'white', border: `1px solid ${gcfg.borda}`, padding: '0.25rem 0.75rem', fontFamily: 'Manrope, sans-serif' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Diagnóstico Executivo */}
      {playbook?.diagnostico_executivo && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <SectionTitle>DIAGNÓSTICO EXECUTIVO</SectionTitle>
          <p style={{ color: '#4A2E1F', lineHeight: 1.8, fontSize: '0.95rem' }}>{playbook.diagnostico_executivo}</p>
        </div>
      )}

      {/* Grid: Radar + Perfil */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Radar de Maturidade */}
        {radarData.length > 0 && (
          <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem' }}>
            <SectionTitle>RADAR DE MATURIDADE</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#D9B794" />
                <PolarAngleAxis dataKey="area" tick={{ fill: '#8B7060', fontSize: 10, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }} />
                <Radar dataKey="nota" stroke="#B8864B" fill="#B8864B" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
              {Object.entries(cliente.scores).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#8B7060', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, width: '72px', letterSpacing: '0.05em' }}>
                    {(SCORE_LABELS[key] || key).toUpperCase()}
                  </span>
                  <div style={{ flex: 1, background: '#F4E6D4', height: '4px' }}>
                    <div style={{ background: '#B8864B', width: `${val.nota * 10}%`, height: '100%', transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, color: '#B8864B', width: '28px', textAlign: 'right' }}>
                    {val.nota}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Perfil do Negócio */}
        {cliente.perfil_negocio && (
          <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem' }}>
            <SectionTitle>PERFIL DO NEGÓCIO</SectionTitle>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                ['Modelo de Negócio', cliente.perfil_negocio.modelo],
                ['Ticket Médio', cliente.perfil_negocio.ticket_medio],
                ['Margem Estimada', cliente.perfil_negocio.margem_estimada],
                ['Estrutura Comercial', cliente.perfil_negocio.estrutura_comercial],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt style={{ fontSize: '0.65rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.12em', color: '#A89070', marginBottom: '0.2rem' }}>
                    {(label as string).toUpperCase()}
                  </dt>
                  <dd style={{ fontSize: '0.88rem', color: '#1E120D' }}>{value || '—'}</dd>
                </div>
              ))}
              {cliente.perfil_negocio.produtos_servicos?.length > 0 && (
                <div>
                  <dt style={{ fontSize: '0.65rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.12em', color: '#A89070', marginBottom: '0.5rem' }}>
                    PRODUTOS / SERVIÇOS
                  </dt>
                  <dd style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {cliente.perfil_negocio.produtos_servicos.map((p, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: '#F4E6D4', border: '1px solid #D9B794', color: '#4A2E1F', padding: '0.2rem 0.6rem' }}>
                        {p}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {cliente.meta?.faturamento_alvo && (
                <div style={{ borderTop: '1px solid #D9B794', paddingTop: '1rem' }}>
                  <dt style={{ fontSize: '0.65rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.12em', color: '#A89070', marginBottom: '0.2rem' }}>META</dt>
                  <dd style={{ fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, color: '#B8864B' }}>
                    {cliente.meta.faturamento_alvo}{cliente.meta.prazo && ` em ${cliente.meta.prazo}`}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* DNA do Cliente */}
      {cliente.dna && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <SectionTitle>DNA DO CLIENTE — VOZ LITERAL</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {DNA_CFG.map(({ key, label, cor, bg, borda }) => {
              const items = (cliente.dna as Record<string, string[]>)[key] || []
              if (!items.length) return null
              return (
                <div key={key}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.15em', color: cor, marginBottom: '0.5rem' }}>{label}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {items.map((item, i) => (
                      <span key={i} style={{ fontSize: '0.78rem', color: cor, background: bg, border: `1px solid ${borda}`, padding: '0.3rem 0.75rem', fontFamily: 'Manrope, sans-serif' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Divider />

      {/* Prioridades */}
      {playbook?.prioridades && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <SectionTitle>PRIORIDADES DE AÇÃO</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {playbook.prioridades.map(p => {
              const imp = IMPACTO[p.impacto] || IMPACTO.baixo
              return (
                <div key={p.ordem} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '0.875rem', borderBottom: '1px solid #F4E6D4' }}>
                  <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    border: '1px solid #B8864B', background: '#F4E6D4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 800, color: '#B8864B', fontSize: '0.85rem',
                  }}>{p.ordem}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#1E120D', fontSize: '0.9rem', lineHeight: 1.5 }}>{p.acao}</p>
                    <p style={{ color: '#A89070', fontSize: '0.75rem', marginTop: '0.25rem' }}>Prazo: {p.prazo}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.1em', padding: '0.25rem 0.6rem', color: imp.cor, background: imp.bg, border: `1px solid ${imp.cor}30`, flexShrink: 0 }}>
                    {p.impacto.toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Roadmap 90 dias */}
      {playbook?.roadmap_90d && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.2em', color: '#B8864B', marginBottom: '1.25rem' }}>
            ROADMAP 90 DIAS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { key: 'dias_1_30',  label: 'DIAS 1–30',  destaque: true },
              { key: 'dias_31_60', label: 'DIAS 31–60', destaque: false },
              { key: 'dias_61_90', label: 'DIAS 61–90', destaque: false },
            ].map(({ key, label, destaque }) => {
              const bloco = (playbook.roadmap_90d as Record<string, { foco: string; acoes: string[] }>)[key]
              return (
                <div key={key} style={{
                  background: destaque ? '#4A2E1F' : 'white',
                  border: `1px solid ${destaque ? '#4A2E1F' : '#D9B794'}`,
                  padding: '1.5rem',
                }}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.2em', color: destaque ? '#D9B794' : '#B8864B', marginBottom: '0.4rem' }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: destaque ? '#F4E6D4' : '#1E120D', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {bloco?.foco}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {bloco?.acoes?.map((a, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: destaque ? '#D9B794' : '#8B7060', lineHeight: 1.4 }}>
                        <span style={{ color: '#B8864B', flexShrink: 0, marginTop: '1px' }}>·</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Hipóteses */}
      {playbook?.hipoteses && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <SectionTitle>HIPÓTESES A TESTAR</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {playbook.hipoteses.map((h, i) => (
              <div key={i} style={{ borderLeft: '3px solid #B8864B', paddingLeft: '1.25rem' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#1E120D', fontSize: '0.88rem', marginBottom: '0.4rem' }}>{h.hipotese}</p>
                <p style={{ color: '#8B7060', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Como testar: {h.como_testar}</p>
                <p style={{ color: '#A89070', fontSize: '0.72rem' }}>Prazo: {h.prazo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engenharia reversa */}
      {playbook?.engenharia_reversa && (
        <div style={{ background: '#F4E6D4', border: '1px solid #D9B794', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <SectionTitle>ENGENHARIA REVERSA DA META</SectionTitle>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#B8864B', marginBottom: '0.75rem' }}>
            {playbook.engenharia_reversa.meta_faturamento}
          </p>
          <p style={{ color: '#4A2E1F', fontSize: '0.9rem', lineHeight: 1.7 }}>{playbook.engenharia_reversa.calculos}</p>
        </div>
      )}

      {/* Scores detalhados */}
      {cliente.scores && (
        <div style={{ background: 'white', border: '1px solid #D9B794', padding: '1.75rem' }}>
          <SectionTitle>SCORES DETALHADOS</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {Object.entries(cliente.scores).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.1em', color: '#8B7060' }}>
                    {(SCORE_LABELS[key] || key).toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, color: '#B8864B', fontSize: '0.85rem' }}>{val.nota}/10</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#A89070', lineHeight: 1.5 }}>{val.justificativa}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé do diagnóstico */}
      <Divider />
      <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
          <circle cx="20" cy="20" r="18" stroke="#D9B794" strokeWidth="1" />
          <circle cx="20" cy="20" r="3" fill="#D9B794" />
          <line x1="20" y1="3" x2="20" y2="15" stroke="#D9B794" strokeWidth="1" />
          <line x1="20" y1="25" x2="20" y2="37" stroke="#D9B794" strokeWidth="1" />
          <line x1="3" y1="20" x2="15" y2="20" stroke="#D9B794" strokeWidth="1" />
          <line x1="25" y1="20" x2="37" y2="20" stroke="#D9B794" strokeWidth="1" />
        </svg>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#D9B794' }}>
          CASE ACELERADORA — DIAGNÓSTICO 360°
        </p>
      </div>
    </div>
  )
}
