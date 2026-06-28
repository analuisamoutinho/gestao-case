import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from('clientes')
    .select('id, nome, status, criado_em, gargalo, scores')
    .order('criado_em', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, transcricao, material_extra, meta } = body
  const db = getSupabaseAdmin()

  const { data: cliente, error: clienteError } = await db
    .from('clientes')
    .insert({ nome, status: 'aguardando', meta: meta || {} })
    .select()
    .single()

  if (clienteError) return NextResponse.json({ error: clienteError.message }, { status: 500 })

  if (transcricao) {
    await db.from('fontes').insert({ cliente_id: cliente.id, tipo: 'transcricao', conteudo: transcricao })
  }
  if (material_extra) {
    await db.from('fontes').insert({ cliente_id: cliente.id, tipo: 'outro', conteudo: material_extra })
  }

  return NextResponse.json(cliente, { status: 201 })
}
