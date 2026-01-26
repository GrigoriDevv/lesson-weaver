import { max } from "date-fns";
import pdfToText from "react-pdftotext";

export async function extractTextFromPDF(
  source: File | string,
): Promise<string> {
  try {
    let file: Blob;

    if (typeof source === "string") {
      const response = await fetch(source);
      if (!response.ok) throw new Error("Failed to fetch PDF from URL");
      file = await response.blob();
    } else {
      file = source;
    }

    const text = await pdfToText(file);
    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

export function truncatePDFText(
  text: string,
  maxLength: number = 8000,
): string {
  return text.length > maxLength
    ? text.slice(0, maxLength) + "...\n[Truncated]"
    : text;
}
