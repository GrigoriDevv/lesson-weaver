import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateLessonContent, generateGammaPresentation, saveLessonLocally, getSavedLessons } from '@/lib/iaService';

const LessonPlanner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ content: string; presentationUrl: string } | null>(null);
  const [savedLessons, setSavedLessons] = useState(getSavedLessons());

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const content = await generateLessonContent(`Gere uma lição educativa sobre: ${prompt}`);
      const presentationUrl = await generateGammaPresentation(content, `Lição: ${prompt}`);
      const lesson = { title: prompt, content, presentationUrl };
      saveLessonLocally(lesson);
      setResult({ content, presentationUrl });
      setSavedLessons(getSavedLessons());
    } catch (error) {
      alert('Erro ao gerar lição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Input
        placeholder="Digite o tema da lição (ex: História do Brasil)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Gerando...' : 'Planejar Lição'}
      </Button>
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Conteúdo Gerado:</h2>
          <p>{result.content.substring(0, 200)}...</p>
          <a href={result.presentationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Ver Apresentação no Gamma
          </a>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-lg font-bold">Lições Salvas:</h2>
        <ul>
          {savedLessons.map((lesson, index) => (
            <li key={index}>
              <strong>{lesson.title}</strong>: <a href={lesson.presentationUrl} target="_blank" rel="noopener noreferrer">Ver Apresentação</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LessonPlanner;