import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SectionSchema = z.object({
  title: z.string().max(200),
  duration: z.number().int().min(1).max(240),
  content: z.string().max(10000),
  activities: z.array(z.string().max(1000)).optional(),
});

const GammaInputSchema = z.object({
  subject: z.string().min(1).max(200),
  objective: z.string().min(1).max(500),
  sections: z.array(SectionSchema).min(1).max(20),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authentication check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing authorization header" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
  if (authError || !claimsData?.claims) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Input validation
    const rawBody = await req.json();
    let validatedInput;
    try {
      validatedInput = GammaInputSchema.parse(rawBody);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({ error: "Invalid input", details: validationError.errors }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw validationError;
    }

    const { subject, objective, sections } = validatedInput;

    const GAMMA_API_KEY = Deno.env.get("GAMMA_API_KEY");
    if (!GAMMA_API_KEY) {
      throw new Error("GAMMA_API_KEY is not configured as a Supabase secret");
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
        sharingOptions: {
          externalAccess: "view",
          workspaceAccess: "view",
        },
        additionalInstructions: "IMPORTANTE: Todo o conteúdo DEVE estar em português do Brasil. Não traduza NADA para inglês.",
        textOptions: {
          language: "pt-br",
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
      console.error("Gamma API error:", createResponse.status);
      throw new Error(`Gamma API error: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    const generationId = createData.generationId;

    if (!generationId) {
      throw new Error("No generationId returned from Gamma");
    }

    console.log("Generation created with ID:", generationId);

    // Step 2: Poll for completion (max 90s)
    let result = null;
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        `https://public-api.gamma.app/v1.0/generations/${generationId}`,
        {
          headers: { "X-API-KEY": GAMMA_API_KEY },
        }
      );

      if (!statusResponse.ok) {
        await statusResponse.text();
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
      throw new Error("Gamma generation timed out after 90 seconds");
    }

    let pptxUrl = result.pptxUrl || result.exportUrl?.pptx || result.downloadUrl?.pptx || null;
    let pdfUrl = result.pdfUrl || result.exportUrl?.pdf || null;
    const gammaUrl = result.gammaUrl || result.url || null;

    // Step 3: Export PPTX if not available
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

        if (!exportResponse.ok) {
          await exportResponse.text();
          throw new Error(`Gamma export error: ${exportResponse.status}`);
        }

        const exportData = await exportResponse.json();
        const exportId = exportData.exportId || exportData.id;

        if (exportId) {
          for (let j = 0; j < 20; j++) {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const exportStatusResponse = await fetch(
              `https://public-api.gamma.app/v1.0/generations/${generationId}/export/${exportId}`,
              { headers: { "X-API-KEY": GAMMA_API_KEY } }
            );

            if (exportStatusResponse.ok) {
              const exportStatus = await exportStatusResponse.json();
              if (exportStatus.status === "completed") {
                pptxUrl = exportStatus.url || exportStatus.downloadUrl || exportStatus.pptxUrl || null;
                break;
              }
            } else {
              await exportStatusResponse.text();
            }
          }
        } else if (exportData.url || exportData.downloadUrl) {
          pptxUrl = exportData.url || exportData.downloadUrl;
        }
      } catch (exportErr) {
        console.error("Gamma export request failed");
      }
    }

    return new Response(
      JSON.stringify({ gammaUrl, pptxUrl, pdfUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating Gamma slides");
    return new Response(JSON.stringify({ error: "Erro ao gerar slides" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
