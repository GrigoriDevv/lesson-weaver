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

type Section = z.infer<typeof SectionSchema>;

type GammaUrls = {
  gammaUrl: string | null;
  pptxUrl: string | null;
  pdfUrl: string | null;
};

const buildGammaHeaders = (apiKey: string, includeJson = false) => ({
  ...(includeJson ? { "Content-Type": "application/json" } : {}),
  "X-API-KEY": apiKey,
  Authorization: `Bearer ${apiKey}`,
});

const extractGenerationId = (payload: any): string | null => {
  return (
    payload?.generationId ??
    payload?.id ??
    payload?.generation?.id ??
    payload?.data?.generationId ??
    payload?.data?.id ??
    null
  );
};

const extractStatus = (payload: any): string => {
  return String(payload?.status ?? payload?.state ?? payload?.phase ?? "").toLowerCase();
};

const extractUrls = (payload: any): GammaUrls => ({
  gammaUrl: payload?.gammaUrl ?? payload?.url ?? payload?.generationUrl ?? null,
  pptxUrl:
    payload?.pptxUrl ??
    payload?.exportUrl?.pptx ??
    payload?.downloadUrl?.pptx ??
    payload?.exports?.pptx?.url ??
    payload?.downloads?.pptx ??
    payload?.exportedFileUrl ??
    null,
  pdfUrl:
    payload?.pdfUrl ??
    payload?.exportUrl?.pdf ??
    payload?.downloadUrl?.pdf ??
    payload?.exports?.pdf?.url ??
    payload?.downloads?.pdf ??
    null,
});

const getResponseBody = async (response: Response): Promise<any> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.json();
    const validatedInput = GammaInputSchema.parse(rawBody);
    const { subject, objective, sections } = validatedInput;

    const GAMMA_API_KEY = Deno.env.get("GAMMA_API_KEY");
    if (!GAMMA_API_KEY) {
      throw new Error("GAMMA_API_KEY não está configurada no backend");
    }

    let inputText = `# ${subject || "Plano de Aula"}\n\n`;
    inputText += `## Objetivo\n${objective}\n\n`;

    sections.forEach((section: Section, index: number) => {
      inputText += `## ${index + 1}. ${section.title} (${section.duration} min)\n`;
      inputText += `${section.content}\n\n`;

      if (section.activities && section.activities.length > 0) {
        inputText += `### Atividades Práticas\n`;
        section.activities.forEach((activity: string) => {
          inputText += `- ${activity}\n`;
        });
        inputText += "\n";
      }
    });

    const createResponse = await fetch("https://public-api.gamma.app/v1.0/generations", {
      method: "POST",
      headers: buildGammaHeaders(GAMMA_API_KEY, true),
      body: JSON.stringify({
        inputText,
        textMode: "preserve",
        format: "presentation",
        numCards: Math.min(sections.length + 2, 15),
        exportAs: "pptx",
        sharingOptions: {
          externalAccess: "view",
          workspaceAccess: "view",
        },
        additionalInstructions:
          "IMPORTANTE: Todo o conteúdo DEVE estar em português do Brasil. Não traduza NADA para inglês.",
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

    const createData = await getResponseBody(createResponse);
    if (!createResponse.ok) {
      throw new Error(
        `Falha ao criar apresentação no Gamma (${createResponse.status}): ${
          createData?.message || createData?.error || createData?.raw || "erro desconhecido"
        }`
      );
    }

    const generationId = extractGenerationId(createData);
    if (!generationId) {
      throw new Error("Gamma não retornou generationId na criação");
    }

    let result: any = null;

    for (let i = 0; i < 60; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        `https://public-api.gamma.app/v1.0/generations/${generationId}`,
        { headers: buildGammaHeaders(GAMMA_API_KEY) }
      );

      const statusData = await getResponseBody(statusResponse);
      if (!statusResponse.ok) {
        continue;
      }

      const status = extractStatus(statusData);

      if (["completed", "complete", "succeeded", "success", "ready"].includes(status)) {
        result = statusData;
        break;
      }

      if (["failed", "error", "cancelled", "canceled"].includes(status)) {
        throw new Error(
          `Gamma falhou ao gerar os slides: ${statusData?.message || statusData?.error || status}`
        );
      }
    }

    if (!result) {
      throw new Error("O Gamma demorou demais para finalizar a geração. Tente novamente.");
    }

    const { gammaUrl, pptxUrl, pdfUrl } = extractUrls(result);

    return new Response(JSON.stringify({ gammaUrl, pptxUrl, pdfUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar slides";
    console.error("Error generating Gamma slides:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
