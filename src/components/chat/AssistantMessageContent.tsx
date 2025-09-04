import React from 'react';
import { cn } from '@/lib/utils';
import styles from './AssistantMessageContent.module.css';

interface AssistantMessageContentProps {
  content: string;
}

const AssistantMessageContent: React.FC<AssistantMessageContentProps> = ({ content }) => {
  // Process the message content to properly render markdown-like formatting
  const processedContent = React.useMemo(() => {
    // Split the content into lines for processing
    const lines = content.split('\n');
    const processedLines: JSX.Element[] = [];
    
    let inList = false;
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let currentListItems: JSX.Element[] = [];
    
    const finishList = () => {
      if (currentListItems.length > 0) {
        processedLines.push(<ul key={`list-${processedLines.length}`} className={styles.messageContent}>{currentListItems}</ul>);
        currentListItems = [];
        inList = false;
      }
    };
    
    const finishCodeBlock = () => {
      if (inCodeBlock) {
        processedLines.push(
          <pre key={`code-${processedLines.length}`} className={styles.messageContent}>
            <code className={codeLanguage ? `language-${codeLanguage}` : ''}>{codeContent}</code>
          </pre>
        );
        inCodeBlock = false;
        codeContent = '';
        codeLanguage = '';
      }
    };
    
    // Highlight platform features with special styling
    const highlightFeatures = (text: string) => {
      // Feature patterns to highlight
      return text
        .replace(/Analyze Posts/g, '<span class="' + styles.feature + '">Analyze Posts</span>')
        .replace(/Create Content/g, '<span class="' + styles.feature + '">Create Content</span>')
        .replace(/Use Templates/g, '<span class="' + styles.feature + '">Use Templates</span>')
        .replace(/Use a template/g, '<span class="' + styles.feature + '">Use a template</span>')
        .replace(/Create a content draft/g, '<span class="' + styles.feature + '">Create a content draft</span>')
        .replace(/Analyze viral posts/g, '<span class="' + styles.feature + '">Analyze viral posts</span>')
        .replace(/Content Snapshot/g, '<span class="' + styles.feature + '">Content Snapshot</span>')
        .replace(/Hook Breakdown/g, '<span class="' + styles.feature + '">Hook Breakdown</span>')
        .replace(/Structural Formula/g, '<span class="' + styles.feature + '">Structural Formula</span>')
        .replace(/Engagement Triggers/g, '<span class="' + styles.feature + '">Engagement Triggers</span>')
        .replace(/Replication Blueprint/g, '<span class="' + styles.feature + '">Replication Blueprint</span>')
        .replace(/Hook Engineering/g, '<span class="' + styles.feature + '">Hook Engineering</span>')
        .replace(/Voice Calibration/g, '<span class="' + styles.feature + '">Voice Calibration</span>')
        .replace(/Engagement Optimization/g, '<span class="' + styles.feature + '">Engagement Optimization</span>')
        .replace(/Strategic Structure/g, '<span class="' + styles.feature + '">Strategic Structure</span>');
    };
    
    lines.forEach((line, index) => {
      // Detect code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3);
          return;
        } else {
          // Ending a code block
          finishCodeBlock();
          return;
        }
      }
      
      // If we're in a code block, just add the line to the code content
      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }
      
      // Process Markdown-style headings (**Heading**)
      const headingMatch = line.match(/^\s*\*\*([^*]+)\*\*:?$/);
      if (headingMatch) {
        finishList();
        processedLines.push(
          <h3 key={`heading-${index}`} className={cn("font-bold text-white mt-3 mb-2", styles.messageContent)}>{headingMatch[1]}</h3>
        );
        return;
      }
      
      // Process list items
      const listItemMatch = line.match(/^\s*(•|-|\*)\s+(.+)$/);
      if (listItemMatch) {
        if (!inList) {
          inList = true;
          currentListItems = [];
        }
        
        const itemContent = listItemMatch[2];
        
        // Check if the item has bold parts
        const boldPattern = /\*\*([^*]+)\*\*/g;
        let formattedItem;
        
        if (boldPattern.test(itemContent)) {
          // If there's bold formatting, we need to handle it
          let lastIndex = 0;
          const parts: JSX.Element[] = [];
          boldPattern.lastIndex = 0;
          
          let match;
          while ((match = boldPattern.exec(itemContent)) !== null) {
            if (match.index > lastIndex) {
              parts.push(<span key={`text-${lastIndex}`}>{itemContent.slice(lastIndex, match.index)}</span>);
            }
            parts.push(<strong key={`bold-${match.index}`} className={styles.highlight}>{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
          }
          
          // Add any remaining text
          if (lastIndex < itemContent.length) {
            parts.push(<span key={`text-end`}>{itemContent.slice(lastIndex)}</span>);
          }
          
          formattedItem = <>{parts}</>;
        } else {
          // Highlight platform features
          const featurePattern = /(Analyze Posts|Create Content|Use Templates|Create a content draft|Analyze viral posts|Use a template)/;
          if (featurePattern.test(itemContent)) {
            formattedItem = <span dangerouslySetInnerHTML={{ __html: highlightFeatures(itemContent) }} />;
          } else {
            formattedItem = <>{itemContent}</>;
          }
        }
        
        currentListItems.push(<li key={index}>{formattedItem}</li>);
        return;
      }
      
      // If we're in a list but this line isn't a list item, we need to check
      // if it's a continuation of the previous item or a new paragraph
      if (inList && line.trim() !== '') {
        // If it's indented, it's part of the previous item
        if (line.startsWith('    ') && currentListItems.length > 0) {
          const lastIndex = currentListItems.length - 1;
          const lastItem = currentListItems[lastIndex];
          currentListItems[lastIndex] = (
            <li key={`${lastIndex}`}>
              {lastItem.props.children}{' '}{line.trim()}
            </li>
          );
          return;
        } else {
          // Otherwise, finish the list
          finishList();
        }
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        if (inList) {
          finishList();
        } else {
          processedLines.push(<div key={`spacer-${index}`} className="my-2"></div>);
        }
        return;
      }
      
      // Process regular lines with potential formatting
      // Check for bold text
      const formattedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="' + styles.highlight + '">$1</strong>');
      
      // Check for emoji markers
      const emojiFormattedLine = formattedLine.replace(
        /(✅|💡|📊|⚠️)/g, 
        '<span class="' + styles.emoji + '">$1</span>'
      );
      
      // Highlight platform features
      const enhancedLine = highlightFeatures(emojiFormattedLine);
      
      processedLines.push(
        <p 
          key={`paragraph-${index}`}
          className="mb-2" 
          dangerouslySetInnerHTML={{ __html: enhancedLine }}
        />
      );
    });
    
    // Handle any unclosed lists or code blocks at the end
    finishList();
    finishCodeBlock();
    
    return processedLines;
  }, [content]);
  
  return (
    <div className={cn("whitespace-pre-wrap text-[15px] leading-relaxed", styles.messageContent)}>
      {processedContent}
    </div>
  );
};

export default AssistantMessageContent; 