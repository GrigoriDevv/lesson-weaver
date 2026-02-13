import { useState, useCallback } from 'react';
import { LessonPlan } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const generateLessonPlan = useCallback(async (
    content: string,
    totalTime: number,
    subject: string,
    pdfContent?: string
  ): Promise<LessonPlan | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!content.trim() && !pdfContent?.trim()) {
        throw new Error('Por favor, insira o conteúdo para a aula ou envie um PDF.');
      }

      if (!GEMINI_API_KEY) {
        throw new Error('Chave da API Gemini não configurada. Adicione VITE_GEMINI_API_KEY no .env');
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let researchContext = "";
      if (pdfContent && pdfContent.trim()) {
        researchContext = `\n\nFONTE DE PESQUISA (Use este material como base para o conteudo da aula):\n${pdfContent}\n`;
      }

      const prompt = `Voce e um assistente especializado em criar planos de aula detalhados e estruturados para professores.
Voce deve criar planos praticos, engajadores e pedagogicamente eficazes.
IMPORTANTE: Retorne APENAS o JSON valido, sem markdown, sem blocos de codigo, sem explicacoes.

Crie um plano de aula completo com as seguintes especificacoes:

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
      "content": "Descricao detalhada do que sera abordado nesta secao",
      "activities": ["atividade pratica 1", "atividade pratica 2"]
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const aiContent = result.response.text();

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

      const lessonPlan = JSON.parse(cleanedContent) as LessonPlan;
      return lessonPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateLessonPlan,
    isLoading,
    isGeneratingSlides,
    error,
    clearError,
  };
};
