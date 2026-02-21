import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Clock,
  FileText,
  Presentation,
  Save,
  Upload,
  ExternalLink,
} from "lucide-react";
import { useApi } from "./useApi";
import { useLessonHistory } from "./useLessonHistory";
import SlidePreview from "./SlidePreview";
import LessonHistory from "./LessonHistory";
import { LessonPlan } from "./types";
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
  ActionButton,
  PDFUploadSection,
  PDFUploadLabel,
  PDFUploadArea,
  PDFClearButton,
} from "./styles";
import jsPDF from "jspdf";
import { extractTextFromPDF, truncatePDFText } from "@/lib/pdfService";
import { generatePptx } from "@/lib/pptxService";

const LessonPlanner: React.FC = () => {
  const [content, setContent] = useState("");
  const [totalTime, setTotalTime] = useState(50);
  const [subject, setSubject] = useState("");
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [showSlidePreview, setShowSlidePreview] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    generateLessonPlan,
    generateGammaSlides,
    isLoading,
    isGeneratingSlides,
    error,
    clearError,
  } = useApi();
  const { history, saveLesson, deleteLesson, clearHistory } =
    useLessonHistory();

  const handleGenerate = async () => {
    clearError();
    setIsSaved(false);
    const plan = await generateLessonPlan(content, totalTime, subject, pdfText);
    if (plan) {
      setLessonPlan(plan);
    }
  };

  const handleSaveLesson = () => {
    if (lessonPlan) {
      saveLesson(lessonPlan);
      setIsSaved(true);
    }
  };

  const handleSelectFromHistory = (plan: LessonPlan) => {
    setLessonPlan(plan);
    setSubject(plan.subject);
    setIsSaved(true);
  };

  const handleGenerateSlides = () => {
    if (!lessonPlan) return;
    setShowSlidePreview(true);
  };

  const handleGenerateGammaSlides = async () => {
    if (!lessonPlan) return;
    const result = await generateGammaSlides(lessonPlan);
    if (result?.gammaUrl) {
      window.open(result.gammaUrl, "_blank");
    }
  };

  const handleDownloadPptx = () => {
    if (!lessonPlan) return;
    generatePptx(lessonPlan);
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Envie apenas PDF");
      return;
    }
    setPdfFile(file);
    setLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      setPdfText(truncatePDFText(text));
      console.log("Texto extraído do PDF:", pdfText.substring(0, 200));
    } catch (error) {
      alert("Erro ao processar o PDF. Tente novamente.");
      setPdfText("");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!lessonPlan) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 25;

    // Header background
    doc.setFillColor(55, 88, 161);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PLANO DE AULA", margin, yPos);
    yPos += 12;

    // Subject
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(lessonPlan.subject || "Aula", margin, yPos);
    yPos += 25;

    // Info box
    doc.setFillColor(240, 240, 245);
    doc.rect(margin, yPos - 5, contentWidth, 25, 'F');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin + 5, yPos + 5);
    doc.text(`Duracao Total: ${lessonPlan.totalDuration} minutos`, margin + 80, yPos + 5);
    doc.text(`Secoes: ${lessonPlan.sections.length}`, margin + 5, yPos + 15);
    yPos += 30;

    // Objective Section
    doc.setFillColor(139, 92, 246);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OBJETIVO DA AULA", margin + 5, yPos + 6);
    yPos += 15;

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const objectiveLines = doc.splitTextToSize(lessonPlan.objective, contentWidth - 10);
    doc.text(objectiveLines, margin + 5, yPos);
    yPos += objectiveLines.length * 6 + 15;

    // Sections
    lessonPlan.sections.forEach((section, index) => {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 25;
      }

      // Section header with number
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, yPos, contentWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${index + 1}. ${section.title.toUpperCase()}`, margin + 5, yPos + 7);
      
      // Duration badge
      doc.setFillColor(255, 200, 50);
      const durationText = `${section.duration} min`;
      const badgeWidth = doc.getTextWidth(durationText) + 10;
      doc.rect(pageWidth - margin - badgeWidth - 5, yPos + 1, badgeWidth + 5, 8, 'F');
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(9);
      doc.text(durationText, pageWidth - margin - badgeWidth, yPos + 6.5);
      yPos += 18;

      // Section content
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const contentLines = doc.splitTextToSize(section.content, contentWidth - 10);
      doc.text(contentLines, margin + 5, yPos);
      yPos += contentLines.length * 5 + 8;

      // Activities
      if (section.activities && section.activities.length > 0) {
        doc.setFillColor(230, 245, 230);
        const activitiesHeight = section.activities.length * 6 + 12;
        doc.rect(margin + 10, yPos - 3, contentWidth - 20, activitiesHeight, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(34, 139, 34);
        doc.text("Atividades Praticas:", margin + 15, yPos + 5);
        yPos += 10;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        section.activities.forEach((activity) => {
          const activityLines = doc.splitTextToSize(`• ${activity}`, contentWidth - 35);
          doc.text(activityLines, margin + 20, yPos);
          yPos += activityLines.length * 5 + 2;
        });
        yPos += 5;
      }
      yPos += 8;
    });

    // Summary section
    if (yPos > 250) {
      doc.addPage();
      yPos = 25;
    }
    
    doc.setFillColor(52, 66, 102);
    doc.rect(margin, yPos, contentWidth, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("RESUMO DO PLANO", margin + 5, yPos + 7);
    yPos += 18;

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    lessonPlan.sections.forEach((section, index) => {
      doc.text(`${index + 1}. ${section.title} - ${section.duration} minutos`, margin + 5, yPos);
      yPos += 6;
    });
    
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${lessonPlan.totalDuration} minutos`, margin + 5, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado por ClassBuddy em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, margin, 290);

    // Save
    const fileName = `plano_${lessonPlan.subject?.replace(/\s+/g, "_") || "aula"}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  return (
    <Container>
      <Header>
        <Title>
          <BookOpen
            size={32}
            style={{ display: "inline", marginRight: "0.8rem" }}
            color="black"
          />
          ClassBuddy
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
              <optgroup label="Ensino Fundamental e Médio">
                <option value="matematica">Matemática</option>
                <option value="portugues">Português</option>
                <option value="historia">História</option>
                <option value="geografia">Geografia</option>
                <option value="ciencias">Ciências</option>
                <option value="biologia">Biologia</option>
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="ingles">Inglês</option>
                <option value="espanhol">Espanhol</option>
                <option value="educacao-fisica">Educação Física</option>
                <option value="artes">Artes</option>
                <option value="filosofia">Filosofia</option>
                <option value="sociologia">Sociologia</option>
                <option value="literatura">Literatura</option>
                <option value="redacao">Redação</option>
              </optgroup>
              <optgroup label="Ensino Superior">
                <option value="direito">Direito</option>
                <option value="administracao">Administração</option>
                <option value="contabilidade">Contabilidade</option>
                <option value="economia">Economia</option>
                <option value="engenharia">Engenharia</option>
                <option value="medicina">Medicina</option>
                <option value="enfermagem">Enfermagem</option>
                <option value="psicologia">Psicologia</option>
                <option value="pedagogia">Pedagogia</option>
                <option value="arquitetura">Arquitetura</option>
                <option value="ciencia-da-computacao">Ciência da Computação</option>
                <option value="sistemas-de-informacao">Sistemas de Informação</option>
                <option value="marketing">Marketing</option>
                <option value="comunicacao">Comunicação Social</option>
                <option value="farmacia">Farmácia</option>
                <option value="nutricao">Nutrição</option>
                <option value="fisioterapia">Fisioterapia</option>
                <option value="educacao-fisica-bacharelado">Educação Física (Bacharelado)</option>
              </optgroup>
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
              placeholder="Descreva o conteúdo que será abordado na aula. Por exemplo: 'Introdução ao React - componentes, props e estado'"
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <PDFUploadSection>
            <PDFUploadLabel>
              <FileText size={18} />
              Fonte de Pesquisa (PDF opcional)
            </PDFUploadLabel>
            <PDFUploadArea $hasFile={!!pdfText}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePDFUpload}
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>Processando PDF...</span>
                  </>
                ) : pdfText ? (
                  <>
                    <FileText size={24} />
                    <span>PDF carregado!</span>
                    <small>{pdfText.length.toLocaleString()} caracteres extraídos</small>
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    <span>Clique para enviar um PDF</span>
                    <small>O conteúdo será usado como base para o plano</small>
                  </>
                )}
              </label>
              {pdfText && (
                <PDFClearButton onClick={() => { setPdfText(""); setPdfFile(null); }}>
                  ✕
                </PDFClearButton>
              )}
            </PDFUploadArea>
          </PDFUploadSection>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || (!content.trim() && !pdfText.trim())}
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

          <LessonHistory
            history={history}
            onSelect={handleSelectFromHistory}
            onDelete={deleteLesson}
            onClear={clearHistory}
          />
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
                    <LessonContent
                      style={{ marginTop: "0.5rem", fontStyle: "italic" }}
                    >
                      <strong>Atividades:</strong>{" "}
                      {section.activities.join(", ")}
                    </LessonContent>
                  )}
                </LessonCard>
              ))}

              <TotalTime>
                <span>{lessonPlan.totalDuration} minutos</span>
                <p>Tempo total estimado</p>
              </TotalTime>

              <ButtonGroup>
                <ActionButton
                  $variant="save"
                  onClick={handleSaveLesson}
                  disabled={isSaved}
                >
                  <Save size={18} />
                  {isSaved ? "Salvo!" : "Salvar"}
                </ActionButton>
                <ActionButton
                  $variant="pdf"
                  onClick={exportToPDF}
                >
                  <FileText size={18} />
                  Exportar PDF
                </ActionButton>
                <ActionButton
                  $variant="slides"
                  onClick={handleGenerateSlides}
                >
                  <Presentation size={18} />
                  Visualizar Slides
                </ActionButton>
                <ActionButton
                  $variant="save"
                  onClick={handleGenerateGammaSlides}
                  disabled={isGeneratingSlides}
                >
                  {isGeneratingSlides ? (
                    <>
                      <LoadingSpinner />
                      Gerando no Gamma...
                    </>
                  ) : (
                    <>
                      <ExternalLink size={18} />
                      Gerar com Gamma
                    </>
                  )}
                </ActionButton>
              </ButtonGroup>
            </LessonPlanContainer>
          ) : (
            <EmptyState>
              <BookOpen size={64} />
              <p>
                Configure sua aula e clique em "Gerar Plano de Aula" para
                começar
              </p>
            </EmptyState>
          )}
        </Panel>
      </MainContent>

      {showSlidePreview && lessonPlan && (
        <SlidePreview
          lessonPlan={lessonPlan}
          onClose={() => setShowSlidePreview(false)}
          onDownloadPptx={handleDownloadPptx}
        />
      )}
    </Container>
  );
};

export default LessonPlanner;
