const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Now we need to modify `chapterContent[1]` itself.
// Currently it is:
/*
  const chapterContent: Record<number, React.ReactNode> = {
    1: (
      <div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col items-center bg-white">
        {activeTab === "capa" ? (
          <>
            ...
          </>
        ) : (
          <>
            ...
          </>
        )}
      </div>
    ),
*/

// We need to change it to:
/*
  const chapterContent: Record<number, React.ReactNode> = {
    1: (
      <>
        <div id="chapter-1" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />
          <div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col items-center bg-white">
            ... Capa ...
          </div>
        </div>
        <div id="chapter-1-contra" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />
          <div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col bg-white">
            ... Contra-Capa ...
          </div>
        </div>
      </>
    ),
*/

// Let's replace the whole chapterContent[1] string manually.
const oldC1 = `{activeTab === "capa" ? (`;
const newC1 = `</></div></div><div id="chapter-1-contra" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always"><div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" /><div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col bg-white">`;

content = content.replace(oldC1, "");
content = content.replace(/ \) \: \(/g, newC1);

// We need to wrap it inside a Fragment!
content = content.replace(/1: \(/g, `1: (<>\n<div id="chapter-1" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always"><div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />`);

content = content.replace(/        \)\}\n      <\/div>\n    \),/g, `</div></div></>),`);


fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);

