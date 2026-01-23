import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, totalTime, subject } = await req.json();
    
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Conteúdo é obrigatório');
    }

    const systemPrompt = `Você é um especialista em pedagogia e planejamento de aulas. 
Analise o conteúdo fornecido e crie um plano de aula estruturado.

Crie um plano de aula em formato JSON com a seguinte estrutura:
{
  "subject": "Nome da disciplina/tema",
  "objective": "Objetivo principal da aula",
  "sections": [
    {
      "title": "Título da seção",
      "content": "Descrição detalhada do que será abordado",
      "duration": número em minutos,
      "activities": ["atividade 1", "atividade 2"]
    }
  ],
  "totalDuration": soma total dos minutos
}

Distribua o tempo de forma equilibrada entre as seções.
Inclua pelo menos 3 seções: introdução, desenvolvimento e conclusão.
Responda APENAS com o JSON, sem markdown ou explicações.`;

    const userPrompt = `Conteúdo para análise:
${content}

${subject ? `Disciplina/Tema: ${subject}` : ''}
Tempo total disponível: ${totalTime} minutos

A soma das durações deve ser igual a ${totalTime} minutos.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Tente novamente em alguns segundos.');
      }
      if (response.status === 402) {
        throw new Error('Créditos insuficientes. Adicione créditos no workspace.');
      }
      const errorText = await response.text();
      throw new Error(`AI Gateway error: ${errorText}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('Resposta vazia da API');
    }

    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const lessonPlan = JSON.parse(text);

    return new Response(JSON.stringify(lessonPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao gerar plano de aula';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
