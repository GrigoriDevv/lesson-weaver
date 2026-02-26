/* eslint-disable @typescript-eslint/no-explicit-any -- pptxgenjs API uses loose types; consider narrowing when library types improve */
import PptxGenJS from "pptxgenjs";
import { LessonPlan } from "@/components/LessonPlanner/types";

// Palette
const DEEP_NAVY = "1B2A4A";
const ROYAL_BLUE = "2E5090";
const VIVID_BLUE = "4A90D9";
const SOFT_BLUE = "6BB5F0";
const TEAL = "1ABC9C";
const AMBER = "F5A623";
const CORAL = "E74C3C";
const WHITE = "FFFFFF";
const OFF_WHITE = "F8FAFC";
const LIGHT_GRAY = "E2E8F0";
const DARK_TEXT = "1E293B";
const MEDIUM_TEXT = "475569";
const MUTED_TEXT = "94A3B8";

// Section accent colors for variety
const SECTION_COLORS = [
  "2E5090", "1ABC9C", "E67E22", "9B59B6", "E74C3C",
  "3498DB", "27AE60", "F39C12", "8E44AD", "16A085",
];

function addFooter(slide: PptxGenJS.Slide) {
  slide.addShape("rect" as any, {
    x: 0, y: 6.85, w: "100%", h: 0.65,
    fill: { type: "solid", color: DEEP_NAVY },
  });
  slide.addText("ClassBuddy", {
    x: 0.6, y: 6.92, w: 3, h: 0.45,
    fontSize: 10, bold: true, color: SOFT_BLUE, fontFace: "Segoe UI",
  });
  slide.addText(new Date().toLocaleDateString("pt-BR"), {
    x: 9.5, y: 6.92, w: 3, h: 0.45,
    fontSize: 9, color: MUTED_TEXT, fontFace: "Segoe UI", align: "right",
  });
}

function addDecoCircles(slide: PptxGenJS.Slide, pptx: PptxGenJS) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 11.0, y: -0.8, w: 3, h: 3,
    fill: { type: "solid", color: VIVID_BLUE }, transparency: 85,
  } as any);
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.2, y: 5.0, w: 2.5, h: 2.5,
    fill: { type: "solid", color: TEAL }, transparency: 88,
  } as any);
}

