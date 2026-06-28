import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function runDNAAgent(transcricao: string, materialExtra: string) {
  const prompt = `Você é um estrategista sênior da agência Case analisando a transcrição do onboarding de um novo cliente.

TRANSCRIÇÃO DA CALL:
${transcricao}

MATERIAL ADICIONAL (site, textos, etc.):
${materialExtra || 'Não fornecido'}

Extraia LITERALMENTE as palavras que o cliente usa — não parafraseie. A voz do cliente vira matéria-prima de criativo depois.

Retorne um JSON válido com exatamente esta estrutura:
{
  "perfil_negocio": {
    "modelo": "descrição do modelo de negócio",
    "ticket_medio": "valor ou faixa estimada",
    "produtos_servicos": ["produto/serviço 1", "produto/serviço 2"],
    "margem_estimada": "estimativa de margem",
    "estrutura_comercial": "como vendem (time, direto, online, etc.)"
  },
  "dna": {
    "dores": ["dor 1 nas palavras exatas do cliente", "dor 2"],
    "desejos": ["desejo 1 nas palavras exatas", "desejo 2"],
    "objecoes": ["objeção 1 literal", "objeção 2"],
    "linguagem": ["expressão/palavra marcante 1", "expressão 2", "jargão do setor"],
    "diferenciais": ["diferencial percebido 1", "diferencial 2"]
  }
}

Retorne APENAS o JSON, sem markdown, sem explicação.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text)
}
