/* eslint-disable @typescript-eslint/no-explicit-any -- pptxgenjs API uses loose types */
import PptxGenJS from "pptxgenjs";
import { LessonPlan } from "@/components/LessonPlanner/types";

// ─── Formal Academic Palette ────────────────────────────────────────────────
const NAVY = "0D1B2A";
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

// ─── Layout constants (LAYOUT_WIDE = 13.33 x 7.5 inches) ───────────────────
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;
const MARGIN_L = 0.7;
const MARGIN_R = 0.5;
const FOOTER_Y = 6.85;
const CONTENT_W = SLIDE_W - MARGIN_L - MARGIN_R;
const TEXT_ZONE_W = 7.4;
const IMG_X = 8.5;
const IMG_W = SLIDE_W - IMG_X - MARGIN_R;

// ─── Decorative Pattern Generator ─────────────────────────────────────────
function generateDecorativeImage(keyword: string, w: number, h: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  let seed = 0;
  for (let i = 0; i < keyword.length; i++) seed += keyword.charCodeAt(i);
  const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };

  const colors: Record<string, [string, string]> = {
    mathematics: ["#1B3A5C", "#0D1B2A"], geometry: ["#2D4A6C", "#0D1B2A"],
    physics: ["#1F3D5B", "#0A1628"], chemistry: ["#1B4A3C", "#0D2A1E"],
    biology: ["#2D5A3F", "#0D2A18"], history: ["#4A3520", "#2A1A0D"],
    geography: ["#2A4A3C", "#0D2A1E"], books: ["#3A2A1C", "#1A0D05"],
    literature: ["#3A2A1C", "#1A0D05"], art: ["#4A2A4A", "#1A0D1A"],
    philosophy: ["#3A3A5A", "#1A1A2E"], science: ["#1B4A5C", "#0D2A3A"],
    technology: ["#1A3A5A", "#0D1B2A"], education: ["#1B3A5C", "#0D1B2A"],
    default: ["#1B3A5C", "#0D1B2A"],
  };

  const [c1, c2] = colors[keyword] || colors.default;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 12; i++) {
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(rand() * w, rand() * h, 20 + rand() * 80, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += 40 + rand() * 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40 + rand() * 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 1.5;
  const cs = Math.min(w, h) * 0.15;
  ctx.beginPath(); ctx.moveTo(0, cs); ctx.lineTo(0, 0); ctx.lineTo(cs, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w, h - cs); ctx.lineTo(w, h); ctx.lineTo(w - cs, h); ctx.stroke();

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
  arte: "art", filosofia: "philosophy", sociologia: "philosophy",
  educação: "education", ciencias: "science", ciências: "science",
  tecnologia: "technology", programação: "technology",
  medicina: "science", direito: "books", economia: "technology",
  psicologia: "philosophy", musica: "art", música: "art",
};

function getImageKeyword(subject: string): string {
  const lower = subject.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, kw] of Object.entries(SUBJECT_IMAGE_KEYWORDS)) {
    if (lower.includes(key.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) return kw;
  }
  return "education";
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Truncate text to approximate char limit to avoid overflow */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max - 1) + "…";
}

function addAcademicFooter(slide: PptxGenJS.Slide) {
  slide.addShape("rect" as any, {
    x: MARGIN_L, y: FOOTER_Y, w: CONTENT_W, h: 0.012,
    fill: { type: "solid", color: GOLD },
  });
  slide.addText("ClassBuddy", {
    x: MARGIN_L, y: FOOTER_Y + 0.07, w: 3, h: 0.3,
    fontSize: 8, bold: true, color: GOLD, fontFace: "Georgia", italic: true,
  });
  slide.addText(new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }), {
    x: SLIDE_W - 3 - MARGIN_R, y: FOOTER_Y + 0.07, w: 3, h: 0.3,
    fontSize: 7, color: MUTED, fontFace: "Georgia", align: "right",
  });
}

