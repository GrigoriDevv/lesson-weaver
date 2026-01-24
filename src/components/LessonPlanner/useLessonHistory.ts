import { useState, useEffect, useCallback } from 'react';
import { LessonPlan } from './types';

export interface SavedLesson {
  id: string;
  lessonPlan: LessonPlan;
  createdAt: string;
}

const STORAGE_KEY = 'lesson-planner-history';

export const useLessonHistory = () => {
  const [history, setHistory] = useState<SavedLesson[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const saveLesson = useCallback((lessonPlan: LessonPlan) => {
    const newLesson: SavedLesson = {
      id: crypto.randomUUID(),
      lessonPlan,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const updated = [newLesson, ...prev].slice(0, 20); // Keep last 20
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newLesson;
  }, []);

  const deleteLesson = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((lesson) => lesson.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return {
    history,
    saveLesson,
    deleteLesson,
    clearHistory,
  };
};
