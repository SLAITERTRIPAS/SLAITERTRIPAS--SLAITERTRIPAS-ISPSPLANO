const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The file has this structure:
// <main className="...">
//   <div className="bg-white border ...">
//     <div className="relative z-10 ...">
//       {activeChapter === 1 && ( ... )}
//       {activeChapter === 2 && ( ... )}
//       ...
//       {activeChapter === 17 && ( ... )}
//     </div>
//   </div>
// </main>

// Replace the main wrapper opening
const mainRegex = /<main className="space-y-8 print:space-y-0 print:w-full print:block">\s*<div className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-\[794px\] print:max-w-none min-h-\[1123px\] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">\s*<div className="relative z-10 flex-1 w-full flex flex-col">/g;

content = content.replace(mainRegex, `<main className="space-y-16 print:space-y-0 print:w-full print:block flex flex-col items-center max-w-full relative z-10">`);

// Replace the closing of the main wrapper
// We need to find `</main>` and remove the two `</div>` before it.
content = content.replace(/<\/div>\s*<\/div>\s*<\/main>/, '</main>');


const chapterHeader = (chapterNum) => `
            <div id="chapter-${chapterNum}" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-after-page" style={{ pageBreakAfter: 'always' }}>
              <div className="relative z-10 flex-1 w-full flex flex-col">
`;

// It's tricky to remove the `)}` safely using regex because there are other JSX expressions.
// But we know that for `{activeChapter === 1 && (` the closing `)}` is just before `{activeChapter === 2 && (`
// Let's split by `{activeChapter === `

let parts = content.split(/\{activeChapter === \d+ && \(/);
let newContent = parts[0]; // everything before the first chapter

for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    // the part ends with `)}` and some whitespace before the next chapter split, OR before `</main>` for the last one.
    // So we just need to replace the VERY LAST `)}` in this string with `</div></div>`
    
    // Find the last index of `)}`
    let lastIdx = part.lastIndexOf(')}');
    if (lastIdx !== -1) {
        part = part.substring(0, lastIdx) + '\n              </div>\n            </div>\n' + part.substring(lastIdx + 2);
    }
    
    newContent += chapterHeader(i) + part;
}


// Now, change the sidebar onClick to scroll instead of setting active state!
// `onClick={() => setActiveChapter(chapter.id)}`
newContent = newContent.replace(/onClick=\{\(\) => setActiveChapter\(chapter\.id\)\}/g, `onClick={() => {
                      setActiveChapter(chapter.id);
                      document.getElementById('chapter-' + chapter.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}`);


fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', newContent);
