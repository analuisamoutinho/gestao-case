import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from "@/lib/supabase/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [clienteRes, playbookRes] = await Promise.all([
    getSupabaseAdmin().from('clientes').select('*').eq('id', id).single(),
    getSupabaseAdmin().from('playbooks').select('*').eq('cliente_id', id).order('criado_em', { ascending: false }).limit(1).single(),
  ])

  if (clienteRes.error) return NextResponse.json({ error: clienteRes.error.message }, { status: 404 })

  return NextResponse.json({ cliente: clienteRes.data, playbook: playbookRes.data || null })
}
