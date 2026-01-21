import React, { useState } from 'react';
import { BookOpen, Clock, Sparkles, FileText, Key, Download, Copy } from 'lucide-react';
import { useGemini } from './useGemini';
import { LessonPlan } from './types';
import {
  Container,
  Header,
  Title,
  Subtitle,
  MainContent,
  Panel,
  PanelTitle,
  TextArea,
  InputGroup,
  Label,
  Input,
  Button,
  LoadingSpinner,
  LessonPlanContainer,
  LessonCard,
  LessonHeader,
  LessonTitle,
  TimeBadge,
  LessonContent,
  TotalTime,
  ApiKeyInput,
  ApiKeyLabel,
  EmptyState,
  ErrorMessage,
  SkeletonLoader,
  Select,
  ExportButton,
  ButtonGroup
} from './styles';

const LessonPlanner: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [totalTime, setTotalTime] = useState(50);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);

  const { generateLessonPlan, isLoading, error, clearError } = useGemini();

  const handleGenerate = async () => {
    clearError();
    const plan = await generateLessonPlan(apiKey, content, totalTime, subject);
    if (plan) {
      setLessonPlan(plan);
    }
  };

  const handleExport = () => {
    if (!lessonPlan) return;

    let text = `PLANO DE AULA\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Disciplina: ${lessonPlan.subject}\n`;
    text += `Objetivo: ${lessonPlan.objective}\n`;
    text += `Duração Total: ${lessonPlan.totalDuration} minutos\n\n`;
    text += `SEÇÕES:\n`;
    text += `${'-'.repeat(50)}\n\n`;

    lessonPlan.sections.forEach((section, index) => {
      text += `${index + 1}. ${section.title} (${section.duration} min)\n`;
      text += `   ${section.content}\n`;
      if (section.activities && section.activities.length > 0) {
        text += `   Atividades:\n`;
        section.activities.forEach(activity => {
          text += `   • ${activity}\n`;
        });
      }
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plano-aula-${lessonPlan.subject.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!lessonPlan) return;

    let text = `📚 PLANO DE AULA\n\n`;
    text += `📖 Disciplina: ${lessonPlan.subject}\n`;
    text += `🎯 Objetivo: ${lessonPlan.objective}\n`;
    text += `⏱️ Duração: ${lessonPlan.totalDuration} minutos\n\n`;

    lessonPlan.sections.forEach((section, index) => {
      text += `${index + 1}. ${section.title} (${section.duration} min)\n`;
      text += `   ${section.content}\n\n`;
    });

    await navigator.clipboard.writeText(text);
    alert('Plano copiado para a área de transferência!');
  };

  return (
    <Container>
      <Header>
        <Title>📚 Planejador de Aulas IA</Title>
        <Subtitle>
          Transforme seu conteúdo em planos de aula estruturados com Gemini AI
        </Subtitle>
      </Header>

      <MainContent>
        <Panel>
          <PanelTitle>
            <FileText size={20} />
            Configuração
          </PanelTitle>

          <ApiKeyInput>
            <ApiKeyLabel>
              <Key size={16} />
              Chave da API Gemini (Google AI Studio)
            </ApiKeyLabel>
            <Input
              type="password"
              placeholder="Insira sua API Key do Gemini..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </ApiKeyInput>

          <InputGroup>
            <Label>Disciplina / Tema (opcional)</Label>
            <Input
              type="text"
              placeholder="Ex: Matemática, História, Biologia..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Duração da aula</Label>
            <Select
              value={totalTime}
              onChange={(e) => setTotalTime(Number(e.target.value))}
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={50}>50 minutos</option>
              <option value={60}>60 minutos (1 hora)</option>
              <option value={90}>90 minutos (1h30)</option>
              <option value={120}>120 minutos (2 horas)</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Conteúdo para a aula</Label>
            <TextArea
              placeholder="Cole aqui o conteúdo que deseja transformar em plano de aula...

Exemplo:
- Texto de um livro didático
- Anotações de estudo
- Tópicos que deseja abordar
- Links de referência
- Resumo de vídeo-aula"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                Gerando plano...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar Plano de Aula
              </>
            )}
          </Button>
        </Panel>

        <Panel>
          <PanelTitle>
            <BookOpen size={20} />
            Plano de Aula
          </PanelTitle>

          {isLoading ? (
            <SkeletonLoader>
              <div />
              <div />
              <div />
            </SkeletonLoader>
          ) : lessonPlan ? (
            <LessonPlanContainer>
              <LessonCard style={{ background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <LessonTitle style={{ color: '#00d9ff' }}>{lessonPlan.subject}</LessonTitle>
                <LessonContent style={{ color: '#e8e8e8' }}>
                  🎯 {lessonPlan.objective}
                </LessonContent>
              </LessonCard>

              {lessonPlan.sections.map((section, index) => (
                <LessonCard key={index}>
                  <LessonHeader>
                    <LessonTitle>
                      {index + 1}. {section.title}
                    </LessonTitle>
                    <TimeBadge>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {section.duration} min
                    </TimeBadge>
                  </LessonHeader>
                  <LessonContent>{section.content}</LessonContent>
                  {section.activities && section.activities.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <Label style={{ marginBottom: '0.5rem' }}>Atividades sugeridas:</Label>
                      <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8' }}>
                        {section.activities.map((activity, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </LessonCard>
              ))}

              <TotalTime>
                <span>{lessonPlan.totalDuration} minutos</span>
                <p>Tempo total do plano</p>
              </TotalTime>

              <ButtonGroup>
                <ExportButton onClick={handleCopy}>
                  <Copy size={14} style={{ marginRight: 6 }} />
                  Copiar
                </ExportButton>
                <ExportButton onClick={handleExport}>
                  <Download size={14} style={{ marginRight: 6 }} />
                  Exportar .txt
                </ExportButton>
              </ButtonGroup>
            </LessonPlanContainer>
          ) : (
            <EmptyState>
              <Sparkles />
              <p>
                Insira o conteúdo e clique em "Gerar Plano de Aula"
                para criar seu plano estruturado com IA
              </p>
            </EmptyState>
          )}
        </Panel>
      </MainContent>
    </Container>
  );
};

export default LessonPlanner;