function addSideAccent(slide: PptxGenJS.Slide, color: string) {
  slide.addShape("rect" as any, {
    x: 0, y: 0, w: 0.05, h: SLIDE_H,
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

/** Standard header block: label + title + gold divider. Returns Y after divider. */
function addSlideHeader(slide: PptxGenJS.Slide, label: string, title: string, accent: string): number {
  addSideAccent(slide, accent);
  slide.addText(label, {
    x: MARGIN_L, y: 0.35, w: 6, h: 0.25,
    fontSize: 8, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
  });
  slide.addText(title, {
    x: MARGIN_L, y: 0.7, w: CONTENT_W, h: 0.6,
    fontSize: 22, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    shrinkText: true,
  });
  slide.addShape("rect" as any, {
    x: MARGIN_L, y: 1.35, w: 2.5, h: 0.02,
    fill: { type: "solid", color: GOLD },
  });
  return 1.55;
}

/** Add a full-width text block with auto-shrink. Returns bottom Y. */
function addBodyText(slide: PptxGenJS.Slide, text: string, y: number, maxH: number, opts?: { w?: number; fontSize?: number }): number {
  const w = opts?.w ?? TEXT_ZONE_W;
  const fs = opts?.fontSize ?? 12;
  const safeText = truncate(text, 1200);
  slide.addText(safeText, {
    x: MARGIN_L, y, w, h: maxH,
    fontSize: fs, color: BODY_TEXT, fontFace: "Georgia",
    lineSpacingMultiple: 1.5, valign: "top",
    shrinkText: true,
  });
  return y + maxH;
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

  cover.addShape("rect" as any, {
    x: 0, y: 0, w: 0.05, h: SLIDE_H,
    fill: { type: "solid", color: GOLD },
  });

  addDecorativeImage(cover, keyword, 8.4, 0.6, 4.4, 3.2, pptx);

  cover.addShape("rect" as any, {
    x: MARGIN_L, y: 2.2, w: 1.8, h: 0.035,
    fill: { type: "solid", color: GOLD },
  });

  cover.addText(lessonPlan.subject || "Plano de Aula", {
    x: MARGIN_L, y: 2.45, w: 7.4, h: 1.4,
    fontSize: 36, bold: true, color: WHITE, fontFace: "Georgia",
    lineSpacingMultiple: 1.15, shrinkText: true,
  });

  cover.addText(truncate(lessonPlan.objective, 200), {
    x: MARGIN_L, y: 4.0, w: 7.4, h: 1.0,
    fontSize: 13, color: MUTED, fontFace: "Georgia",
    lineSpacingMultiple: 1.4, italic: true, shrinkText: true,
  });

  cover.addShape(pptx.ShapeType.roundRect, {
    x: MARGIN_L, y: 5.3, w: 2.4, h: 0.36,
    fill: { type: "solid", color: GOLD }, rectRadius: 0.04,
  });
  cover.addText(`${lessonPlan.sections.length} seções`, {
    x: MARGIN_L, y: 5.3, w: 2.4, h: 0.36,
    fontSize: 10, bold: true, color: NAVY, fontFace: "Georgia",
    align: "center", valign: "middle",
  });

  cover.addShape("rect" as any, {
    x: MARGIN_L, y: 6.0, w: CONTENT_W, h: 0.008,
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
    x: MARGIN_L, y: 0.45, w: 6, h: 0.3,
    fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 4,
  });
  objSlide.addShape("rect" as any, {
    x: MARGIN_L, y: 0.85, w: 2.2, h: 0.02,
    fill: { type: "solid", color: GOLD },
  });
  objSlide.addText(truncate(lessonPlan.objective, 300), {
    x: MARGIN_L, y: 1.1, w: 7.4, h: 2.2,
    fontSize: 17, color: DARK_TEXT, fontFace: "Georgia",
    lineSpacingMultiple: 1.5, italic: true, shrinkText: true,
  });

  addDecorativeImage(objSlide, keyword, IMG_X, 0.9, IMG_W, 2.5, pptx);

  // Divider
  objSlide.addShape("rect" as any, {
    x: MARGIN_L, y: 3.6, w: CONTENT_W, h: 0.01,
    fill: { type: "solid", color: BORDER_LIGHT },
  });

  // Overview cards (up to 3)
  const cardsToShow = Math.min(lessonPlan.sections.length, 3);
  const cardGap = 0.2;
  const totalCardW = CONTENT_W;
  const cardW = (totalCardW - (cardsToShow - 1) * cardGap) / cardsToShow;
  const cardY = 3.85;
  const cardH = FOOTER_Y - cardY - 0.25;

  lessonPlan.sections.slice(0, cardsToShow).forEach((section, i) => {
    const cx = MARGIN_L + i * (cardW + cardGap);

    objSlide.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: cardY, w: cardW, h: cardH,
      fill: { type: "solid", color: WARM_WHITE },
      shadow: { type: "outer", blur: 3, offset: 1, color: "000000", opacity: 0.05 } as any,
      rectRadius: 0.06,
      line: { color: BORDER_LIGHT, width: 0.5 },
    } as any);

    const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];
    objSlide.addShape(pptx.ShapeType.ellipse, {
      x: cx + 0.15, y: cardY + 0.15, w: 0.3, h: 0.3,
      fill: { type: "solid", color: accent },
    });
    objSlide.addText(`${i + 1}`, {
      x: cx + 0.15, y: cardY + 0.15, w: 0.3, h: 0.3,
      fontSize: 10, bold: true, color: WHITE, fontFace: "Georgia",
      align: "center", valign: "middle",
    });

    objSlide.addText(truncate(section.title, 60), {
      x: cx + 0.55, y: cardY + 0.12, w: cardW - 0.75, h: 0.4,
      fontSize: 9, bold: true, color: DARK_TEXT, fontFace: "Georgia",
      valign: "middle", shrinkText: true,
    });

    objSlide.addText(truncate(section.content, 120), {
      x: cx + 0.15, y: cardY + 0.6, w: cardW - 0.3, h: cardH - 0.8,
      fontSize: 8, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.3, valign: "top", shrinkText: true,
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

    const headerEnd = addSlideHeader(slide, `SEÇÃO ${index + 1}`, section.title, accent);

    const hasActivities = section.activities && section.activities.length > 0;
    const activitiesToShow = hasActivities ? Math.min(section.activities!.length, 4) : 0;
    const actBoxH = hasActivities ? 0.35 + activitiesToShow * 0.32 : 0;
    const actGap = hasActivities ? 0.15 : 0;

    // Available height for content = footer - headerEnd - actBox - gaps
    const contentMaxH = FOOTER_Y - headerEnd - actBoxH - actGap - 0.2;
    const imgH = Math.min(contentMaxH, 2.6);

    addBodyText(slide, section.content, headerEnd, contentMaxH, { w: TEXT_ZONE_W });
    addDecorativeImage(slide, keyword, IMG_X, headerEnd, IMG_W, imgH, pptx);

    // Activities box
    if (hasActivities) {
      const actY = FOOTER_Y - actBoxH - 0.1;

      slide.addShape(pptx.ShapeType.roundRect, {
        x: MARGIN_L, y: actY, w: CONTENT_W, h: actBoxH,
        fill: { type: "solid", color: WARM_WHITE },
        rectRadius: 0.06,
        line: { color: GOLD, width: 0.6 },
      } as any);

      slide.addText("Atividades", {
        x: MARGIN_L + 0.2, y: actY + 0.03, w: 4, h: 0.28,
        fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia", charSpacing: 2,
      });

      section.activities!.slice(0, activitiesToShow).forEach((activity, idx) => {
        slide.addText(`—  ${truncate(activity, 120)}`, {
          x: MARGIN_L + 0.25, y: actY + 0.32 + idx * 0.32, w: CONTENT_W - 0.5, h: 0.28,
          fontSize: 10, color: DARK_TEXT, fontFace: "Georgia", valign: "middle",
          shrinkText: true,
        });
      });
    }

    addAcademicFooter(slide);
  });

  // ═══════════════════════════════════════════
  // METHODOLOGY SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.methodology) {
    const s = pptx.addSlide();
    s.background = { color: CREAM };
    const y = addSlideHeader(s, "METODOLOGIA", "Abordagem Pedagógica", SLATE);
    const maxH = FOOTER_Y - y - 0.2;
    addBodyText(s, lessonPlan.methodology, y, maxH);
    addDecorativeImage(s, keyword, IMG_X, y, IMG_W, Math.min(maxH, 2.8), pptx);
    addAcademicFooter(s);
  }

  // ═══════════════════════════════════════════
  // EVALUATION SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.evaluation) {
    const s = pptx.addSlide();
    s.background = { color: CREAM };
    const y = addSlideHeader(s, "AVALIAÇÃO", "Critérios de Avaliação", "8B3A3A");
    const maxH = FOOTER_Y - y - 0.2;
    addBodyText(s, lessonPlan.evaluation, y, maxH);
    addDecorativeImage(s, keyword, IMG_X, y, IMG_W, Math.min(maxH, 2.8), pptx);
    addAcademicFooter(s);
  }

  // ═══════════════════════════════════════════
  // RESOURCES SLIDE
  // ═══════════════════════════════════════════
  if (lessonPlan.resources && lessonPlan.resources.length > 0) {
    const s = pptx.addSlide();
    s.background = { color: CREAM };
    const y = addSlideHeader(s, "RECURSOS E MATERIAIS", "Materiais Necessários", DARK_GOLD);

    const maxItems = Math.min(lessonPlan.resources.length, 10);
    const availH = FOOTER_Y - y - 0.2;
    const rowH = Math.min(0.45, availH / maxItems);

    addDecorativeImage(s, keyword, IMG_X, y, IMG_W, Math.min(availH, 2.4), pptx);

    lessonPlan.resources.slice(0, maxItems).forEach((resource, idx) => {
      s.addText(`—  ${truncate(resource, 100)}`, {
        x: MARGIN_L + 0.15, y: y + idx * rowH, w: TEXT_ZONE_W, h: rowH,
        fontSize: 11, color: DARK_TEXT, fontFace: "Georgia", valign: "middle",
        shrinkText: true,
      });
    });
    addAcademicFooter(s);
  }

  // ═══════════════════════════════════════════
  // SUMMARY SLIDE
  // ═══════════════════════════════════════════
  const summary = pptx.addSlide();
  summary.background = { color: CREAM };
  const sumY = addSlideHeader(summary, "RESUMO", "Visão Geral do Plano", NAVY);

  const headerRow: PptxGenJS.TableRow = [
    { text: "#", options: { fontSize: 10, bold: true, color: WHITE, fill: { type: "solid" as const, color: NAVY }, align: "center" as const, valign: "middle" as const, fontFace: "Georgia" } },
    { text: "Seção", options: { fontSize: 10, bold: true, color: WHITE, fill: { type: "solid" as const, color: NAVY }, valign: "middle" as const, fontFace: "Georgia" } },
  ];

  const dataRows: PptxGenJS.TableRow[] = lessonPlan.sections.map((section, i) => {
    const bg = i % 2 === 0 ? WARM_WHITE : CREAM;
    return [
      { text: `${i + 1}`, options: { fontSize: 10, bold: true, color: GOLD, fill: { type: "solid" as const, color: bg }, align: "center" as const, valign: "middle" as const, fontFace: "Georgia" } },
      { text: truncate(section.title, 80), options: { fontSize: 11, color: DARK_TEXT, fill: { type: "solid" as const, color: bg }, valign: "middle" as const, fontFace: "Georgia" } },
    ];
  });

  const tableMaxH = FOOTER_Y - sumY - 0.2;
  const tableRowH = Math.min(0.5, tableMaxH / (dataRows.length + 1));

  summary.addTable([headerRow, ...dataRows], {
    x: MARGIN_L, y: sumY, w: CONTENT_W,
    colW: [0.6, CONTENT_W - 0.6],
    fontFace: "Georgia",
    rowH: tableRowH,
    border: { type: "solid", color: BORDER_LIGHT, pt: 0.5 } as any,
  });

  addAcademicFooter(summary);

  // ═══════════════════════════════════════════
  // CLOSING SLIDE
  // ═══════════════════════════════════════════
  const closing = pptx.addSlide();
  closing.background = { color: NAVY };

  closing.addShape("rect" as any, {
    x: 0, y: 0, w: 0.05, h: SLIDE_H,
    fill: { type: "solid", color: GOLD },
  });

  closing.addShape("rect" as any, {
    x: 4.8, y: 2.7, w: 3.6, h: 0.025,
    fill: { type: "solid", color: GOLD },
  });
  closing.addText("Obrigado", {
    x: 0, y: 1.9, w: SLIDE_W, h: 0.85,
    fontSize: 42, bold: true, color: WHITE, fontFace: "Georgia", align: "center",
  });
  closing.addShape("rect" as any, {
    x: 4.8, y: 3.0, w: 3.6, h: 0.025,
    fill: { type: "solid", color: GOLD },
  });
  closing.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0, y: 3.4, w: SLIDE_W, h: 0.45,
    fontSize: 15, color: MUTED, fontFace: "Georgia", align: "center", italic: true,
  });
  closing.addText("Gerado com ClassBuddy", {
    x: 0, y: 4.3, w: SLIDE_W, h: 0.35,
    fontSize: 9, color: GOLD, fontFace: "Georgia", align: "center", italic: true,
  });

  const fileName = `plano_${(lessonPlan.subject || "aula").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`;
  await pptx.writeFile({ fileName });
}
