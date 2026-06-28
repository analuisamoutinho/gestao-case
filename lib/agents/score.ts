import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function runScoreAgent(perfil: object, dna: object, fontes: string) {
  const prompt = `Você é um estrategista sênior da agência Case avaliando a maturidade de negócio de um cliente.

PERFIL DO NEGÓCIO:
${JSON.stringify(perfil, null, 2)}

DNA DO CLIENTE:
${JSON.stringify(dna, null, 2)}

FONTES ADICIONAIS:
${fontes || 'Não fornecido'}

Avalie a maturidade do negócio de 0 a 10 em 6 áreas. Seja criterioso — um 8 ou 9 deve ser excepcional.
- 0-3: Iniciante, quase nada estruturado
- 4-6: Em desenvolvimento, bases existem mas são frágeis
- 7-8: Maduro, processos sólidos
- 9-10: Referência de mercado

Retorne um JSON válido com exatamente esta estrutura:
{
  "marca": { "nota": 0, "justificativa": "uma frase objetiva" },
  "marketing": { "nota": 0, "justificativa": "uma frase objetiva" },
  "comercial": { "nota": 0, "justificativa": "uma frase objetiva" },
  "dados": { "nota": 0, "justificativa": "uma frase objetiva" },
  "operacao": { "nota": 0, "justificativa": "uma frase objetiva" },
  "gestao": { "nota": 0, "justificativa": "uma frase objetiva" }
}

Retorne APENAS o JSON, sem markdown, sem explicação.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text)
}
