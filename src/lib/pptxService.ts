/* eslint-disable @typescript-eslint/no-explicit-any -- pptxgenjs API uses loose types */
import PptxGenJS from "pptxgenjs";
import { LessonPlan } from "@/components/LessonPlanner/types";

// ─── Formal Academic Palette ────────────────────────────────────────────────
const NAVY = "0D1B2A";
const DARK_NAVY = "1B2838";
const SLATE = "1B3A5C";
const GOLD = "C9A84C";
const DARK_GOLD = "A68A3E";
const CREAM = "FAF8F0";
const WARM_WHITE = "FFFEF9";
const WHITE = "FFFFFF";
const DARK_TEXT = "1A1A2E";
const BODY_TEXT = "3D4F5F";
const MUTED = "7F8C9B";
const BORDER_LIGHT = "D4CFC0";
const SECTION_ACCENTS = [
  "1B3A5C", "2D6A4F", "6C3D1F", "4A3B6B", "8B3A3A",
  "1F5F7A", "3B6B3D", "7A5C1F", "5A3B7A", "1A6B5C",
];

// ─── Decorative Pattern Generator (replaces Unsplash) ─────────────────────
function generateDecorativeImage(keyword: string, w: number, h: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Seed from keyword for consistent but varied patterns
  let seed = 0;
  for (let i = 0; i < keyword.length; i++) seed += keyword.charCodeAt(i);
  const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };

  // Base gradient
  const colors: Record<string, [string, string]> = {
    mathematics: ["#1B3A5C", "#0D1B2A"],
    geometry: ["#2D4A6C", "#0D1B2A"],
    physics: ["#1F3D5B", "#0A1628"],
    chemistry: ["#1B4A3C", "#0D2A1E"],
    biology: ["#2D5A3F", "#0D2A18"],
    history: ["#4A3520", "#2A1A0D"],
    geography: ["#2A4A3C", "#0D2A1E"],
    books: ["#3A2A1C", "#1A0D05"],
    literature: ["#3A2A1C", "#1A0D05"],
    art: ["#4A2A4A", "#1A0D1A"],
    philosophy: ["#3A3A5A", "#1A1A2E"],
    science: ["#1B4A5C", "#0D2A3A"],
    technology: ["#1A3A5A", "#0D1B2A"],
    education: ["#1B3A5C", "#0D1B2A"],
    default: ["#1B3A5C", "#0D1B2A"],
  };

  const [c1, c2] = colors[keyword] || colors.default;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative geometric elements
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 12; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 20 + rand() * 80;
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Grid lines
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += 40 + rand() * 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 40 + rand() * 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Corner ornament
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 1.5;
  const cornerSize = Math.min(w, h) * 0.15;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(0, cornerSize);
  ctx.lineTo(0, 0);
  ctx.lineTo(cornerSize, 0);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(w, h - cornerSize);
  ctx.lineTo(w, h);
  ctx.lineTo(w - cornerSize, h);
  ctx.stroke();

  ctx.globalAlpha = 1.0;
  return canvas.toDataURL("image/png");
}

// ─── Subject → Image Keyword Map ────────────────────────────────────────────
const SUBJECT_IMAGE_KEYWORDS: Record<string, string> = {
  matematica: "mathematics", matemática: "mathematics",
  fisica: "physics", física: "physics",
  quimica: "chemistry", química: "chemistry",
  biologia: "biology",
  historia: "history", história: "history",
  geografia: "geography",
  portugues: "books", português: "books",
  literatura: "literature",
  ingles: "books", inglês: "books",
  arte: "art",
  filosofia: "philosophy",
  sociologia: "philosophy",
  educação: "education",
  ciencias: "science", ciências: "science",
  tecnologia: "technology",
  programação: "technology",
  medicina: "science",
  direito: "books",
  economia: "technology",
  psicologia: "philosophy",
  musica: "art", música: "art",
};

