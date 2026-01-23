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
    const { lessonPlan } = await req.json();
    
    const apiKey = Deno.env.get('GAMMA_API_KEY');
    if (!apiKey) {
      throw new Error('GAMMA_API_KEY not configured');
    }

    if (!lessonPlan) {
      throw new Error('Plano de aula é obrigatório');
    }

    // Build content for Gamma
    let content = `# ${lessonPlan.subject}\n\n`;
    content += `## Objetivo\n${lessonPlan.objective}\n\n`;
    
    lessonPlan.sections.forEach((section: any, index: number) => {
      content += `## ${index + 1}. ${section.title} (${section.duration} min)\n`;
      content += `${section.content}\n\n`;
      if (section.activities && section.activities.length > 0) {
        content += `### Atividades\n`;
        section.activities.forEach((activity: string) => {
          content += `- ${activity}\n`;
        });
        content += '\n';
      }
    });

    content += `\n**Duração Total:** ${lessonPlan.totalDuration} minutos`;

    // Create presentation using Gamma API
    const response = await fetch('https://api.gamma.app/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        content: content,
        format: 'presentation',
        title: `Plano de Aula: ${lessonPlan.subject}`,
        style: {
          theme: 'professional',
          tone: 'educational',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gamma API error:', errorText);
      
      // Return a fallback response with the content formatted for manual use
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Não foi possível gerar automaticamente. Use o conteúdo abaixo para criar manualmente no Gamma.',
        content: content,
        gammaUrl: 'https://gamma.app/create'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      url: data.url,
      presentationId: data.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao gerar apresentação';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
