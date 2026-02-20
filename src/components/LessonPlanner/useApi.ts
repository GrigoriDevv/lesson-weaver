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
        // Check status from the error context
        const status = (fnError as any)?.status;
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

  return {
    generateLessonPlan,
    isLoading,
    isGeneratingSlides,
    error,
    clearError,
  };
};
