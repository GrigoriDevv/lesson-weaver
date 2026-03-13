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
const CHARCOAL = "2C3E50";
const DARK_TEXT = "1A1A2E";
const BODY_TEXT = "3D4F5F";
const MUTED = "7F8C9B";
const BORDER_LIGHT = "D4CFC0";
const SECTION_ACCENTS = [
  "1B3A5C", "2D6A4F", "6C3D1F", "4A3B6B", "8B3A3A",
  "1F5F7A", "3B6B3D", "7A5C1F", "5A3B7A", "1A6B5C",
];

// ─── Subject → Image Keyword Map ────────────────────────────────────────────
const SUBJECT_IMAGE_KEYWORDS: Record<string, string[]> = {
  matematica: ["mathematics", "geometry", "equations"],
  matemática: ["mathematics", "geometry", "equations"],
  fisica: ["physics", "science-lab", "universe"],
  física: ["physics", "science-lab", "universe"],
  quimica: ["chemistry", "laboratory", "molecules"],
  química: ["chemistry", "laboratory", "molecules"],
  biologia: ["biology", "nature", "microscope"],
  historia: ["history", "ancient", "library"],
  história: ["history", "ancient", "library"],
  geografia: ["geography", "globe", "landscape"],
  portugues: ["books", "literature", "writing"],
  português: ["books", "literature", "writing"],
  literatura: ["books", "literature", "classic-library"],
  ingles: ["english", "language", "communication"],
  inglês: ["english", "language", "communication"],
  arte: ["art", "painting", "museum"],
  filosofia: ["philosophy", "thinking", "ancient-greece"],
  sociologia: ["sociology", "society", "community"],
  educação: ["education", "university", "classroom"],
  ciencias: ["science", "research", "laboratory"],
  ciências: ["science", "research", "laboratory"],
  tecnologia: ["technology", "computer", "digital"],
  programação: ["coding", "programming", "computer-science"],
  medicina: ["medicine", "health", "hospital"],
  direito: ["law", "justice", "court"],
  economia: ["economics", "finance", "market"],
  psicologia: ["psychology", "mind", "brain"],
  musica: ["music", "instruments", "concert"],
  música: ["music", "instruments", "concert"],
};

function getImageKeywords(subject: string): string[] {
  const lower = subject.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, keywords] of Object.entries(SUBJECT_IMAGE_KEYWORDS)) {
    const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(normalizedKey)) return keywords;
  }
  return ["education", "university", "academic"];
}

