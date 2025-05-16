
import { FormattingType, hasFormatting } from "@/lib/formatting";

/**
 * Check which formatting is active for the current selection
 */
export const checkActiveFormats = (selectedText: string): FormattingType[] => {
  const formats: FormattingType[] = [];
  
  if (hasFormatting(selectedText, 'bold')) formats.push('bold');
  if (hasFormatting(selectedText, 'italic')) formats.push('italic');
  if (hasFormatting(selectedText, 'underline')) formats.push('underline');
  if (hasFormatting(selectedText, 'list')) formats.push('list');
  
  return formats;
};
