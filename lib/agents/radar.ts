import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const GARGALOS = ['trafego', 'conversao', 'oferta', 'comercial', 'posicionamento', 'retencao'] as const
export type Gargalo = typeof GARGALOS[number]

export async function runRadarAgent(perfil: object, dna: object, scores: object) {
  const prompt = `Você é o estrategista-chefe da agência Case. Sua função mais crítica é identificar o ÚNICO gargalo principal que está impedindo o crescimento deste negócio AGORA.

PERFIL DO NEGÓCIO:
${JSON.stringify(perfil, null, 2)}

DNA DO CLIENTE:
${JSON.stringify(dna, null, 2)}

SCORES DE MATURIDADE:
${JSON.stringify(scores, null, 2)}

## Definição dos gargalos
- **trafego**: O negócio não atrai pessoas suficientes (visitantes, seguidores, leads). O problema está antes da venda.
- **conversao**: Tem tráfego mas não converte — landing pages ruins, processo de vendas falho, abandono de carrinho.
- **oferta**: O produto/serviço em si não é atraente o suficiente, precificação errada, ou proposta de valor confusa.
- **comercial**: Time de vendas, processo comercial, CRM, follow-up — a máquina de vendas está quebrada.
- **posicionamento**: O negócio não se diferencia, confunde o cliente, ou atinge o público errado.
- **retencao**: Os clientes compram uma vez e não voltam. LTV baixo, sem recorrência, sem indicação.

## Regra de ouro
Identifique o gargalo que, se resolvido, desbloquearia os demais. Este é o único que importa agora.
Esta resposta é OBRIGATÓRIA — nunca pode ficar vazia ou indefinida.

Retorne um JSON válido com exatamente esta estrutura:
{
  "principal": "um dos seis: trafego | conversao | oferta | comercial | posicionamento | retencao",
  "justificativa": "2-3 frases objetivas explicando POR QUE este é o gargalo principal e não outro",
  "sinais": ["sinal 1 que indica este gargalo", "sinal 2", "sinal 3"]
}

Retorne APENAS o JSON, sem markdown, sem explicação.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const result = JSON.parse(text)

  if (!GARGALOS.includes(result.principal)) {
    throw new Error(`Gargalo inválido retornado: ${result.principal}`)
  }

  return result
}