export function generatePptx(lessonPlan: LessonPlan): void {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "ClassBuddy";
  pptx.title = lessonPlan.subject || "Plano de Aula";

  // ═══════════════════════════════════════════
  // SLIDE 1 — COVER
  // ═══════════════════════════════════════════
  const cover = pptx.addSlide();
  cover.background = { color: DEEP_NAVY };

  // Large decorative shapes
  cover.addShape(pptx.ShapeType.ellipse, {
    x: -2, y: -2, w: 7, h: 7,
    fill: { type: "solid", color: ROYAL_BLUE }, transparency: 70,
  } as any);
  cover.addShape(pptx.ShapeType.ellipse, {
    x: 9, y: 4, w: 5, h: 5,
    fill: { type: "solid", color: TEAL }, transparency: 75,
  } as any);

  // Accent line
  cover.addShape("rect" as any, {
    x: 0.8, y: 2.6, w: 1.2, h: 0.08,
    fill: { type: "solid", color: AMBER },
  });

  // Subject title
  cover.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0.8, y: 2.85, w: 9, h: 1.4,
    fontSize: 44, bold: true, color: WHITE, fontFace: "Segoe UI",
    lineSpacingMultiple: 1.1,
  });

  // Objective
  cover.addText(lessonPlan.objective, {
    x: 0.8, y: 4.3, w: 8, h: 1.0,
    fontSize: 16, color: MUTED_TEXT, fontFace: "Segoe UI",
    lineSpacingMultiple: 1.4,
  });

  // Info chips
  const chipY = 5.7;
  cover.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: chipY, w: 2.4, h: 0.5,
    fill: { type: "solid", color: ROYAL_BLUE }, rectRadius: 0.15,
  });
  cover.addText(`⏱  ${lessonPlan.totalDuration} minutos`, {
    x: 0.8, y: chipY, w: 2.4, h: 0.5,
    fontSize: 11, bold: true, color: WHITE, fontFace: "Segoe UI",
    align: "center", valign: "middle",
  });

  cover.addShape(pptx.ShapeType.roundRect, {
    x: 3.5, y: chipY, w: 2.4, h: 0.5,
    fill: { type: "solid", color: TEAL }, rectRadius: 0.15,
  });
  cover.addText(`📚  ${lessonPlan.sections.length} seções`, {
    x: 3.5, y: chipY, w: 2.4, h: 0.5,
    fontSize: 11, bold: true, color: WHITE, fontFace: "Segoe UI",
    align: "center", valign: "middle",
  });

  addFooter(cover);

  // ═══════════════════════════════════════════
  // SLIDE 2 — OBJECTIVE
  // ═══════════════════════════════════════════
  const objSlide = pptx.addSlide();
  objSlide.background = { color: OFF_WHITE };
  addDecoCircles(objSlide, pptx);

  // Left accent bar
  objSlide.addShape("rect" as any, {
    x: 0, y: 0, w: 0.12, h: "100%" as any,
    fill: { type: "solid", color: VIVID_BLUE },
  });

  // Section label
  objSlide.addText("OBJETIVO DA AULA", {
    x: 0.8, y: 0.5, w: 6, h: 0.4,
    fontSize: 11, bold: true, color: VIVID_BLUE, fontFace: "Segoe UI",
    charSpacing: 3,
  });

  // Icon
  objSlide.addText("🎯", {
    x: 0.8, y: 1.2, w: 1, h: 1,
    fontSize: 48,
  });

  // Objective text
  objSlide.addText(lessonPlan.objective, {
    x: 2.2, y: 1.3, w: 8.5, h: 2.5,
    fontSize: 22, color: DARK_TEXT, fontFace: "Segoe UI",
    lineSpacingMultiple: 1.5,
  });

  // Divider
  objSlide.addShape("rect" as any, {
    x: 0.8, y: 4.2, w: 10.5, h: 0.02,
    fill: { type: "solid", color: LIGHT_GRAY },
  });

  // Overview grid
  const gridStartX = 0.8;
  const gridY = 4.6;
  const cardW = 3.3;
  lessonPlan.sections.slice(0, 3).forEach((section, i) => {
    const cx = gridStartX + i * (cardW + 0.3);
    objSlide.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: gridY, w: cardW, h: 1.6,
      fill: { type: "solid", color: WHITE },
      shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.08 } as any,
      rectRadius: 0.12,
    });
    objSlide.addText(`${i + 1}`, {
      x: cx + 0.15, y: gridY + 0.15, w: 0.4, h: 0.4,
      fontSize: 12, bold: true, color: WHITE, fontFace: "Segoe UI",
      align: "center", valign: "middle",
      fill: { type: "solid", color: SECTION_COLORS[i % SECTION_COLORS.length] } as any,
    });
    objSlide.addText(section.title, {
      x: cx + 0.65, y: gridY + 0.15, w: cardW - 0.85, h: 0.4,
      fontSize: 11, bold: true, color: DARK_TEXT, fontFace: "Segoe UI",
    });
    objSlide.addText(`${section.duration} min`, {
      x: cx + 0.15, y: gridY + 1.1, w: cardW - 0.3, h: 0.35,
      fontSize: 10, color: MUTED_TEXT, fontFace: "Segoe UI",
    });
  });

  addFooter(objSlide);

  // ═══════════════════════════════════════════
  // CONTENT SLIDES
  // ═══════════════════════════════════════════
  const sectionIcons = ["📖", "💡", "🔬", "🛠", "🧪", "📊", "🎨", "🌐", "⚡", "🏗"];

  lessonPlan.sections.forEach((section, index) => {
    const slide = pptx.addSlide();
    const accentColor = SECTION_COLORS[index % SECTION_COLORS.length];
    const icon = sectionIcons[index % sectionIcons.length];

    slide.background = { color: OFF_WHITE };

    // Left accent bar
    slide.addShape("rect" as any, {
      x: 0, y: 0, w: 0.12, h: "100%" as any,
      fill: { type: "solid", color: accentColor },
    });

    // Top-right decorative circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 11.2, y: -0.6, w: 2, h: 2,
      fill: { type: "solid", color: accentColor }, transparency: 90,
    } as any);

    // Section label
    slide.addText(`SEÇÃO ${index + 1} DE ${lessonPlan.sections.length}`, {
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 10, bold: true, color: accentColor, fontFace: "Segoe UI",
      charSpacing: 3,
    });

    // Section title with icon
    slide.addText(`${icon}  ${section.title}`, {
      x: 0.8, y: 0.85, w: 9, h: 0.7,
      fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Segoe UI",
    });

    // Duration badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 10.4, y: 0.85, w: 1.8, h: 0.5,
      fill: { type: "solid", color: accentColor }, rectRadius: 0.15,
    });
    slide.addText(`⏱ ${section.duration} min`, {
      x: 10.4, y: 0.85, w: 1.8, h: 0.5,
      fontSize: 11, bold: true, color: WHITE, fontFace: "Segoe UI",
      align: "center", valign: "middle",
    });

    // Divider
    slide.addShape("rect" as any, {
      x: 0.8, y: 1.7, w: 10.5, h: 0.02,
      fill: { type: "solid", color: LIGHT_GRAY },
    });

    // Content card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.95, w: 10.5, h: 2.6,
      fill: { type: "solid", color: WHITE },
      shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.06 } as any,
      rectRadius: 0.1,
    });
    slide.addText(section.content, {
      x: 1.1, y: 2.1, w: 10, h: 2.3,
      fontSize: 15, color: MEDIUM_TEXT, fontFace: "Segoe UI",
      lineSpacingMultiple: 1.6, valign: "top",
    });

    // Activities section
    if (section.activities && section.activities.length > 0) {
      const actY = 4.8;

      // Activities card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: actY, w: 10.5, h: 0.45 + section.activities.length * 0.42,
        fill: { type: "solid", color: accentColor }, transparency: 92,
        rectRadius: 0.1,
        line: { color: accentColor, width: 1, dashType: "solid" },
      } as any);

      slide.addText("✏️  Atividades Práticas", {
        x: 1.1, y: actY + 0.08, w: 6, h: 0.35,
        fontSize: 12, bold: true, color: accentColor, fontFace: "Segoe UI",
      });

      section.activities.forEach((activity, idx) => {
        const ay = actY + 0.45 + idx * 0.42;
        // Bullet dot
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 1.2, y: ay + 0.08, w: 0.12, h: 0.12,
          fill: { type: "solid", color: accentColor },
        });
        slide.addText(activity, {
          x: 1.5, y: ay, w: 9.5, h: 0.38,
          fontSize: 13, color: DARK_TEXT, fontFace: "Segoe UI", valign: "middle",
        });
      });
    }

    addFooter(slide);
  });

  // ═══════════════════════════════════════════
  // METHODOLOGY SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.methodology) {
    const methSlide = pptx.addSlide();
    methSlide.background = { color: OFF_WHITE };
    addDecoCircles(methSlide, pptx);

    methSlide.addShape("rect" as any, {
      x: 0, y: 0, w: 0.12, h: "100%" as any,
      fill: { type: "solid", color: TEAL },
    });

    methSlide.addText("METODOLOGIA", {
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 11, bold: true, color: TEAL, fontFace: "Segoe UI",
      charSpacing: 3,
    });

    methSlide.addText("🧭  Abordagem Pedagógica", {
      x: 0.8, y: 0.85, w: 9, h: 0.6,
      fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Segoe UI",
    });

    methSlide.addShape("rect" as any, {
      x: 0.8, y: 1.6, w: 10.5, h: 0.02,
      fill: { type: "solid", color: LIGHT_GRAY },
    });

    methSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 10.5, h: 4.5,
      fill: { type: "solid", color: WHITE },
      shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.06 } as any,
      rectRadius: 0.1,
    });
    methSlide.addText(lessonPlan.methodology, {
      x: 1.1, y: 2.0, w: 10, h: 4.2,
      fontSize: 16, color: MEDIUM_TEXT, fontFace: "Segoe UI",
      lineSpacingMultiple: 1.6, valign: "top",
    });

    addFooter(methSlide);
  }

  // ═══════════════════════════════════════════
  // EVALUATION SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.evaluation) {
    const evalSlide = pptx.addSlide();
    evalSlide.background = { color: OFF_WHITE };
    addDecoCircles(evalSlide, pptx);

    evalSlide.addShape("rect" as any, {
      x: 0, y: 0, w: 0.12, h: "100%" as any,
      fill: { type: "solid", color: CORAL },
    });

    evalSlide.addText("AVALIAÇÃO", {
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 11, bold: true, color: CORAL, fontFace: "Segoe UI",
      charSpacing: 3,
    });

    evalSlide.addText("📝  Critérios de Avaliação", {
      x: 0.8, y: 0.85, w: 9, h: 0.6,
      fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Segoe UI",
    });

    evalSlide.addShape("rect" as any, {
      x: 0.8, y: 1.6, w: 10.5, h: 0.02,
      fill: { type: "solid", color: LIGHT_GRAY },
    });

    evalSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 10.5, h: 4.5,
      fill: { type: "solid", color: WHITE },
      shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.06 } as any,
      rectRadius: 0.1,
    });
    evalSlide.addText(lessonPlan.evaluation, {
      x: 1.1, y: 2.0, w: 10, h: 4.2,
      fontSize: 16, color: MEDIUM_TEXT, fontFace: "Segoe UI",
      lineSpacingMultiple: 1.6, valign: "top",
    });

    addFooter(evalSlide);
  }

  // ═══════════════════════════════════════════
  // RESOURCES SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.resources && lessonPlan.resources.length > 0) {
    const resSlide = pptx.addSlide();
    resSlide.background = { color: OFF_WHITE };
    addDecoCircles(resSlide, pptx);

    resSlide.addShape("rect" as any, {
      x: 0, y: 0, w: 0.12, h: "100%" as any,
      fill: { type: "solid", color: AMBER },
    });

    resSlide.addText("RECURSOS E MATERIAIS", {
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 11, bold: true, color: AMBER, fontFace: "Segoe UI",
      charSpacing: 3,
    });

    resSlide.addText("📚  Materiais Necessários", {
      x: 0.8, y: 0.85, w: 9, h: 0.6,
      fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Segoe UI",
    });

    resSlide.addShape("rect" as any, {
      x: 0.8, y: 1.6, w: 10.5, h: 0.02,
      fill: { type: "solid", color: LIGHT_GRAY },
    });

    resSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 10.5, h: 0.6 + lessonPlan.resources.length * 0.5,
      fill: { type: "solid", color: WHITE },
      shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.06 } as any,
      rectRadius: 0.1,
    });

    lessonPlan.resources.forEach((resource, idx) => {
      const ry = 2.1 + idx * 0.5;
      resSlide.addShape(pptx.ShapeType.ellipse, {
        x: 1.2, y: ry + 0.08, w: 0.14, h: 0.14,
        fill: { type: "solid", color: AMBER },
      });
      resSlide.addText(resource, {
        x: 1.5, y: ry, w: 9.5, h: 0.45,
        fontSize: 14, color: DARK_TEXT, fontFace: "Segoe UI", valign: "middle",
      });
    });

    addFooter(resSlide);
  }

  // ═══════════════════════════════════════════
  // SUMMARY SLIDE
  // ═══════════════════════════════════════════
  const summary = pptx.addSlide();
  summary.background = { color: OFF_WHITE };
  addDecoCircles(summary, pptx);

  summary.addShape("rect" as any, {
    x: 0, y: 0, w: 0.12, h: "100%" as any,
    fill: { type: "solid", color: ROYAL_BLUE },
  });

  summary.addText("RESUMO DO PLANO", {
    x: 0.8, y: 0.4, w: 6, h: 0.35,
    fontSize: 11, bold: true, color: ROYAL_BLUE, fontFace: "Segoe UI",
    charSpacing: 3,
  });
  summary.addText("📋  Visão Geral", {
    x: 0.8, y: 0.85, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Segoe UI",
  });

  // Summary table
  const headerRow: PptxGenJS.TableRow = [
    { text: "#", options: { fontSize: 11, bold: true, color: WHITE, fill: { type: "solid" as const, color: ROYAL_BLUE }, align: "center" as const, valign: "middle" as const } },
    { text: "Seção", options: { fontSize: 11, bold: true, color: WHITE, fill: { type: "solid" as const, color: ROYAL_BLUE }, valign: "middle" as const } },
    { text: "Duração", options: { fontSize: 11, bold: true, color: WHITE, fill: { type: "solid" as const, color: ROYAL_BLUE }, align: "center" as const, valign: "middle" as const } },
  ];

  const dataRows: PptxGenJS.TableRow[] = lessonPlan.sections.map((section, i) => {
    const rowBg = i % 2 === 0 ? WHITE : "F1F5F9";
    const accent = SECTION_COLORS[i % SECTION_COLORS.length];
    return [
      { text: `${i + 1}`, options: { fontSize: 12, bold: true, color: WHITE, fill: { type: "solid" as const, color: accent }, align: "center" as const, valign: "middle" as const } },
      { text: section.title, options: { fontSize: 12, color: DARK_TEXT, fill: { type: "solid" as const, color: rowBg }, valign: "middle" as const } },
      { text: `${section.duration} min`, options: { fontSize: 12, bold: true, color: accent, fill: { type: "solid" as const, color: rowBg }, align: "center" as const, valign: "middle" as const } },
    ];
  });

  // Total row
  dataRows.push([
    { text: "", options: { fill: { type: "solid" as const, color: DEEP_NAVY } } },
    { text: "TOTAL", options: { fontSize: 13, bold: true, color: WHITE, fill: { type: "solid" as const, color: DEEP_NAVY }, valign: "middle" as const } },
    { text: `${lessonPlan.totalDuration} min`, options: { fontSize: 14, bold: true, color: AMBER, fill: { type: "solid" as const, color: DEEP_NAVY }, align: "center" as const, valign: "middle" as const } },
  ]);

  summary.addTable([headerRow, ...dataRows], {
    x: 0.8, y: 1.7, w: 10.5,
    colW: [0.7, 7.8, 2.0],
    fontFace: "Segoe UI",
    rowH: 0.55,
    border: { type: "solid", color: LIGHT_GRAY, pt: 0.5 } as any,
  });

  addFooter(summary);

  // ═══════════════════════════════════════════
  // CLOSING SLIDE
  // ═══════════════════════════════════════════
  const closing = pptx.addSlide();
  closing.background = { color: DEEP_NAVY };
  closing.addShape(pptx.ShapeType.ellipse, {
    x: 4, y: 0.5, w: 5, h: 5,
    fill: { type: "solid", color: ROYAL_BLUE }, transparency: 75,
  } as any);

  closing.addText("Obrigado!", {
    x: 0, y: 2.2, w: "100%" as any, h: 1.2,
    fontSize: 48, bold: true, color: WHITE, fontFace: "Segoe UI",
    align: "center",
  });
  closing.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0, y: 3.5, w: "100%" as any, h: 0.6,
    fontSize: 18, color: SOFT_BLUE, fontFace: "Segoe UI",
    align: "center",
  });
  closing.addText("Gerado com ClassBuddy ✨", {
    x: 0, y: 4.5, w: "100%" as any, h: 0.5,
    fontSize: 12, color: MUTED_TEXT, fontFace: "Segoe UI",
    align: "center", italic: true,
  });

  // Download
  const fileName = `plano_${(lessonPlan.subject || "aula").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`;
  pptx.writeFile({ fileName });
}
