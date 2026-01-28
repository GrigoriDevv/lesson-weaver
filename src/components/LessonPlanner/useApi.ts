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
    subject: string,
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
        throw new Error(fnError.message || 'Erro ao gerar plano de aula');
      }

      if (data.error) {
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

  const generateSlides = useCallback(async (lessonPlan: LessonPlan): Promise<{
    success: boolean;
    url?: string;
    content?: string;
    gammaUrl?: string;
    message?: string;
  } | null> => {
    setIsGeneratingSlides(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-slides', {
        body: { lessonPlan },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Erro ao gerar apresentação');
      }

      if (data.error) {
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
    generateSlides,
    isLoading,
    isGeneratingSlides,
    error,
    clearError,
  };
};
