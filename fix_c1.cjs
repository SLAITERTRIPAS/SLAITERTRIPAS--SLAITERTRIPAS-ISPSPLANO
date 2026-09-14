const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// If we want each page completely separated, instead of iterating over `chapters`, we can just hardcode the loop so `Capa` and `Contra-Capa` are just treated as two separate pages.
// But first, let's remove the tabs at the top entirely since they are no longer needed (we stack the pages).
// The tabs are around line 692-719. Let's just remove them.

const tabRegex = /<div className="flex items-center gap-8 border-b border-slate-200 pb-px print:hidden">[\s\S]*?<\/div>/;
content = content.replace(tabRegex, "");

// Now let's fix `chapterContent[1]` to return a React Fragment containing BOTH pages, but wait!
// The loop wraps `chapterContent[1]` in ONE A4 page. 
// If `chapterContent[1]` returns TWO A4 pages, the outer loop shouldn't have an A4 wrapper for chapter 1.

// Let's modify the outer loop! 
// Instead of wrapping everything in A4:
/*
{chapters.map((chapter) => {
  if (chapter.id === 1) {
    return (
      <Fragment key={chapter.id}>
        <div className="A4"> ... Capa ... </div>
        <div className="A4"> ... Contra Capa ... </div>
      </Fragment>
    )
  }
  return (
    <div className="A4"> ... {chapterContent[chapter.id]} ... </div>
  )
})}
*/

// Let's just define Capa and ContraCapa in `chapterContent[1]` as TWO divs that each are `w-full h-full`. But the outer wrapper forces `min-h-[1123px]`.

// So let's change `chapterContent[1]` inside the map loop.
const oldLoop = `<div \n                  key={chapter.id}\n                  id={"chapter-" + chapter.id}\n                  className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always"\n                >\n                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />\n                  <div className="relative z-10 flex-1 w-full flex flex-col">\n                    {chapterContent[chapter.id] || (\n                      <div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">\n                        <div className="w-20 h-20 bg-slate-50 rounded-[2px] flex items-center justify-center mb-6">\n                          <Clock className="w-10 h-10 text-slate-300" />\n                        </div>\n                        <h2 className="font-black text-slate-900 mb-2 text-[13px]">{chapter.title}</h2>\n                        <p className="text-slate-400 max-w-sm text-[12px]">Informação detalhada em fase de consolidação para este capítulo técnico.</p>\n                      </div>\n                    )}\n                  </div>\n                </div>`;

const newLoop = `{chapter.id === 1 ? chapterContent[1] : (
                <div 
                  key={chapter.id}
                  id={"chapter-" + chapter.id}
                  className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />
                  <div className="relative z-10 flex-1 w-full flex flex-col">
                    {chapterContent[chapter.id] || (
                      <div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2px] flex items-center justify-center mb-6">
                          <Clock className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="font-black text-slate-900 mb-2 text-[13px]">{chapter.title}</h2>
                        <p className="text-slate-400 max-w-sm text-[12px]">Informação detalhada em fase de consolidação para este capítulo técnico.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}`;

content = content.replace(oldLoop, newLoop);

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);

