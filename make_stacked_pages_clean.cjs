const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The file compiles now, but we are back to the "single active chapter" view because I reverted earlier.
// The user wants "as paginas devem estar separadas, uma a uma".
// To safely implement this, let's change the wrapper logic at the bottom of the file to render ALL chapters!

// Currently:
// <motion.div ...>
//   {chapterContent[activeChapter] || (fallback)}
// </motion.div>

// We change it to map over chapters and render them sequentially!

const newRenderLogic = `
            <div className="w-full flex flex-col space-y-12 print:space-y-0">
              {chapters.map((chapter) => (
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
              ))}
            </div>
`;

// Find where <motion.div key={activeChapter + activeTab} starts
const regexStr = '<motion.div \\s*key=\\{activeChapter \\+ activeTab\\}[\\s\\S]*?\\</motion.div\\>';
const regex = new RegExp(regexStr);

content = content.replace(regex, newRenderLogic);

// Change the sidebar onClick to scroll to the chapter
content = content.replace(/onClick=\{\(\) => setActiveChapter\(chapter\.id\)\}/g, `onClick={() => {
                      setActiveChapter(chapter.id);
                      document.getElementById('chapter-' + chapter.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}`);


fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
