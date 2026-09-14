const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// 1. Standardize all heading tags (h1-h6) to text-[13px]
content = content.replace(/<(h[1-6])[^>]*className="([^"]*)"[^>]*>/g, (match, tag, className) => {
    // replace any text-size class with text-[13px]
    let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim();
    newClass += ' text-[13px]';
    return match.replace(className, newClass.trim());
});

// 2. Standardize all paragraph tags <p> to text-[12px]
content = content.replace(/<p[^>]*className="([^"]*)"[^>]*>/g, (match, className) => {
    let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim();
    if (!newClass.includes('text-[12px]')) {
       newClass += ' text-[12px]';
    }
    return match.replace(className, newClass.trim());
});

// 3. Look for bold labels or specific sub-elements that might act as titles (often span or div with font-black/bold) and text-sizes,
// But to be safe, the user specifically mentioned "para todo os titulos deve ter 13". 
// Usually, labels like "DONO DO PROJETO" were in `<p className="... font-black ... text-[10px] ...">`. Let's fix them manually.
content = content.replace(/className="([^"]*font-black[^"]*)"/g, (match, className) => {
    if (className.includes('uppercase') && !className.includes('text-[13px]')) {
        let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
        newClass = newClass.replace(/\s+/g, ' ').trim();
        newClass += ' text-[13px]';
        return `className="${newClass}"`;
    }
    return match;
});

// 4. Ensure list items have 12px
content = content.replace(/<ul[^>]*className="([^"]*)"[^>]*>/g, (match, className) => {
    let newClass = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim();
    if (!newClass.includes('text-[12px]')) {
       newClass += ' text-[12px]';
    }
    return match.replace(className, newClass.trim());
});

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
