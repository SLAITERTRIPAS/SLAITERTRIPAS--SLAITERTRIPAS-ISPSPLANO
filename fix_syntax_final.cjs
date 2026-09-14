const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// I see exactly what happened!
/*
        {activeTab === "capa" ? (
          <>
            ...
          </>
        ) : (
          <>
            ...
          </>
        )}
*/
// My script replaced `) : (` with the `</></div></div><div ...><div ...><div ...>`
// BUT there was ALREADY a `</>` inside the true branch!
// So it became `</>  </></div></div>`!

// Let's replace:
// `</>         </></div></div><div id="chapter-1-contra" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always"><div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" /><div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col bg-white">`
// With just one `</></div></div>` etc. 
// AND we need to remove the extra `<>` that was part of the true branch!
// Actually, it's easier to just find that exact line!

const badLineRegex = /<\/></g; // wait, no.

// Let's just fix the `</>         </></div></div>`
content = content.replace(/<\/>\s*<\/><\/div><\/div>/g, '</></div></div>');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
