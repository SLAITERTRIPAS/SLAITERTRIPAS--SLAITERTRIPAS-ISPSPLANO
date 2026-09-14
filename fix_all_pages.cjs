const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The user wants ALL pages to be separated "one by one" meaning they want to see them as individual stacked pages,
// or when printing, they want them to break per page.
// First, we need to add print:break-before-page or print:break-after-page to the A4 container.
// Right now the A4 container is:
// className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block"

content = content.replace(/className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-\[794px\] print:max-w-none min-h-\[1123px\] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block"/g, 'className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always"');

// If they want to see ALL pages stacked vertically in the UI instead of clicking the sidebar,
// we would need to remove the `{activeChapter === 1 && ( ... )}` condition, but that breaks the sidebar navigation logic.
// We can change the sidebar logic to just scroll to the chapter by ID!
// Wait, replacing `{activeChapter === X && (` with `<div id="chapter-X">` is complex because they are inside a <main> that is currently displaying conditionally.
// But if they are just talking about "as paginas devem estar separadas, uma a uma" they might mean exactly the print layout needing page breaks so it prints as multiple pages instead of one long continuous roll. 

// Let's add the page break CSS.
fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
