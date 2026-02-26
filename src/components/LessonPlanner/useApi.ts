import { useState, useCallback } from 'react';
import { LessonPlan } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const generateLessonPlan = useCallback(async (
    content: string,
    totalTime: number,
    subject?: string,
    pdfContent?: string
  ): Promise<LessonPlan | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!content.trim() && !pdfContent?.trim()) {
        throw new Error('Por favor, insira o conteúdo para a aula ou envie um PDF.');
      }

      const { data, error: fnError } = await supabase.functions.invoke('generate-lesson', {
        body: { content, totalTime, subject, pdfContent },
      });

      if (fnError) {
        // Check status from the error context
        const status = fnError && typeof fnError === 'object' && 'status' in fnError
          ? (fnError as { status?: number }).status
          : undefined;
        if (status === 429) {
          throw new Error('⏳ Limite de requisições atingido. Aguarde alguns segundos e tente novamente.');
        }
        if (status === 402) {
          throw new Error('💳 Créditos insuficientes. Adicione créditos ao seu workspace para continuar gerando planos.');
        }
        throw new Error(fnError.message || 'Erro ao chamar a função de geração');
      }

      if (data?.error) {
        if (data.error.includes('Limite de requisicoes') || data.error.includes('rate')) {
          throw new Error('⏳ Limite de requisições atingido. Aguarde alguns segundos e tente novamente.');
        }
        if (data.error.includes('Creditos insuficientes') || data.error.includes('credits') || data.error.includes('Payment')) {
          throw new Error('💳 Créditos insuficientes. Adicione créditos ao seu workspace para continuar gerando planos.');
        }
        throw new Error(data.error);
      }

      return data as LessonPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  console.log(generateLessonPlan);

  const generateGammaSlides = useCallback(async (
    lessonPlan: LessonPlan
  ): Promise<{ gammaUrl: string; pptxUrl?: string; pdfUrl?: string } | null> => {
    setIsGeneratingSlides(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-gamma-slides', {
        body: {
          subject: lessonPlan.subject,
          objective: lessonPlan.objective,
          sections: lessonPlan.sections,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Erro ao gerar slides no Gamma');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setIsGeneratingSlides(false);
    }
  }, []);

  return {
    generateLessonPlan,
    generateGammaSlides,
    isLoading,
    isGeneratingSlides,
    error,
    clearError,
  };
};