function getImageKeyword(subject: string): string {
  const lower = subject.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, kw] of Object.entries(SUBJECT_IMAGE_KEYWORDS)) {
    const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(normalizedKey)) return kw;
  }
  return "education";
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function addAcademicFooter(slide: PptxGenJS.Slide) {
  slide.addShape("rect" as any, {
    x: 0.6, y: 6.85, w: 12.0, h: 0.012,
    fill: { type: "solid", color: GOLD },
  });
  slide.addText("ClassBuddy", {
    x: 0.6, y: 6.92, w: 3, h: 0.35,
    fontSize: 8, bold: true, color: GOLD, fontFace: "Georgia", italic: true,
  });
  slide.addText(new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }), {
    x: 9.6, y: 6.92, w: 3, h: 0.35,
    fontSize: 7, color: MUTED, fontFace: "Georgia", align: "right",
  });
}

function addSideAccent(slide: PptxGenJS.Slide, color: string) {
  slide.addShape("rect" as any, {
    x: 0, y: 0, w: 0.05, h: "100%" as any,
    fill: { type: "solid", color },
  });
  slide.addShape("rect" as any, {
    x: 0.05, y: 0, w: 0.02, h: 1.0,
    fill: { type: "solid", color: GOLD },
  });
}

function addDecorativeImage(slide: PptxGenJS.Slide, keyword: string, x: number, y: number, w: number, h: number, pptx: PptxGenJS) {
  const imgData = generateDecorativeImage(keyword, Math.round(w * 120), Math.round(h * 120));
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { type: "solid", color: BORDER_LIGHT },
    rectRadius: 0.06,
  });
  slide.addImage({
    data: imgData,
    x: x + 0.03, y: y + 0.03, w: w - 0.06, h: h - 0.06,
    rounding: true,
  } as any);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function generatePptx(lessonPlan: LessonPlan): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "ClassBuddy";
  pptx.title = lessonPlan.subject || "Plano de Aula";

  const keyword = getImageKeyword(lessonPlan.subject || "educação");

  // ═══════════════════════════════════════════
  // SLIDE 1 — COVER
  // ═══════════════════════════════════════════
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };

  // Left gold accent bar
  cover.addShape("rect" as any, {
    x: 0, y: 0, w: 0.05, h: "100%" as any,
    fill: { type: "solid", color: GOLD },
  });

  // Decorative image on the right
  addDecorativeImage(cover, keyword, 8.4, 0.6, 4.0, 3.0, pptx);

  // Gold accent line above title
  cover.addShape("rect" as any, {
    x: 0.7, y: 2.2, w: 1.8, h: 0.035,
    fill: { type: "solid", color: GOLD },
  });

  // Subject title
  cover.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0.7, y: 2.5, w: 7.2, h: 1.4,
    fontSize: 38, bold: true, color: WHITE, fontFace: "Georgia",
    lineSpacingMultiple: 1.15,
  });

  // Objective subtitle
  cover.addText(lessonPlan.objective, {
    x: 0.7, y: 4.1, w: 7.2, h: 1.2,
    fontSize: 13, color: MUTED, fontFace: "Georgia",
    lineSpacingMultiple: 1.5, italic: true,
  });

  // Bottom pill — section count
  cover.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 5.6, w: 2.4, h: 0.38,
    fill: { type: "solid", color: GOLD }, rectRadius: 0.04,
  });
  cover.addText(`${lessonPlan.sections.length} seções`, {
    x: 0.7, y: 5.6, w: 2.4, h: 0.38,
    fontSize: 10, bold: true, color: NAVY, fontFace: "Georgia",
    align: "center", valign: "middle",
  });

  // Bottom divider
  cover.addShape("rect" as any, {
    x: 0.7, y: 6.2, w: 11.8, h: 0.008,
    fill: { type: "solid", color: GOLD }, transparency: 50,
  } as any);

  addAcademicFooter(cover);

  // ═══════════════════════════════════════════
  // SLIDE 2 — OBJECTIVE
  // ═══════════════════════════════════════════
  const objSlide = pptx.addSlide();
  objSlide.background = { color: CREAM };
  addSideAccent(objSlide, NAVY);

  objSlide.addText("OBJETIVO DA AULA", {
    x: 0.7, y: 0.45, w: 6, h: 0.3,
    fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
  });

  objSlide.addShape("rect" as any, {
    x: 0.7, y: 0.85, w: 2.2, h: 0.02,
    fill: { type: "solid", color: GOLD },
  });

  objSlide.addText(lessonPlan.objective, {
    x: 0.7, y: 1.2, w: 7.2, h: 2.4,
    fontSize: 19, color: DARK_TEXT, fontFace: "Georgia",
    lineSpacingMultiple: 1.6, italic: true,
  });

  // Image on right
  addDecorativeImage(objSlide, keyword, 8.6, 1.0, 3.4, 2.6, pptx);

  // Divider before overview
  objSlide.addShape("rect" as any, {
    x: 0.7, y: 4.0, w: 11.8, h: 0.012,
    fill: { type: "solid", color: BORDER_LIGHT },
  });

  // Overview cards (up to 3)
  const cardW = 3.7;
  const cardGap = 0.25;
  const cardsToShow = Math.min(lessonPlan.sections.length, 3);
  lessonPlan.sections.slice(0, cardsToShow).forEach((section, i) => {
    const cx = 0.7 + i * (cardW + cardGap);

    objSlide.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: 4.3, w: cardW, h: 1.8,
      fill: { type: "solid", color: WARM_WHITE },
      shadow: { type: "outer", blur: 3, offset: 1, color: "000000", opacity: 0.05 } as any,
      rectRadius: 0.06,
      line: { color: BORDER_LIGHT, width: 0.5 },
    } as any);

    // Number circle
    const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];
    objSlide.addShape(pptx.ShapeType.ellipse, {
      x: cx + 0.15, y: 4.45, w: 0.32, h: 0.32,
      fill: { type: "solid", color: accent },
    });
    objSlide.addText(`${i + 1}`, {
      x: cx + 0.15, y: 4.45, w: 0.32, h: 0.32,
      fontSize: 10, bold: true, color: WHITE, fontFace: "Georgia",
      align: "center", valign: "middle",
    });

    objSlide.addText(section.title, {
      x: cx + 0.55, y: 4.42, w: cardW - 0.75, h: 0.45,
      fontSize: 10, bold: true, color: DARK_TEXT, fontFace: "Georgia",
      valign: "middle",
    });

    // Brief content preview
    const preview = section.content.substring(0, 80) + (section.content.length > 80 ? "…" : "");
    objSlide.addText(preview, {
      x: cx + 0.15, y: 4.95, w: cardW - 0.3, h: 1.0,
      fontSize: 8, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.4, valign: "top",
    });
  });

  addAcademicFooter(objSlide);

  // ═══════════════════════════════════════════
  // CONTENT SLIDES
  // ═══════════════════════════════════════════
  lessonPlan.sections.forEach((section, index) => {
    const slide = pptx.addSlide();
    const accent = SECTION_ACCENTS[index % SECTION_ACCENTS.length];

    slide.background = { color: CREAM };
    addSideAccent(slide, accent);

    // Section label
    slide.addText(`SEÇÃO ${index + 1}`, {
      x: 0.7, y: 0.35, w: 6, h: 0.25,
      fontSize: 8, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
    });

    // Section title
    slide.addText(section.title, {
      x: 0.7, y: 0.7, w: 11.8, h: 0.65,
      fontSize: 24, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });

    // Gold divider
    slide.addShape("rect" as any, {
      x: 0.7, y: 1.4, w: 2.5, h: 0.02,
      fill: { type: "solid", color: GOLD },
    });

    // Content with decorative image
    slide.addText(section.content, {
      x: 0.7, y: 1.7, w: 7.4, h: 2.8,
      fontSize: 13, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.6, valign: "top",
    });

    addDecorativeImage(slide, keyword, 8.5, 1.7, 3.8, 2.4, pptx);

    // Activities
    if (section.activities && section.activities.length > 0) {
      const actY = 4.75;
      const actH = Math.min(0.4 + section.activities.length * 0.38, 1.8);

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.7, y: actY, w: 11.8, h: actH,
        fill: { type: "solid", color: WARM_WHITE },
        rectRadius: 0.06,
        line: { color: GOLD, width: 0.6 },
      } as any);

      slide.addText("Atividades", {
        x: 0.95, y: actY + 0.05, w: 6, h: 0.3,
        fontSize: 10, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 2,
      });

      section.activities.slice(0, 3).forEach((activity, idx) => {
        const ay = actY + 0.38 + idx * 0.38;
        slide.addText(`—  ${activity}`, {
          x: 1.0, y: ay, w: 11.2, h: 0.32,
          fontSize: 11, color: DARK_TEXT, fontFace: "Georgia", valign: "middle",
        });
      });
    }

    addAcademicFooter(slide);
  });

  // ═══════════════════════════════════════════
  // METHODOLOGY SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.methodology) {
    const methSlide = pptx.addSlide();
    methSlide.background = { color: CREAM };
    addSideAccent(methSlide, SLATE);

    methSlide.addText("METODOLOGIA", {
      x: 0.7, y: 0.35, w: 6, h: 0.3,
      fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
    });
    methSlide.addText("Abordagem Pedagógica", {
      x: 0.7, y: 0.75, w: 9, h: 0.55,
      fontSize: 24, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
    methSlide.addShape("rect" as any, {
      x: 0.7, y: 1.35, w: 2.5, h: 0.02,
      fill: { type: "solid", color: GOLD },
    });

    methSlide.addText(lessonPlan.methodology, {
      x: 0.7, y: 1.65, w: 7.4, h: 4.8,
      fontSize: 14, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.6, valign: "top",
    });

    addDecorativeImage(methSlide, keyword, 8.5, 1.65, 3.8, 2.8, pptx);
    addAcademicFooter(methSlide);
  }

  // ═══════════════════════════════════════════
  // EVALUATION SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.evaluation) {
    const evalSlide = pptx.addSlide();
    evalSlide.background = { color: CREAM };
    addSideAccent(evalSlide, "8B3A3A");

    evalSlide.addText("AVALIAÇÃO", {
      x: 0.7, y: 0.35, w: 6, h: 0.3,
      fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
    });
    evalSlide.addText("Critérios de Avaliação", {
      x: 0.7, y: 0.75, w: 9, h: 0.55,
      fontSize: 24, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
    evalSlide.addShape("rect" as any, {
      x: 0.7, y: 1.35, w: 2.5, h: 0.02,
      fill: { type: "solid", color: GOLD },
    });

    evalSlide.addText(lessonPlan.evaluation, {
      x: 0.7, y: 1.65, w: 7.4, h: 4.8,
      fontSize: 14, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.6, valign: "top",
    });

    addDecorativeImage(evalSlide, keyword, 8.5, 1.65, 3.8, 2.8, pptx);
    addAcademicFooter(evalSlide);
  }

  // ═══════════════════════════════════════════
  // RESOURCES SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.resources && lessonPlan.resources.length > 0) {
    const resSlide = pptx.addSlide();
    resSlide.background = { color: CREAM };
    addSideAccent(resSlide, DARK_GOLD);

    resSlide.addText("RECURSOS E MATERIAIS", {
      x: 0.7, y: 0.35, w: 6, h: 0.3,
      fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
    });
    resSlide.addText("Materiais Necessários", {
      x: 0.7, y: 0.75, w: 9, h: 0.55,
      fontSize: 24, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
    resSlide.addShape("rect" as any, {
      x: 0.7, y: 1.35, w: 2.5, h: 0.02,
      fill: { type: "solid", color: GOLD },
    });

    addDecorativeImage(resSlide, keyword, 8.5, 1.65, 3.8, 2.2, pptx);

    lessonPlan.resources.slice(0, 8).forEach((resource, idx) => {
      const ry = 1.75 + idx * 0.48;
      resSlide.addText(`—  ${resource}`, {
        x: 0.9, y: ry, w: 7.2, h: 0.4,
        fontSize: 13, color: DARK_TEXT, fontFace: "Georgia", valign: "middle",
      });
    });
    addAcademicFooter(resSlide);
  }

  // ═══════════════════════════════════════════
  // SUMMARY SLIDE
  // ═══════════════════════════════════════════
  const summary = pptx.addSlide();
  summary.background = { color: CREAM };
  addSideAccent(summary, NAVY);

  summary.addText("RESUMO", {
    x: 0.7, y: 0.35, w: 6, h: 0.3,
    fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
  });
  summary.addText("Visão Geral do Plano", {
    x: 0.7, y: 0.75, w: 9, h: 0.55,
    fontSize: 24, bold: true, color: DARK_TEXT, fontFace: "Georgia",
  });
  summary.addShape("rect" as any, {
    x: 0.7, y: 1.35, w: 2.5, h: 0.02,
    fill: { type: "solid", color: GOLD },
  });

  // Summary table
  const headerRow: PptxGenJS.TableRow = [
    { text: "#", options: { fontSize: 10, bold: true, color: WHITE, fill: { type: "solid" as const, color: NAVY }, align: "center" as const, valign: "middle" as const, fontFace: "Georgia" } },
    { text: "Seção", options: { fontSize: 10, bold: true, color: WHITE, fill: { type: "solid" as const, color: NAVY }, valign: "middle" as const, fontFace: "Georgia" } },
  ];

  const dataRows: PptxGenJS.TableRow[] = lessonPlan.sections.map((section, i) => {
    const rowBg = i % 2 === 0 ? WARM_WHITE : CREAM;
    return [
      { text: `${i + 1}`, options: { fontSize: 10, bold: true, color: GOLD, fill: { type: "solid" as const, color: rowBg }, align: "center" as const, valign: "middle" as const, fontFace: "Georgia" } },
      { text: section.title, options: { fontSize: 11, color: DARK_TEXT, fill: { type: "solid" as const, color: rowBg }, valign: "middle" as const, fontFace: "Georgia" } },
    ];
  });

  summary.addTable([headerRow, ...dataRows], {
    x: 0.7, y: 1.65, w: 11.8,
    colW: [0.6, 11.2],
    fontFace: "Georgia",
    rowH: 0.5,
    border: { type: "solid", color: BORDER_LIGHT, pt: 0.5 } as any,
  });

  addAcademicFooter(summary);

  // ═══════════════════════════════════════════
  // CLOSING SLIDE
  // ═══════════════════════════════════════════
  const closing = pptx.addSlide();
  closing.background = { color: NAVY };

  closing.addShape("rect" as any, {
    x: 0, y: 0, w: 0.05, h: "100%" as any,
    fill: { type: "solid", color: GOLD },
  });

  closing.addShape("rect" as any, {
    x: 4.8, y: 2.7, w: 3.6, h: 0.025,
    fill: { type: "solid", color: GOLD },
  });

  closing.addText("Obrigado", {
    x: 0, y: 1.9, w: "100%" as any, h: 0.85,
    fontSize: 42, bold: true, color: WHITE, fontFace: "Georgia", align: "center",
  });

  closing.addShape("rect" as any, {
    x: 4.8, y: 3.0, w: 3.6, h: 0.025,
    fill: { type: "solid", color: GOLD },
  });

  closing.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0, y: 3.4, w: "100%" as any, h: 0.45,
    fontSize: 15, color: MUTED, fontFace: "Georgia", align: "center", italic: true,
  });

  closing.addText("Gerado com ClassBuddy", {
    x: 0, y: 4.3, w: "100%" as any, h: 0.35,
    fontSize: 9, color: GOLD, fontFace: "Georgia", align: "center", italic: true,
  });

  // Download
  const fileName = `plano_${(lessonPlan.subject || "aula").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`;
  await pptx.writeFile({ fileName });
}
