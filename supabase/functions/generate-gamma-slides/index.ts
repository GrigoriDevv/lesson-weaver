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
    const { subject, objective, sections } = await req.json();

    const GAMMA_API_KEY = Deno.env.get("GAMMA_API_KEY");
    if (!GAMMA_API_KEY) {
      throw new Error("GAMMA_API_KEY is not configured");
    }

    // Build input text from lesson plan
    let inputText = `# ${subject || "Plano de Aula"}\n\n`;
    inputText += `## Objetivo\n${objective}\n\n`;
    sections?.forEach((section: any, index: number) => {
      inputText += `## ${index + 1}. ${section.title} (${section.duration} min)\n`;
      inputText += `${section.content}\n\n`;
      if (section.activities?.length > 0) {
        inputText += `### Atividades Práticas\n`;
        section.activities.forEach((a: string) => {
          inputText += `- ${a}\n`;
        });
        inputText += "\n";
      }
    });

    // Step 1: Create generation
    const createResponse = await fetch("https://public-api.gamma.app/v1.0/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": GAMMA_API_KEY,
      },
      body: JSON.stringify({
        inputText,
        textMode: "generate",
        format: "presentation",
        numCards: Math.min(sections?.length + 2 || 8, 15),
        exportAs: "pptx",
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Gamma API error:", createResponse.status, errorText);
      throw new Error(`Gamma API error: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    const generationId = createData.generationId;

    if (!generationId) {
      throw new Error("No generationId returned from Gamma");
    }

    // Step 2: Poll for completion (max 60s)
    let result = null;
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await fetch(
        `https://public-api.gamma.app/v1.0/generations/${generationId}`,
        {
          headers: { "X-API-KEY": GAMMA_API_KEY },
        }
      );

      if (!statusResponse.ok) {
        const errText = await statusResponse.text();
        console.error("Gamma status error:", statusResponse.status, errText);
        continue;
      }

      const statusData = await statusResponse.json();
      console.log("Gamma status:", statusData.status);

      if (statusData.status === "completed") {
        result = statusData;
        break;
      } else if (statusData.status === "failed") {
        throw new Error("Gamma generation failed");
      }
    }

    if (!result) {
      throw new Error("Gamma generation timed out");
    }

    return new Response(
      JSON.stringify({
        gammaUrl: result.gammaUrl,
        pptxUrl: result.pptxUrl || null,
        pdfUrl: result.pdfUrl || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating Gamma slides:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
