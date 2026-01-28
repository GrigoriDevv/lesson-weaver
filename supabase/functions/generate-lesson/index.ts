import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, totalTime, subject, pdfContent } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build prompt with PDF content as research source
    let researchContext = "";
    if (pdfContent && pdfContent.trim()) {
      researchContext = `

FONTE DE PESQUISA (Use este material como base para o conteudo da aula):
${pdfContent}

`;
    }

    const systemPrompt = `Voce e um assistente especializado em criar planos de aula detalhados e estruturados para professores.
Voce deve criar planos praticos, engajadores e pedagogicamente eficazes.
IMPORTANTE: Retorne APENAS o JSON valido, sem markdown, sem blocos de codigo, sem explicacoes.`;

    const userPrompt = `Crie um plano de aula completo com as seguintes especificacoes:

Disciplina: ${subject || "Geral"}
Duracao total: ${totalTime} minutos
Conteudo principal: ${content}
${researchContext}

Estruture o plano em secoes logicas, distribuindo o tempo de forma equilibrada.
Inclua atividades praticas e momentos de interacao.
${pdfContent ? "IMPORTANTE: Baseie o conteudo da aula no material de pesquisa fornecido acima." : ""}

Retorne APENAS um objeto JSON valido (sem markdown) com esta estrutura exata:
{
  "subject": "nome da disciplina",
  "objective": "objetivo geral da aula em uma frase clara",
  "totalDuration": ${totalTime},
  "sections": [
    {
      "title": "Titulo da secao",
      "duration": numero_em_minutos,
      "content": "Descricao detalhada do que sera abordado nesta secao, incluindo conceitos e explicacoes",
      "activities": ["atividade pratica 1", "atividade pratica 2"]
    }
  ]
}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Limite de requisicoes excedido. Tente novamente mais tarde.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Creditos insuficientes. Adicione creditos ao seu workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar plano de aula" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("Resposta vazia da IA");
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanedContent = aiContent.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const lessonPlan = JSON.parse(cleanedContent);

    return new Response(JSON.stringify(lessonPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
