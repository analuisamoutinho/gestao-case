import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { runDNAAgent } from '@/lib/agents/dna'
import { runScoreAgent } from '@/lib/agents/score'
import { runRadarAgent } from '@/lib/agents/radar'
import { runPlaybookAgent } from '@/lib/agents/playbook'

export async function POST(req: NextRequest) {
  const { cliente_id } = await req.json()
  if (!cliente_id) return NextResponse.json({ error: 'cliente_id obrigatório' }, { status: 400 })

  const db = getSupabaseAdmin()

  const [clienteRes, fontesRes] = await Promise.all([
    db.from('clientes').select('*').eq('id', cliente_id).single(),
    db.from('fontes').select('*').eq('cliente_id', cliente_id),
  ])

  if (clienteRes.error) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })

  const cliente = clienteRes.data
  const fontes = fontesRes.data || []
  const transcricao = fontes.find((f: { tipo: string }) => f.tipo === 'transcricao')?.conteudo || ''
  const materialExtra = fontes
    .filter((f: { tipo: string }) => f.tipo !== 'transcricao')
    .map((f: { conteudo: string }) => f.conteudo)
    .join('\n\n')

  try {
    await db.from('clientes').update({ status: 'processando' }).eq('id', cliente_id)

    const dnaResult = await runDNAAgent(transcricao, materialExtra)
    await db
      .from('clientes')
      .update({ perfil_negocio: dnaResult.perfil_negocio, dna: dnaResult.dna })
      .eq('id', cliente_id)

    const scores = await runScoreAgent(dnaResult.perfil_negocio, dnaResult.dna, materialExtra)
    await db.from('clientes').update({ scores }).eq('id', cliente_id)

    const gargalo = await runRadarAgent(dnaResult.perfil_negocio, dnaResult.dna, scores)
    await db.from('clientes').update({ gargalo }).eq('id', cliente_id)

    const playbookData = await runPlaybookAgent(
      dnaResult.perfil_negocio,
      dnaResult.dna,
      scores,
      gargalo,
      cliente.meta || {}
    )

    await db.from('playbooks').insert({
      cliente_id,
      diagnostico_executivo: playbookData.diagnostico_executivo,
      prioridades: playbookData.prioridades,
      hipoteses: playbookData.hipoteses,
      roadmap_90d: playbookData.roadmap_90d,
    })

    await db.from('clientes').update({ status: 'concluido' }).eq('id', cliente_id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    await db.from('clientes').update({ status: 'erro' }).eq('id', cliente_id)
    console.error(err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
