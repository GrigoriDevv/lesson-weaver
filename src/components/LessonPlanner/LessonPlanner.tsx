import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, FileText, Presentation } from 'lucide-react';
import { useApi } from './useApi';
import SlidePreview from './SlidePreview';
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
  Select,
  Button,
  LoadingSpinner,
  LessonPlanContainer,
  LessonCard,
  LessonHeader,
  LessonTitle,
  TimeBadge,
  LessonContent,
  TotalTime,
  EmptyState,
  ErrorMessage,
  SkeletonLoader,
  ButtonGroup,
} from './styles';

const LessonPlanner: React.FC = () => {
  const [content, setContent] = useState('');
  const [totalTime, setTotalTime] = useState(50);
  const [subject, setSubject] = useState('');
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [showSlidePreview, setShowSlidePreview] = useState(false);
  const [gammaResult, setGammaResult] = useState<{
    success: boolean;
    url?: string;
    content?: string;
    gammaUrl?: string;
    message?: string;
  } | null>(null);

  const { generateLessonPlan, generateSlides, isLoading, isGeneratingSlides, error, clearError } = useApi();

  const handleGenerate = async () => {
    clearError();
    const plan = await generateLessonPlan(content, totalTime, subject);
    if (plan) {
      setLessonPlan(plan);
    }
  };

  const handleGenerateSlides = async () => {
    if (!lessonPlan) return;
    const result = await generateSlides(lessonPlan);
    if (result) {
      setGammaResult(result);
      setShowSlidePreview(true);
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <BookOpen size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Planejador de Aulas com IA
        </Title>
        <Subtitle>
          Crie planos de aula estruturados e personalizados em segundos
        </Subtitle>
      </Header>

      <MainContent>
        <Panel>
          <PanelTitle>
            <FileText size={20} />
            Configuração da Aula
          </PanelTitle>

          <InputGroup>
            <Label>Disciplina</Label>
            <Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Selecione a disciplina</option>
              <option value="matematica">Matemática</option>
              <option value="portugues">Português</option>
              <option value="historia">História</option>
              <option value="geografia">Geografia</option>
              <option value="ciencias">Ciências</option>
              <option value="fisica">Física</option>
              <option value="quimica">Química</option>
              <option value="biologia">Biologia</option>
              <option value="ingles">Inglês</option>
              <option value="artes">Artes</option>
              <option value="educacao-fisica">Educação Física</option>
              <option value="filosofia">Filosofia</option>
              <option value="sociologia">Sociologia</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Duração Total (minutos)</Label>
            <Input
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(Number(e.target.value))}
              min={15}
              max={180}
              placeholder="Ex: 50"
            />
          </InputGroup>

          <InputGroup>
            <Label>Conteúdo da Aula</Label>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o conteúdo que será abordado na aula. Por exemplo: 'Equações do segundo grau - conceitos básicos, fórmula de Bhaskara e resolução de problemas práticos'"
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Gerando plano...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Gerar Plano de Aula
              </>
            )}
          </Button>
        </Panel>

        <Panel>
          <PanelTitle>
            <Clock size={20} />
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
              {lessonPlan.objective && (
                <LessonCard>
                  <LessonHeader>
                    <LessonTitle>🎯 Objetivo</LessonTitle>
                  </LessonHeader>
                  <LessonContent>{lessonPlan.objective}</LessonContent>
                </LessonCard>
              )}

              {lessonPlan.sections.map((section, index) => (
                <LessonCard key={index}>
                  <LessonHeader>
                    <LessonTitle>{section.title}</LessonTitle>
                    <TimeBadge>{section.duration} min</TimeBadge>
                  </LessonHeader>
                  <LessonContent>{section.content}</LessonContent>
                  {section.activities && section.activities.length > 0 && (
                    <LessonContent style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                      <strong>Atividades:</strong> {section.activities.join(', ')}
                    </LessonContent>
                  )}
                </LessonCard>
              ))}

              <TotalTime>
                <span>{lessonPlan.totalDuration} minutos</span>
                <p>Tempo total estimado</p>
              </TotalTime>

              <ButtonGroup>
                <Button
                  $variant="secondary"
                  onClick={handleGenerateSlides}
                  disabled={isGeneratingSlides}
                >
                  {isGeneratingSlides ? (
                    <>
                      <LoadingSpinner />
                      Gerando slides...
                    </>
                  ) : (
                    <>
                      <Presentation size={20} />
                      Gerar Slides
                    </>
                  )}
                </Button>
              </ButtonGroup>
            </LessonPlanContainer>
          ) : (
            <EmptyState>
              <BookOpen size={64} />
              <p>Configure sua aula e clique em "Gerar Plano de Aula" para começar</p>
            </EmptyState>
          )}
        </Panel>
      </MainContent>

      {showSlidePreview && lessonPlan && (
        <SlidePreview
          lessonPlan={lessonPlan}
          gammaResult={gammaResult}
          onClose={() => setShowSlidePreview(false)}
        />
      )}
    </Container>
  );
};

export default LessonPlanner;
