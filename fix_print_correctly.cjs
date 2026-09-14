const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// I reverted the file to avoid syntax errors from parsing.
// The user wants: "as paginas devem estar separadas, uma a uma"
// If we just want the chapters to print on separate pages, we just need to add page-break-after/before to the chapter wrappers.
// Wait, when you select a chapter from the menu, only THAT chapter is shown on the screen.
// Does the user want ALL chapters to show on the screen?
// If they want the UI to be a stack of distinct pages, we can just map over `chapters` and render them.
// But the previous implementations of `chapters` logic in `ManualInstrucoesView` were hardcoded inside `{activeChapter === 1 && ( ... )}` blocks.

// Let's first re-apply the font-size fixes and the print separation.

// 1. Re-apply the font size fixes since they were lost on checkout
content = content.replace(/<(h[1-6])[^>]*className="([^"]*)"[^>]*>/g, (match, tag, className) => {
    let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim() + ' text-[13px]';
    return match.replace(className, newClass.trim());
});

content = content.replace(/<p[^>]*className="([^"]*)"[^>]*>/g, (match, className) => {
    let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim();
    if (!newClass.includes('text-[12px]')) newClass += ' text-[12px]';
    return match.replace(className, newClass.trim());
});

content = content.replace(/className="([^"]*font-black[^"]*)"/g, (match, className) => {
    if (className.includes('uppercase') && !className.includes('text-[13px]')) {
        let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
        newClass = newClass.replace(/\s+/g, ' ').trim() + ' text-[13px]';
        return `className="${newClass}"`;
    }
    return match;
});

content = content.replace(/<ul[^>]*className="([^"]*)"[^>]*>/g, (match, className) => {
    let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim();
    if (!newClass.includes('text-[12px]')) newClass += ' text-[12px]';
    return match.replace(className, newClass.trim());
});

content = content.replace(/text-\[10px\]|text-\[11px\]/g, 'text-[12px]');
content = content.replace(/text-xs|text-sm|text-2xl|text-3xl|text-xl/g, 'text-[12px]');

// 2. We need to implement "as paginas devem estar separadas, uma a uma".
// To do this safely, we will NOT remove the `activeChapter === X && ( ... )` checks.
// INSTEAD, we will render ALL of them inside separate A4 containers when printing or always.
// Let's modify the `activeChapter` state logic. If we remove the `activeChapter ===` checks, we need to wrap each block.
// But the syntax errors are too risky with regex.

// Alternative: We wrap the ENTIRE rendered output in a single component, and just add `print:break-after-page` to the A4 page container so that at least when printing, it breaks properly. But wait, if only one chapter is visible, it only prints one chapter!

// Let's make `renderContent` return an array of ALL chapters wrapped in A4 pages.

