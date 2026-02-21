export function saveLessonLocally(lesson: { title: string; content: string; presentationUrl: string }) {
  const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
  lessons.push(lesson);
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

export function getSavedLessons(): { title: string; content: string; presentationUrl: string }[] {
  return JSON.parse(localStorage.getItem('lessons') || '[]');
}
