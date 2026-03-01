import { useState, useEffect, useCallback } from 'react';
import { LessonPlan } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SavedLesson {
  id: string;
  lessonPlan: LessonPlan;
  createdAt: string;
  gammaUrl?: string;
  pptxUrl?: string;
  pdfUrl?: string;
}

export const useLessonHistory = () => {
  const [history, setHistory] = useState<SavedLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchHistory = useCallback(async () => {
    if (!user) { setHistory([]); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      setHistory((data ?? []).map((row: any) => ({
        id: row.id,
        lessonPlan: row.lesson_plan as LessonPlan,
        createdAt: row.created_at,
        gammaUrl: row.gamma_url,
        pptxUrl: row.pptx_url,
        pdfUrl: row.pdf_url,
      })));
    } catch {
      // fallback silently
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const saveLesson = useCallback(async (lessonPlan: LessonPlan, gammaResult?: { gammaUrl?: string; pptxUrl?: string; pdfUrl?: string }) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('lesson_generations')
        .insert({
          user_id: user.id,
          subject: lessonPlan.subject || 'Plano de Aula',
          lesson_plan: lessonPlan as any,
          gamma_url: gammaResult?.gammaUrl || null,
          pptx_url: gammaResult?.pptxUrl || null,
          pdf_url: gammaResult?.pdfUrl || null,
        })
        .select()
        .single();

      if (error) throw error;

      const saved: SavedLesson = {
        id: data.id,
        lessonPlan,
        createdAt: data.created_at,
        gammaUrl: data.gamma_url,
        pptxUrl: data.pptx_url,
        pdfUrl: data.pdf_url,
      };

      setHistory(prev => [saved, ...prev]);
      return saved;
    } catch {
      return null;
    }
  }, [user]);

  const deleteLesson = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('lesson_generations').delete().eq('id', id);
    setHistory(prev => prev.filter(l => l.id !== id));
  }, [user]);

  const clearHistory = useCallback(async () => {
    if (!user) return;
    await supabase.from('lesson_generations').delete().eq('user_id', user.id);
    setHistory([]);
  }, [user]);

  return {
    history,
    loading,
    saveLesson,
    deleteLesson,
    clearHistory,
    refetch: fetchHistory,
  };
};
