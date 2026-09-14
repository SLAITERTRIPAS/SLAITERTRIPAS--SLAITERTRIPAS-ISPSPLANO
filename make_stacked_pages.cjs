const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The user wants the pages to be separated one by one. This means they don't want a "single" A4 page view that switches content (like a tab).
// They want the document to be a stack of A4 pages, like a real PDF viewer.
// Let's modify the file so it maps over chapters and renders them as stacked A4 pages.

// 1. Remove the conditional rendering logic: `{activeChapter === 1 && (` -> `<div id="chapter-1">`
content = content.replace(/\{activeChapter === 1 && \(\s*<div className="flex items-center gap-8/g, 
`<div id="chapter-1" className="flex items-center gap-8`);

// 2. We need to do this carefully. 
// A better way is to replace the wrapper:
// className="bg-white border ... "
// That wrapper is currently repeated? No, it's just ONE wrapper.
// Oh! The wrapper is `<div className="bg-white border border-slate-200 ...">` 
// and inside it, we have ALL the `{activeChapter === X && ...}` checks!
// If they are all inside ONE A4 page, then when printing, they overwrite each other or just one prints.
// The user wants ALL pages to be visible and separated "uma a uma".

const regex = /<main className="space-y-8 print:space-y-0 print:w-full print:block">\s*<div className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-\[794px\] print:max-w-none min-h-\[1123px\] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">/g;

// Let's check if the A4 wrapper is inside the main.