async function fetchImageAsBase64(keyword: string, width = 800, height = 600): Promise<string | null> {
  try {
    const url = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keyword)},academic`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function fetchThematicImages(subject: string): Promise<(string | null)[]> {
  const keywords = getImageKeywords(subject);
  const promises = keywords.map((kw) => fetchImageAsBase64(kw, 800, 500));
  return Promise.all(promises);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function addAcademicFooter(slide: PptxGenJS.Slide) {
  // Thin gold line
  slide.addShape("rect" as any, {
    x: 0.8, y: 6.78, w: 11.6, h: 0.015,
    fill: { type: "solid", color: GOLD },
  });
  slide.addText("ClassBuddy", {
    x: 0.8, y: 6.88, w: 3, h: 0.4,
    fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia",
    italic: true,
  });
  slide.addText(new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }), {
    x: 9, y: 6.88, w: 3.4, h: 0.4,
    fontSize: 8, color: MUTED, fontFace: "Georgia", align: "right",
  });
}

function addSideAccent(slide: PptxGenJS.Slide, color: string) {
  slide.addShape("rect" as any, {
    x: 0, y: 0, w: 0.06, h: "100%" as any,
    fill: { type: "solid", color },
  });
  // Small gold detail at top
  slide.addShape("rect" as any, {
    x: 0.06, y: 0, w: 0.03, h: 1.2,
    fill: { type: "solid", color: GOLD },
  });
}

function addImageToSlide(slide: PptxGenJS.Slide, imageData: string | null, x: number, y: number, w: number, h: number, pptx: PptxGenJS) {
  if (imageData) {
    // Rounded clip container
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      fill: { type: "solid", color: BORDER_LIGHT },
      rectRadius: 0.08,
    });
    slide.addImage({
      data: imageData,
      x: x + 0.04, y: y + 0.04, w: w - 0.08, h: h - 0.08,
      rounding: true,
    } as any);
  } else {
    // Decorative placeholder
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      fill: { type: "solid", color: SLATE }, transparency: 88,
      rectRadius: 0.08,
      line: { color: GOLD, width: 0.5 },
    } as any);
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function generatePptx(lessonPlan: LessonPlan): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "ClassBuddy";
  pptx.title = lessonPlan.subject || "Plano de Aula";

  // Fetch thematic images in parallel
  const images = await fetchThematicImages(lessonPlan.subject || "educação");

  // ═══════════════════════════════════════════
  // SLIDE 1 — COVER (Formal Academic)
  // ═══════════════════════════════════════════
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };

  // Subtle geometric decoration
  cover.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.06, h: "100%" as any,
    fill: { type: "solid", color: GOLD },
  } as any);
  cover.addShape(pptx.ShapeType.rect, {
    x: 0.06, y: 6.0, w: 13, h: 0.008,
    fill: { type: "solid", color: GOLD }, transparency: 50,
  } as any);

  // Cover image on the right
  addImageToSlide(cover, images[0] || null, 8.2, 0.8, 4.2, 3.2, pptx);

  // Gold accent line above title
  cover.addShape("rect" as any, {
    x: 0.8, y: 2.3, w: 1.5, h: 0.04,
    fill: { type: "solid", color: GOLD },
  });

  // Subject title
  cover.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0.8, y: 2.6, w: 7, h: 1.5,
    fontSize: 40, bold: true, color: WHITE, fontFace: "Georgia",
    lineSpacingMultiple: 1.15,
  });

  // Objective subtitle
  cover.addText(lessonPlan.objective, {
    x: 0.8, y: 4.3, w: 7, h: 1.2,
    fontSize: 14, color: MUTED, fontFace: "Georgia",
    lineSpacingMultiple: 1.5, italic: true,
  });

  // Bottom info
  cover.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 5.8, w: 2.6, h: 0.42,
    fill: { type: "solid", color: GOLD }, rectRadius: 0.04,
  });
  cover.addText(`${lessonPlan.sections.length} seções`, {
    x: 0.8, y: 5.8, w: 2.6, h: 0.42,
    fontSize: 11, bold: true, color: NAVY, fontFace: "Georgia",
    align: "center", valign: "middle",
  });

  addAcademicFooter(cover);

  // ═══════════════════════════════════════════
  // SLIDE 2 — OBJECTIVE
  // ═══════════════════════════════════════════
  const objSlide = pptx.addSlide();
  objSlide.background = { color: CREAM };
  addSideAccent(objSlide, NAVY);

  objSlide.addText("OBJETIVO DA AULA", {
    x: 0.8, y: 0.5, w: 6, h: 0.35,
    fontSize: 10, bold: true, color: GOLD, fontFace: "Georgia",
    charSpacing: 4,
  });

  // Gold divider
  objSlide.addShape("rect" as any, {
    x: 0.8, y: 0.95, w: 2.5, h: 0.025,
    fill: { type: "solid", color: GOLD },
  });

  objSlide.addText(lessonPlan.objective, {
    x: 0.8, y: 1.4, w: 7, h: 2.5,
    fontSize: 20, color: DARK_TEXT, fontFace: "Georgia",
    lineSpacingMultiple: 1.6, italic: true,
  });

  // Image on right
  addImageToSlide(objSlide, images[1] || images[0] || null, 8.5, 1.2, 3.5, 2.8, pptx);

  // Overview cards
  objSlide.addShape("rect" as any, {
    x: 0.8, y: 4.3, w: 11.4, h: 0.015,
    fill: { type: "solid", color: BORDER_LIGHT },
  });

  const cardW = 3.5;
  lessonPlan.sections.slice(0, 3).forEach((section, i) => {
    const cx = 0.8 + i * (cardW + 0.3);
    objSlide.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: 4.6, w: cardW, h: 1.5,
      fill: { type: "solid", color: WARM_WHITE },
      shadow: { type: "outer", blur: 3, offset: 1, color: "000000", opacity: 0.05 } as any,
      rectRadius: 0.08,
      line: { color: BORDER_LIGHT, width: 0.5 },
    } as any);
    // Number circle
    objSlide.addShape(pptx.ShapeType.ellipse, {
      x: cx + 0.15, y: 4.75, w: 0.35, h: 0.35,
      fill: { type: "solid", color: SECTION_ACCENTS[i % SECTION_ACCENTS.length] },
    });
    objSlide.addText(`${i + 1}`, {
      x: cx + 0.15, y: 4.75, w: 0.35, h: 0.35,
      fontSize: 11, bold: true, color: WHITE, fontFace: "Georgia",
      align: "center", valign: "middle",
    });
    objSlide.addText(section.title, {
      x: cx + 0.6, y: 4.75, w: cardW - 0.8, h: 0.5,
      fontSize: 11, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
  });

  addAcademicFooter(objSlide);

  // ═══════════════════════════════════════════
  // CONTENT SLIDES
  // ═══════════════════════════════════════════
  lessonPlan.sections.forEach((section, index) => {
    const slide = pptx.addSlide();
    const accent = SECTION_ACCENTS[index % SECTION_ACCENTS.length];
    const sectionImage = images[index % images.length];

    slide.background = { color: CREAM };
    addSideAccent(slide, accent);

    // Section label
    slide.addText(`SEÇÃO ${index + 1}`, {
      x: 0.8, y: 0.4, w: 6, h: 0.3,
      fontSize: 9, bold: true, color: GOLD, fontFace: "Georgia",
      charSpacing: 4,
    });

    // Section title
    slide.addText(section.title, {
      x: 0.8, y: 0.8, w: 8, h: 0.7,
      fontSize: 26, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });

    // Gold divider
    slide.addShape("rect" as any, {
      x: 0.8, y: 1.55, w: 3, h: 0.025,
      fill: { type: "solid", color: GOLD },
    });

    // Content area — if image available, use 2-column layout
    if (sectionImage) {
      // Text on left
      slide.addText(section.content, {
        x: 0.8, y: 1.85, w: 7, h: 2.6,
        fontSize: 14, color: BODY_TEXT, fontFace: "Georgia",
        lineSpacingMultiple: 1.65, valign: "top",
      });
      // Image on right
      addImageToSlide(slide, sectionImage, 8.2, 1.85, 4, 2.6, pptx);
    } else {
      // Full-width content card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: 1.85, w: 11.4, h: 2.6,
        fill: { type: "solid", color: WARM_WHITE },
        shadow: { type: "outer", blur: 3, offset: 1, color: "000000", opacity: 0.04 } as any,
        rectRadius: 0.08,
      });
      slide.addText(section.content, {
        x: 1.1, y: 2.0, w: 10.8, h: 2.3,
        fontSize: 14, color: BODY_TEXT, fontFace: "Georgia",
        lineSpacingMultiple: 1.65, valign: "top",
      });
    }

    // Activities
    if (section.activities && section.activities.length > 0) {
      const actY = 4.7;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: actY, w: 11.4, h: 0.42 + section.activities.length * 0.4,
        fill: { type: "solid", color: WARM_WHITE },
        rectRadius: 0.08,
        line: { color: GOLD, width: 0.8 },
      } as any);

      slide.addText("Atividades", {
        x: 1.1, y: actY + 0.06, w: 6, h: 0.32,
        fontSize: 11, bold: true, color: GOLD, fontFace: "Georgia",
        charSpacing: 2,
      });

      section.activities.forEach((activity, idx) => {
        const ay = actY + 0.42 + idx * 0.4;
        slide.addText("—", {
          x: 1.2, y: ay, w: 0.3, h: 0.35,
          fontSize: 12, color: GOLD, fontFace: "Georgia",
        });
        slide.addText(activity, {
          x: 1.5, y: ay, w: 10.4, h: 0.35,
          fontSize: 12, color: DARK_TEXT, fontFace: "Georgia", valign: "middle",
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
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 10, bold: true, color: GOLD, fontFace: "Georgia",
      charSpacing: 4,
    });
    methSlide.addText("Abordagem Pedagógica", {
      x: 0.8, y: 0.85, w: 9, h: 0.6,
      fontSize: 26, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
    methSlide.addShape("rect" as any, {
      x: 0.8, y: 1.5, w: 3, h: 0.025,
      fill: { type: "solid", color: GOLD },
    });
    methSlide.addText(lessonPlan.methodology, {
      x: 0.8, y: 1.8, w: 11.4, h: 4.5,
      fontSize: 15, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.65, valign: "top",
    });
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
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 10, bold: true, color: GOLD, fontFace: "Georgia",
      charSpacing: 4,
    });
    evalSlide.addText("Critérios de Avaliação", {
      x: 0.8, y: 0.85, w: 9, h: 0.6,
      fontSize: 26, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
    evalSlide.addShape("rect" as any, {
      x: 0.8, y: 1.5, w: 3, h: 0.025,
      fill: { type: "solid", color: GOLD },
    });
    evalSlide.addText(lessonPlan.evaluation, {
      x: 0.8, y: 1.8, w: 11.4, h: 4.5,
      fontSize: 15, color: BODY_TEXT, fontFace: "Georgia",
      lineSpacingMultiple: 1.65, valign: "top",
    });
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
      x: 0.8, y: 0.4, w: 6, h: 0.35,
      fontSize: 10, bold: true, color: GOLD, fontFace: "Georgia",
      charSpacing: 4,
    });
    resSlide.addText("Materiais Necessários", {
      x: 0.8, y: 0.85, w: 9, h: 0.6,
      fontSize: 26, bold: true, color: DARK_TEXT, fontFace: "Georgia",
    });
    resSlide.addShape("rect" as any, {
      x: 0.8, y: 1.5, w: 3, h: 0.025,
      fill: { type: "solid", color: GOLD },
    });

    lessonPlan.resources.forEach((resource, idx) => {
      const ry = 1.9 + idx * 0.5;
      resSlide.addText("—", {
        x: 1.0, y: ry, w: 0.3, h: 0.4,
        fontSize: 13, color: GOLD, fontFace: "Georgia",
      });
      resSlide.addText(resource, {
        x: 1.4, y: ry, w: 10.5, h: 0.4,
        fontSize: 14, color: DARK_TEXT, fontFace: "Georgia", valign: "middle",
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
    x: 0.8, y: 0.4, w: 6, h: 0.35,
    fontSize: 10, bold: true, color: GOLD, fontFace: "Georgia",
    charSpacing: 4,
  });
  summary.addText("Visão Geral do Plano", {
    x: 0.8, y: 0.85, w: 9, h: 0.6,
    fontSize: 26, bold: true, color: DARK_TEXT, fontFace: "Georgia",
  });
  summary.addShape("rect" as any, {
    x: 0.8, y: 1.5, w: 3, h: 0.025,
    fill: { type: "solid", color: GOLD },
  });

  // Summary table
  const headerRow: PptxGenJS.TableRow = [
    { text: "#", options: { fontSize: 11, bold: true, color: WHITE, fill: { type: "solid" as const, color: NAVY }, align: "center" as const, valign: "middle" as const, fontFace: "Georgia" } },
    { text: "Seção", options: { fontSize: 11, bold: true, color: WHITE, fill: { type: "solid" as const, color: NAVY }, valign: "middle" as const, fontFace: "Georgia" } },
  ];

  const dataRows: PptxGenJS.TableRow[] = lessonPlan.sections.map((section, i) => {
    const rowBg = i % 2 === 0 ? WARM_WHITE : CREAM;
    return [
      { text: `${i + 1}`, options: { fontSize: 11, bold: true, color: GOLD, fill: { type: "solid" as const, color: rowBg }, align: "center" as const, valign: "middle" as const, fontFace: "Georgia" } },
      { text: section.title, options: { fontSize: 12, color: DARK_TEXT, fill: { type: "solid" as const, color: rowBg }, valign: "middle" as const, fontFace: "Georgia" } },
    ];
  });

  summary.addTable([headerRow, ...dataRows], {
    x: 0.8, y: 1.8, w: 11.4,
    colW: [0.7, 10.7],
    fontFace: "Georgia",
    rowH: 0.55,
    border: { type: "solid", color: BORDER_LIGHT, pt: 0.5 } as any,
  });

  addAcademicFooter(summary);

  // ═══════════════════════════════════════════
  // CLOSING SLIDE
  // ═══════════════════════════════════════════
  const closing = pptx.addSlide();
  closing.background = { color: NAVY };

  // Gold accent
  closing.addShape("rect" as any, {
    x: 0, y: 0, w: 0.06, h: "100%" as any,
    fill: { type: "solid", color: GOLD },
  });
  closing.addShape("rect" as any, {
    x: 4.5, y: 2.8, w: 4.2, h: 0.03,
    fill: { type: "solid", color: GOLD },
  });

  closing.addText("Obrigado", {
    x: 0, y: 2.0, w: "100%" as any, h: 0.9,
    fontSize: 44, bold: true, color: WHITE, fontFace: "Georgia",
    align: "center",
  });

  closing.addShape("rect" as any, {
    x: 4.5, y: 3.1, w: 4.2, h: 0.03,
    fill: { type: "solid", color: GOLD },
  });

  closing.addText(lessonPlan.subject || "Plano de Aula", {
    x: 0, y: 3.5, w: "100%" as any, h: 0.5,
    fontSize: 16, color: MUTED, fontFace: "Georgia",
    align: "center", italic: true,
  });

  closing.addText("Gerado com ClassBuddy", {
    x: 0, y: 4.5, w: "100%" as any, h: 0.4,
    fontSize: 10, color: GOLD, fontFace: "Georgia",
    align: "center", italic: true,
  });

  // Download
  const fileName = `plano_${(lessonPlan.subject || "aula").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`;
  await pptx.writeFile({ fileName });
}
