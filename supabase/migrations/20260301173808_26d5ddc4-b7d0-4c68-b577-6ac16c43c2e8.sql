-- Tabela para persistir planos e resultados de geração de slides
CREATE TABLE IF NOT EXISTS public.lesson_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  lesson_plan JSONB NOT NULL,
  gamma_url TEXT,
  pptx_url TEXT,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultas por usuário e recência
CREATE INDEX IF NOT EXISTS idx_lesson_generations_user_created_at
  ON public.lesson_generations (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lesson_generations_status
  ON public.lesson_generations (status);

-- Segurança
ALTER TABLE public.lesson_generations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lesson_generations'
      AND policyname = 'Users can view their own lesson generations'
  ) THEN
    CREATE POLICY "Users can view their own lesson generations"
      ON public.lesson_generations
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lesson_generations'
      AND policyname = 'Users can create their own lesson generations'
  ) THEN
    CREATE POLICY "Users can create their own lesson generations"
      ON public.lesson_generations
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lesson_generations'
      AND policyname = 'Users can update their own lesson generations'
  ) THEN
    CREATE POLICY "Users can update their own lesson generations"
      ON public.lesson_generations
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lesson_generations'
      AND policyname = 'Users can delete their own lesson generations'
  ) THEN
    CREATE POLICY "Users can delete their own lesson generations"
      ON public.lesson_generations
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lesson_generations_updated_at ON public.lesson_generations;
CREATE TRIGGER trg_lesson_generations_updated_at
BEFORE UPDATE ON public.lesson_generations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();