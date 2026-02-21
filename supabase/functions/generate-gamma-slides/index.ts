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
    const { subject, objective, sections, gammaApiKey } = await req.json();

    const GAMMA_API_KEY = Deno.env.get("GAMMA_API_KEY") || gammaApiKey;
    if (!GAMMA_API_KEY) {
      throw new Error("GAMMA_API_KEY is not configured. Set it as a Supabase secret or pass via VITE_GAMMA_API_KEY.");
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
        textMode: "preserve",
        format: "presentation",
        numCards: Math.min(sections?.length + 2 || 8, 15),
        exportAs: "pptx",
        workspaceAccess: "edit",
        sharingOptions: {
          externalAccess: "edit",
        },
        additionalInstructions: "Mantenha todo o conteúdo em português do Brasil. Não traduza nada para inglês.",
        textOptions: {
          language: "pt",
          amount: "detailed",
          tone: "didático, profissional",
          audience: "professores e alunos brasileiros",
        },
          cardOptions: {
          dimensions: "16x9",
        },
        imageOptions: {
          source: "aiGenerated",
          style: "educacional, moderno, limpo",
        },
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

    console.log("Gamma completed result keys:", Object.keys(result));
    console.log("Gamma completed result:", JSON.stringify(result));

    let pptxUrl = result.pptxUrl || result.exportUrl || result.downloadUrl
      || result.fileUrl || result.exports?.pptx || null;
    let pdfUrl = result.pdfUrl || result.exports?.pdf || null;
    const gammaUrl = result.gammaUrl || result.url || null;

    // Step 3: If no download URLs, explicitly request export
    if (!pptxUrl && generationId) {
      try {
        const exportResponse = await fetch(
          `https://public-api.gamma.app/v1.0/generations/${generationId}/export`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": GAMMA_API_KEY,
            },
            body: JSON.stringify({ format: "pptx" }),
          }
        );

        if (exportResponse.ok) {
          const exportData = await exportResponse.json();
          console.log("Gamma export response:", JSON.stringify(exportData));

          const exportId = exportData.exportId || exportData.id;

          if (exportId) {
            for (let j = 0; j < 15; j++) {
              await new Promise((resolve) => setTimeout(resolve, 2000));

              const exportStatusResponse = await fetch(
                `https://public-api.gamma.app/v1.0/generations/${generationId}/export/${exportId}`,
                { headers: { "X-API-KEY": GAMMA_API_KEY } }
              );

              if (exportStatusResponse.ok) {
                const exportStatus = await exportStatusResponse.json();
                console.log("Gamma export status:", JSON.stringify(exportStatus));

                if (exportStatus.status === "completed" || exportStatus.url || exportStatus.downloadUrl) {
                  pptxUrl = exportStatus.url || exportStatus.downloadUrl || exportStatus.pptxUrl || null;
                  break;
                }
              }
            }
          } else if (exportData.url || exportData.downloadUrl) {
            pptxUrl = exportData.url || exportData.downloadUrl;
          }
        }
      } catch (exportErr) {
        console.error("Gamma export request failed:", exportErr);
      }
    }

    return new Response(
      JSON.stringify({
        gammaUrl,
        pptxUrl,
        pdfUrl,
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
