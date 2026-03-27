export const stripMarkdown = (text) => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1')     // Italic
        .replace(/__(.*?)__/g, '$1')     // Underline
        .replace(/_(.*?)_/g, '$1')       // Italic
        .replace(/#+\s/g, '')            // Headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/`(.*?)`/g, '$1')       // Inline Code
        .replace(/```[\s\S]*?```/g, '')  // Code blocks
        .replace(/\n+/g, ' ')            // Remove newlines for preview
        .trim();
};
