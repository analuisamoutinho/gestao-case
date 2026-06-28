'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  width: '100%',
  background: 'white',
  border: '1px solid #D9B794',
  padding: '0.875rem 1rem',
  color: '#1E120D',
  fontFamily: 'Manrope, Inter, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function NovoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '', transcricao: '', material_extra: '', faturamento_alvo: '', prazo: '',
  })
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome,
        transcricao: form.transcricao,
        material_extra: form.material_extra,
        meta: { faturamento_alvo: form.faturamento_alvo, prazo: form.prazo },
      }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push(`/clientes/${data.id}/processar`)
    } else {
      alert('Erro: ' + data.error)
      setLoading(false)
    }
  }

  const LabelEl = ({ children }: { children: React.ReactNode }) => (
    <label style={{
      display: 'block',
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 700,
      fontSize: '0.7rem',
      letterSpacing: '0.15em',
      color: '#B8864B',
      marginBottom: '0.5rem',
    }}>
      {children}
    </label>
  )

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        style={{ color: '#A89070', fontSize: '0.8rem', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        ← Voltar para clientes
      </button>

      {/* Header */}
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#B8864B', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, marginBottom: '0.5rem' }}>
        NOVO ONBOARDING
      </p>
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#1E120D', marginBottom: '0.5rem' }}>
        Cadastrar Cliente
      </h1>
      <p style={{ color: '#8B7060', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
        Cole a transcrição do onboarding e as informações do cliente para gerar o diagnóstico.
      </p>

      {/* Divisor */}
      <div style={{ height: '1px', background: '#D9B794', marginBottom: '2rem' }} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <LabelEl>NOME DO CLIENTE / EMPRESA *</LabelEl>
          <input
            type="text"
            required
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            onFocus={() => setFocused('nome')}
            onBlur={() => setFocused(null)}
            placeholder="Ex: Empresa XYZ Ltda"
            style={{ ...inputStyle, borderColor: focused === 'nome' ? '#B8864B' : '#D9B794' }}
          />
        </div>

        <div>
          <LabelEl>TRANSCRIÇÃO DA CALL DE ONBOARDING *</LabelEl>
          <textarea
            required
            value={form.transcricao}
            onChange={e => setForm({ ...form, transcricao: e.target.value })}
            onFocus={() => setFocused('transcricao')}
            onBlur={() => setFocused(null)}
            placeholder="Cole aqui a transcrição completa da reunião de onboarding. Quanto mais detalhada, mais preciso o diagnóstico."
            rows={12}
            style={{ ...inputStyle, resize: 'none', borderColor: focused === 'transcricao' ? '#B8864B' : '#D9B794' }}
          />
        </div>

        <div>
          <LabelEl>MATERIAL ADICIONAL <span style={{ color: '#A89070', fontWeight: 500 }}>(OPCIONAL)</span></LabelEl>
          <textarea
            value={form.material_extra}
            onChange={e => setForm({ ...form, material_extra: e.target.value })}
            onFocus={() => setFocused('material')}
            onBlur={() => setFocused(null)}
            placeholder="Texto do site, descrição de produtos, dados de vendas, outros materiais relevantes..."
            rows={5}
            style={{ ...inputStyle, resize: 'none', borderColor: focused === 'material' ? '#B8864B' : '#D9B794' }}
          />
        </div>

        {/* Metas */}
        <div style={{ background: '#F4E6D4', border: '1px solid #D9B794', padding: '1.25rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em', color: '#B8864B', marginBottom: '1rem' }}>
            METAS DO CLIENTE
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <LabelEl>META DE FATURAMENTO</LabelEl>
              <input
                type="text"
                value={form.faturamento_alvo}
                onChange={e => setForm({ ...form, faturamento_alvo: e.target.value })}
                onFocus={() => setFocused('fat')}
                onBlur={() => setFocused(null)}
                placeholder="Ex: R$ 500.000/mês"
                style={{ ...inputStyle, borderColor: focused === 'fat' ? '#B8864B' : '#D9B794' }}
              />
            </div>
            <div>
              <LabelEl>PRAZO PARA A META</LabelEl>
              <input
                type="text"
                value={form.prazo}
                onChange={e => setForm({ ...form, prazo: e.target.value })}
                onFocus={() => setFocused('prazo')}
                onBlur={() => setFocused(null)}
                placeholder="Ex: 6 meses"
                style={{ ...inputStyle, borderColor: focused === 'prazo' ? '#B8864B' : '#D9B794' }}
              />
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div style={{ height: '1px', background: '#D9B794' }} />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              flex: 1, background: 'transparent', border: '1px solid #D9B794',
              color: '#8B7060', padding: '1rem',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer',
            }}
          >
            CANCELAR
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2, background: loading ? '#C9A87A' : '#B8864B',
              border: 'none', color: 'white', padding: '1rem',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '0.1em', cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? 'CRIANDO...' : 'CRIAR E INICIAR DIAGNÓSTICO →'}
          </button>
        </div>
      </form>
    </div>
  )
}
