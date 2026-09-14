const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The A4 wrapper is at the root of <main> right now.
// We need to move the A4 wrapper inside each condition so that EACH chapter is its own A4 page!

// Let's replace:
// <main className="...">
//   <div className="bg-white border border-slate-200 ..."> 
//     <div className="relative z-10 flex-1 w-full flex flex-col">

// with:
// <main className="space-y-12 print:space-y-0 print:w-full print:block flex flex-col">

// And then for each chapter:
// {activeChapter === 1 && (
//   <div id="chapter-1" className="bg-white border border-slate-200 p-12 w-full max-w-[794px] min-h-[1123px] mx-auto shadow-xl relative flex flex-col shrink-0 print:break-inside-avoid print:break-after-page page-break-after:always">

// Wait, the user said "as paginas devem estar separadas, uma a uma".
// Currently the system has a sidebar and shows ONE page at a time (like tabs).
// Does the user mean when PRINTING they should be separated? Or on screen?
// If on screen, they don't want the sidebar navigation anymore, they want a continuous scroll of separated pages.
// Let's remove the `{activeChapter === X && (` logic entirely and wrap each chapter in an A4 container!

let newContent = content;

// First, find the `<main>` tag
const mainRegex = /<main className="space-y-8 print:space-y-0 print:w-full print:block">\s*<div className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-\[794px\] print:max-w-none min-h-\[1123px\] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">\s*<div className="relative z-10 flex-1 w-full flex flex-col">/;

const newMainWrapper = `<main className="space-y-16 print:space-y-0 print:w-full print:block flex flex-col items-center max-w-full">
            {/* The sidebar will scroll to these IDs instead of switching active state if we want, or we can just render them all. */}`;

newContent = newContent.replace(mainRegex, newMainWrapper);

// Now, replace every `{activeChapter === X && (` with the A4 page wrapper!
const chapterHeader = (chapterNum) => `
            {/* CHAPTER ${chapterNum} */}
            <div id="chapter-${chapterNum}" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-after-page" style={{ pageBreakAfter: 'always' }}>
              <div className="relative z-10 flex-1 w-full flex flex-col">
`;

// It's safer to just let them all render without the `&& (`
for (let i = 1; i <= 17; i++) {
   const searchStr = `{activeChapter === ${i} && (`;
   newContent = newContent.replace(searchStr, chapterHeader(i));
}
// We also need to remove the closing `)}` for each of these.
// Because it's too risky to do this with regex, I'll write a small parser.

