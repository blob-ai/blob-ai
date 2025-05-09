
// Unified text formatting utility
// Handles conversion between markdown and HTML for consistent rendering

export type FormattingType = 'bold' | 'italic' | 'underline' | 'list';

// Regular expressions for detecting markdown patterns
const MARKDOWN_PATTERNS = {
  bold: /\*\*(.*?)\*\*/g,
  italic: /\*(.*?)\*/g,
  underline: /_(.*?)_/g,
  list: /^• (.*)$/gm,
};

// Convert markdown to HTML for rendering in previews
export const markdownToHtml = (text: string): string => {
  if (!text) return '';
  
  // Process the markdown in a specific order to handle nested formatting
  let html = text
    // First, handle list items (they can contain other formatting)
    .replace(MARKDOWN_PATTERNS.list, '<li>$1</li>')
    // Then handle bold text
    .replace(MARKDOWN_PATTERNS.bold, '<strong>$1</strong>')
    // Then handle italic text
    .replace(MARKDOWN_PATTERNS.italic, '<em>$1</em>')
    // Finally handle underlined text
    .replace(MARKDOWN_PATTERNS.underline, '<u>$1</u>');
  
  // Convert line breaks to <br> tags
  html = html.replace(/\n/g, '<br>');
  
  // Wrap lists in <ul> tags
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
    // Clean up any nested ul tags
    html = html.replace(/<\/ul><ul>/g, '');
  }
  
  return html;
};

// Apply formatting to selected text
export const applyFormatting = (
  text: string,
  format: FormattingType,
  selectionStart: number,
  selectionEnd: number
): string => {
  const selectedText = text.substring(selectionStart, selectionEnd);
  let formattedText = '';
  
  switch (format) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'underline':
      formattedText = `_${selectedText}_`;
      break;
    case 'list':
      // Split by newlines and add bullet points
      formattedText = selectedText
        .split('\n')
        .map(line => `• ${line}`)
        .join('\n');
      break;
    default:
      formattedText = selectedText;
  }
  
  return (
    text.substring(0, selectionStart) +
    formattedText +
    text.substring(selectionEnd)
  );
};

// Check if text has specific formatting
export const hasFormatting = (text: string, format: FormattingType): boolean => {
  return MARKDOWN_PATTERNS[format].test(text);
};

// Platform-specific formatting helpers
export const getPlatformFormattingLimits = (platform: string): {
  supports: Record<FormattingType, boolean>;
  characterLimit: number;
} => {
  switch (platform) {
    case 'twitter':
      return {
        supports: {
          bold: true,
          italic: true,
          underline: false, // Twitter doesn't support underline
          list: true,
        },
        characterLimit: 280,
      };
    case 'linkedin':
      return {
        supports: {
          bold: true,
          italic: true,
          underline: true,
          list: true,
        },
        characterLimit: 3000,
      };
    case 'facebook':
      return {
        supports: {
          bold: true,
          italic: true,
          underline: true,
          list: true,
        },
        characterLimit: 63206,
      };
    default:
      return {
        supports: {
          bold: true,
          italic: true,
          underline: true,
          list: true,
        },
        characterLimit: Infinity,
      };
  }
};

// Add syntax highlighting to content in the editor
export const highlightMarkdown = (content: string): string => {
  // This would be implemented with a proper syntax highlighting library
  // For now, we'll return the content as is
  return content;
};

// Clean up formatting based on platform limitations
export const sanitizeForPlatform = (
  content: string,
  platform: string
): string => {
  const { supports } = getPlatformFormattingLimits(platform);
  let result = content;
  
  // Remove unsupported formatting
  if (!supports.bold) {
    result = result.replace(MARKDOWN_PATTERNS.bold, '$1');
  }
  
  if (!supports.italic) {
    result = result.replace(MARKDOWN_PATTERNS.italic, '$1');
  }
  
  if (!supports.underline) {
    result = result.replace(MARKDOWN_PATTERNS.underline, '$1');
  }
  
  if (!supports.list) {
    result = result.replace(MARKDOWN_PATTERNS.list, '$1');
  }
  
  return result;
};
