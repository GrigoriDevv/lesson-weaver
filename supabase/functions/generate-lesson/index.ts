import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, totalTime, subject } = await req.json();
    
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Conteúdo é obrigatório');
    }

    const prompt = `Você é um especialista em pedagogia e planejamento de aulas. 
    Analise o conteúdo fornecido e crie um plano de aula estruturado.

    Conteúdo para análise:
    ${content}

    ${subject ? `Disciplina/Tema: ${subject}` : ''}
    Tempo total disponível: ${totalTime} minutos

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
    A soma das durações deve ser igual a ${totalTime} minutos.
    Inclua pelo menos 3 seções: introdução, desenvolvimento e conclusão.
    Responda APENAS com o JSON, sem markdown ou explicações.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Resposta vazia da API Gemini');
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
