// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":"*",
};

const LessonInputSchema = z.object({
  content: z.string().min(1, "Content is required").max(50000, "Content too long"),
  totalTime: z.number().int().min(10, "Minimum 10 minutes").max(480, "Maximum 8 hours"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  pdfContent: z.string().max(100000, "PDF content too large").optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Input validation
    const rawBody = await req.json();
    let validatedInput;
    try {
      validatedInput = LessonInputSchema.parse(rawBody);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({ error: "Invalid input", details: validationError.errors }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw validationError;
    }

    const { content, totalTime, subject, pdfContent } = validatedInput;

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

    const systemPrompt = `Voce e um professor universitario com doutorado e vasta experiencia em sala de aula. Sua funcao e criar AULAS COMPLETAS, EXTENSAS e PROFUNDAS.
Voce NAO gera resumos, esquemas ou topicos — voce escreve o CONTEUDO INTEGRAL que sera apresentado em sala de aula.
Cada secao deve parecer um capitulo de livro didatico: com introducao ao tema, desenvolvimento completo dos conceitos, exemplos resolvidos passo a passo, estudos de caso, analogias, contexto historico quando relevante, e fechamento com reflexao.
O conteudo deve ser EXTENSO — quanto maior a duracao da aula, mais denso e aprofundado deve ser o material.
IMPORTANTE: Retorne APENAS o JSON valido, sem markdown, sem blocos de codigo, sem explicacoes fora do JSON.`;

    const numSections = totalTime <= 60 ? 5 : totalTime <= 120 ? 7 : totalTime <= 180 ? 9 : 12;
    const minWordsPerSection = totalTime <= 60 ? 200 : totalTime <= 120 ? 350 : 500;

    const userPrompt = `Crie uma AULA COMPLETA, EXTENSA e APROFUNDADA com as seguintes especificacoes:

Disciplina: ${subject || "Geral"}
Duracao total: ${totalTime} minutos (${(totalTime / 60).toFixed(1)} horas)
Tema/Conteudo: ${content}
${researchContext}

REGRAS OBRIGATORIAS:

1. QUANTIDADE DE SECOES: Gere pelo menos ${numSections} secoes para cobrir adequadamente ${totalTime} minutos de aula.
2. PROFUNDIDADE DO CONTEUDO: Cada campo "content" DEVE ter no minimo ${minWordsPerSection} palavras. Isso e OBRIGATORIO.
3. CADA SECAO deve conter:
   - Introducao contextualizando o subtema dentro do tema geral
   - Explicacao teorica completa com definicoes formais e informais
   - Pelo menos 2 exemplos praticos detalhados e resolvidos passo a passo
   - Analogias e metaforas do cotidiano para facilitar a compreensao
   - Contexto historico ou curiosidades relevantes sobre o tema
   - Conexoes com outras areas do conhecimento (interdisciplinaridade)
   - Perguntas provocativas para debate e reflexao em sala
   - Transicao natural para a proxima secao
4. O texto deve ser escrito como a FALA COMPLETA do professor — nao como anotacoes ou slides. Deve ser fluido, didatico e pronto para ser lido em voz alta.
5. ATIVIDADES: Cada secao deve ter pelo menos 1 atividade pratica com instrucoes detalhadas passo a passo, materiais necessarios e resultado esperado.
6. DISTRIBUICAO DE TEMPO: Secoes mais complexas devem ter mais tempo. Inclua secoes de abertura, desenvolvimento e fechamento.
7. Para aulas longas (acima de 60 min), inclua secoes de intervalo/pausa e recapitulacao.
${pdfContent ? "8. OBRIGATORIO: Baseie TODO o conteudo no material de pesquisa fornecido. Extraia, desenvolva e aprofunde cada conceito do PDF com explicacoes proprias." : ""}
9. METODOLOGIA: Descreva a abordagem pedagogica utilizada (ex: aula expositiva dialogada, sala de aula invertida, aprendizagem baseada em problemas, etc.)
10. AVALIACAO: Descreva como o aprendizado sera avaliado (criterios, instrumentos, formas de verificacao)
11. RECURSOS: Liste todos os materiais e recursos necessarios (livros, slides, equipamentos, softwares, etc.)

Retorne APENAS um objeto JSON valido (sem markdown) com esta estrutura exata:
{
  "subject": "nome da disciplina",
  "objective": "objetivo geral da aula em uma frase clara, especifica e abrangente",
  "totalDuration": ${totalTime},
  "methodology": "Descricao detalhada da metodologia pedagogica utilizada na aula, incluindo abordagens, estrategias e justificativas didaticas.",
  "evaluation": "Descricao dos criterios e instrumentos de avaliacao, incluindo formas de verificacao da aprendizagem.",
  "resources": ["Recurso 1", "Recurso 2", "Recurso 3"],
  "sections": [
    {
      "title": "Titulo descritivo da secao",
      "duration": numero_em_minutos,
      "content": "CONTEUDO COMPLETO E EXTENSO. Minimo ${minWordsPerSection} palavras. Deve conter paragrafos completos com teoria, exemplos resolvidos, analogias, contexto e reflexoes. Escreva como um capitulo de livro didatico.",
      "activities": ["Atividade detalhada com passo-a-passo completo, materiais e resultado esperado"]
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
          max_tokens: 32000,
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
      console.error("AI gateway error:", response.status);
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
    return new Response(JSON.stringify({ error: "Erro ao gerar plano de aula" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
