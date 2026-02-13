import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GAMMA_API_KEY = import.meta.env.VITE_GAMMA_API_KEY;

if (!GEMINI_API_KEY || !GAMMA_API_KEY) {
  throw new Error('API keys for Gemini and Gamma are required in .env');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function generateLessonContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating lesson with Gemini:', error);
    throw new Error('Failed to generate lesson content');
  }
}

export async function generateGammaPresentation(content: string, title: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.gamma.app/v1/generates',
      {
        type: 'presentation',
        prompt: `Crie uma apresentação baseada nesta lição: ${content}`,
        title,
        language: 'pt-BR',
      },
      {
        headers: {
          'Authorization': `Bearer ${GAMMA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error('Error generating presentation with Gamma:', error);
    throw new Error('Failed to generate presentation');
  }
}

export function saveLessonLocally(lesson: { title: string; content: string; presentationUrl: string }) {
  const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
  lessons.push(lesson);
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

export function getSavedLessons(): { title: string; content: string; presentationUrl: string }[] {
  return JSON.parse(localStorage.getItem('lessons') || '[]');
}