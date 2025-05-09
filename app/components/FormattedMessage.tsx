import React, { useEffect, useRef } from 'react';

interface FormattedMessageProps {
  text: string;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add syntax highlighting and other post-render enhancements
    const container = containerRef.current;
    if (container) {
      // Apply any dynamic styling or animations here if needed
      const tables = container.querySelectorAll('table');
      tables.forEach(table => {
        table.classList.add('table-appear');
      });
    }
  }, [text]);

  // Process text to enhance formatting
  const formatText = (input: string) => {
    // Replace section separators (em dashes) with styled dividers
    let formatted = input.replace(/⸻/g, '<hr class="my-5 border-t border-slate-200" />');
    
    // Format tables with proper styling
    formatted = formatted.replace(
      /\|(.+)\|\n\|(-+\|)+/g, 
      '<table class="min-w-full my-3 border-collapse rounded-md overflow-hidden shadow-sm border border-slate-200"><thead class="bg-slate-50"><tr>$1</tr></thead><tbody>'
    );
    formatted = formatted.replace(/\|(.+)\|(?!\n\|(-+\|)+)/g, '<tr>$1</tr>');
    formatted = formatted.replace(/\|([^|]+)/g, '<td class="border border-slate-200 px-3 py-2 text-sm">$1</td>');
    formatted = formatted.replace(/<\/tr><\/tbody>\n<tr>/g, '</tr>\n<tr>');
    formatted = formatted.replace(/<\/tr>\n(?!<tr>)/g, '</tr></tbody></table>');

    // Format emoji indicators more prominently
    const emojis = {
      '📊': 'bg-purple-50 text-purple-700 border-purple-100', // Classification
      '💰': 'bg-amber-50 text-amber-700 border-amber-100',   // Costs
      '⏱️': 'bg-blue-50 text-blue-700 border-blue-100',      // Timeline
      '✅': 'bg-green-50 text-green-700 border-green-100',    // Compliance
      '🚫': 'bg-red-50 text-red-700 border-red-100',         // Non-compliance
      '📄': 'bg-sky-50 text-sky-700 border-sky-100',         // Documentation
      '📌': 'bg-rose-50 text-rose-700 border-rose-100',      // Important notes
      '📋': 'bg-indigo-50 text-indigo-700 border-indigo-100', // List
    };

    // Loop through emoji indicators and apply custom styling
    Object.entries(emojis).forEach(([emoji, classes]) => {
      const pattern = new RegExp(`(${emoji}\\s+)([^\\n]+)`, 'u');
      formatted = formatted.replace(
        pattern,
        `<div class="text-lg font-semibold mt-5 mb-3 flex items-center"><span class="mr-2">${emoji}</span><span class="${classes} px-2.5 py-1 rounded-full text-base">${'$2'}</span></div>`
      );
    });

    // Format standard bullets with better styling
    formatted = formatted.replace(
      /^[•-]\s+(.+)$/gm,
      '<div class="flex items-start my-2 px-1"><span class="text-slate-400 mr-2 mt-0.5">•</span><span>$1</span></div>'
    );

    // Add bold formatting for key terms
    formatted = formatted.replace(
      /\*\*([^*]+)\*\*/g,
      '<span class="font-semibold text-slate-800">$1</span>'
    );

    // Format numbering with better styling
    formatted = formatted.replace(
      /^(\d+)\.\s+(.+)$/gm, 
      '<div class="flex items-start my-2 pl-1"><span class="flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-700 text-xs font-medium rounded-full h-5 w-5 mr-2">$1</span><span>$2</span></div>'
    );

    // Format section titles that don't have emojis
    formatted = formatted.replace(
      /^([A-Z][^a-z\n:]+):$/gm,
      '<div class="text-base font-medium text-slate-800 mt-4 mb-2 border-b border-slate-200 pb-1">$1</div>'
    );

    return formatted;
  };

  return (
    <div 
      ref={containerRef}
      className="whitespace-pre-wrap text-sm break-words leading-relaxed text-slate-700 format-message"
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

export default FormattedMessage; 