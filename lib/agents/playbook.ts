import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function runPlaybookAgent(
  perfil: object,
  dna: object,
  scores: object,
  gargalo: object,
  meta: object
) {
  const prompt = `Você é o estrategista-chefe da agência Case montando o plano de ação dos próximos 90 dias para um cliente.

PERFIL DO NEGÓCIO:
${JSON.stringify(perfil, null, 2)}

DNA DO CLIENTE:
${JSON.stringify(dna, null, 2)}

SCORES DE MATURIDADE:
${JSON.stringify(scores, null, 2)}

GARGALO PRINCIPAL IDENTIFICADO:
${JSON.stringify(gargalo, null, 2)}

METAS DO CLIENTE:
${JSON.stringify(meta, null, 2)}

## Regras do playbook
1. O plano DEVE atacar o gargalo identificado antes de qualquer outra coisa. Os primeiros 30 dias são inteiramente focados nisso.
2. Se o ticket médio estiver disponível no perfil, faça a engenharia reversa da meta (quantas vendas/leads/visitas são necessários para atingir o faturamento alvo).
3. Prioridades devem ser acionáveis — nada de "melhorar o marketing" sem especificar O QUE fazer.
4. Hipóteses devem ser testáveis com prazo curto (máximo 2 semanas por hipótese).

Retorne um JSON válido com exatamente esta estrutura:
{
  "diagnostico_executivo": "parágrafo de 3-4 frases resumindo a situação atual e o caminho proposto",
  "prioridades": [
    { "ordem": 1, "acao": "ação específica", "impacto": "alto|medio|baixo", "prazo": "X dias" },
    { "ordem": 2, "acao": "ação específica", "impacto": "alto|medio|baixo", "prazo": "X dias" },
    { "ordem": 3, "acao": "ação específica", "impacto": "alto|medio|baixo", "prazo": "X dias" }
  ],
  "hipoteses": [
    { "hipotese": "Se fizermos X, esperamos Y", "como_testar": "descrição do teste", "prazo": "X dias" },
    { "hipotese": "Se fizermos X, esperamos Y", "como_testar": "descrição do teste", "prazo": "X dias" }
  ],
  "roadmap_90d": {
    "dias_1_30": {
      "foco": "foco do período",
      "acoes": ["ação 1", "ação 2", "ação 3", "ação 4"]
    },
    "dias_31_60": {
      "foco": "foco do período",
      "acoes": ["ação 1", "ação 2", "ação 3", "ação 4"]
    },
    "dias_61_90": {
      "foco": "foco do período",
      "acoes": ["ação 1", "ação 2", "ação 3", "ação 4"]
    }
  },
  "engenharia_reversa": {
    "meta_faturamento": "valor da meta",
    "calculos": "descrição do caminho numérico para atingir a meta"
  }
}

Retorne APENAS o JSON, sem markdown, sem explicação.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text)
}
