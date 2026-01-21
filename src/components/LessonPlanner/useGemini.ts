import { useState, useCallback } from 'react';
import { LessonPlan, GeminiResponse } from './types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLessonPlan = useCallback(async (
    apiKey: string,
    content: string,
    totalTime: number,
    subject: string
  ): Promise<LessonPlan | null> => {
    if (!apiKey) {
      setError('Por favor, insira sua chave da API do Gemini');
      return null;
    }

    if (!content.trim()) {
      setError('Por favor, insira o conteúdo para criar o plano de aula');
      return null;
    }

    setIsLoading(true);
    setError(null);

    const prompt = `
Você é um especialista em educação e planejamento de aulas. Analise o seguinte conteúdo e crie um plano de aula estruturado.

CONTEÚDO:
${content}

REQUISITOS:
- Disciplina/Tema: ${subject || 'A determinar pelo conteúdo'}
- Tempo total disponível: ${totalTime} minutos
- Divida o conteúdo em seções lógicas
- Cada seção deve ter um título, descrição resumida e tempo estimado
- A soma dos tempos deve ser igual ou menor que ${totalTime} minutos
- Inclua sugestões de atividades quando apropriado

RETORNE APENAS um JSON válido no seguinte formato (sem markdown, sem código, apenas o JSON):
{
  "subject": "Nome da disciplina ou tema",
  "objective": "Objetivo principal da aula",
  "sections": [
    {
      "title": "Título da seção",
      "content": "Resumo do conteúdo desta seção",
      "duration": 10,
      "activities": ["Atividade 1", "Atividade 2"]
    }
  ],
  "totalDuration": ${totalTime}
}
`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao chamar a API do Gemini');
      }

      const data: GeminiResponse = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error('Resposta vazia do Gemini');
      }

      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = textResponse.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7);
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();

      const lessonPlan: LessonPlan = JSON.parse(cleanedResponse);
      return lessonPlan;
    } catch (err) {
      console.error('Gemini API Error:', err);
      if (err instanceof SyntaxError) {
        setError('Erro ao processar resposta do Gemini. Tente novamente.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao gerar plano de aula');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateLessonPlan,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
