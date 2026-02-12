import PptxGenJS from "pptxgenjs";
import { LessonPlan } from "@/components/LessonPlanner/types";

export function generatePptx(lessonPlan: LessonPlan): void {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "ClassBuddy";
  pptx.title = lessonPlan.subject || "Plano de Aula";

  // Colors
  const PRIMARY = "344266";
  const ACCENT = "3758A1";
  const WHITE = "FFFFFF";
  const LIGHT_BG = "F0F0F5";
  const DARK_TEXT = "333333";
  const SUBTITLE_TEXT = "666666";

  // ── Slide 1: Cover ──
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: PRIMARY };
  coverSlide.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0.8,
    y: 1.5,
    w: "85%",
    fontSize: 40,
    bold: true,
    color: WHITE,
    fontFace: "Arial",
  });
  coverSlide.addText(lessonPlan.objective, {
    x: 0.8,
    y: 3.0,
    w: "85%",
    fontSize: 18,
    color: "CBD5E1",
    fontFace: "Arial",
  });
  coverSlide.addText(`Duração total: ${lessonPlan.totalDuration} minutos`, {
    x: 0.8,
    y: 4.2,
    w: "85%",
    fontSize: 14,
    color: "94A3B8",
    fontFace: "Arial",
  });
  coverSlide.addText("Gerado por ClassBuddy", {
    x: 0.8,
    y: 6.5,
    w: "85%",
    fontSize: 11,
    color: "64748B",
    fontFace: "Arial",
    italic: true,
  });

  // ── Slide 2: Objective ──
  const objSlide = pptx.addSlide();
  objSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.0,
    fill: { type: "solid", color: ACCENT },
  });
  objSlide.addText("🎯 Objetivo da Aula", {
    x: 0.8,
    y: 0.15,
    w: "85%",
    fontSize: 26,
    bold: true,
    color: WHITE,
    fontFace: "Arial",
  });
  objSlide.addText(lessonPlan.objective, {
    x: 0.8,
    y: 1.5,
    w: "85%",
    fontSize: 20,
    color: DARK_TEXT,
    fontFace: "Arial",
    lineSpacingMultiple: 1.4,
  });

  // ── Content Slides ──
  lessonPlan.sections.forEach((section, index) => {
    const slide = pptx.addSlide();

    // Header bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 1.0,
      fill: { type: "solid", color: ACCENT },
    });
    slide.addText(`${index + 1}. ${section.title}`, {
      x: 0.8,
      y: 0.15,
      w: "70%",
      fontSize: 24,
      bold: true,
      color: WHITE,
      fontFace: "Arial",
    });

    // Duration badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 10.5,
      y: 0.2,
      w: 1.8,
      h: 0.55,
      fill: { type: "solid", color: "FFC832" },
      rectRadius: 0.15,
    });
    slide.addText(`${section.duration} min`, {
      x: 10.5,
      y: 0.2,
      w: 1.8,
      h: 0.55,
      fontSize: 13,
      bold: true,
      color: DARK_TEXT,
      fontFace: "Arial",
      align: "center",
      valign: "middle",
    });

    // Content
    slide.addText(section.content, {
      x: 0.8,
      y: 1.4,
      w: "85%",
      fontSize: 16,
      color: DARK_TEXT,
      fontFace: "Arial",
      lineSpacingMultiple: 1.5,
    });

    // Activities
    if (section.activities && section.activities.length > 0) {
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 4.0,
        w: "85%",
        h: 0.01,
        fill: { type: "solid", color: "E2E8F0" },
      });
      slide.addText("Atividades Práticas:", {
        x: 0.8,
        y: 4.2,
        w: "85%",
        fontSize: 14,
        bold: true,
        color: ACCENT,
        fontFace: "Arial",
      });

      const activityRows: PptxGenJS.TableRow[] = section.activities.map(
        (activity) => [
          {
            text: "•",
            options: { fontSize: 14, color: ACCENT, align: "center" as const },
          },
          {
            text: activity,
            options: { fontSize: 14, color: SUBTITLE_TEXT },
          },
        ]
      );

      slide.addTable(activityRows, {
        x: 0.8,
        y: 4.6,
        w: 10.5,
        colW: [0.4, 10.1],
        border: { type: "none" } as any,
        fontFace: "Arial",
      });
    }
  });

  // ── Summary Slide ──
  const summarySlide = pptx.addSlide();
  summarySlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.0,
    fill: { type: "solid", color: PRIMARY },
  });
  summarySlide.addText("📋 Resumo do Plano", {
    x: 0.8,
    y: 0.15,
    w: "85%",
    fontSize: 26,
    bold: true,
    color: WHITE,
    fontFace: "Arial",
  });

  const summaryRows: PptxGenJS.TableRow[] = lessonPlan.sections.map(
    (section, i) => [
      {
        text: `${i + 1}`,
        options: {
          fontSize: 14,
          bold: true,
          color: WHITE,
          fill: { type: "solid" as const, color: ACCENT },
          align: "center" as const,
        },
      },
      {
        text: section.title,
        options: { fontSize: 14, color: DARK_TEXT },
      },
      {
        text: `${section.duration} min`,
        options: {
          fontSize: 13,
          bold: true,
          color: ACCENT,
          align: "center" as const,
        },
      },
    ]
  );

  summaryRows.push([
    { text: "", options: {} },
    {
      text: "Total",
      options: { fontSize: 15, bold: true, color: DARK_TEXT },
    },
    {
      text: `${lessonPlan.totalDuration} min`,
      options: {
        fontSize: 15,
        bold: true,
        color: PRIMARY,
        align: "center" as const,
      },
    },
  ]);

  summarySlide.addTable(summaryRows, {
    x: 0.8,
    y: 1.4,
    w: 10.5,
    colW: [0.6, 8.1, 1.8],
    border: { type: "solid", color: "E2E8F0", pt: 0.5 } as any,
    fontFace: "Arial",
    rowH: 0.5,
  });

  // Download
  const fileName = `plano_${(lessonPlan.subject || "aula").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`;
  pptx.writeFile({ fileName });
}
