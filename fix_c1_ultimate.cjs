const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The issue is that I used string replacements that replaced `)}` which belonged to a completely different part of the file (like the end of `chapterContent` object, or the end of the React component!)
// Wait, `const generatePDF = () => {` error means my regex `/\)\}\n      <\/div>\n    \),/g` might have messed up the whole object definition!
// Let's just fix `chapterContent[1]` purely by writing it from scratch and replacing the broken section.

// We need to replace from `1: (<>` to `2: (`
// Wait, `1: (<>` doesn't exist?

// Let's get the whole file content, find the start of `const chapterContent: Record<number, React.ReactNode> = {`
// And the start of `2: (`
// Then replace everything between with the correct Chapter 1 structure.

const startIdx = content.indexOf('const chapterContent: Record<number, React.ReactNode> = {');
const endIdx = content.indexOf('2: (');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `const chapterContent: Record<number, React.ReactNode> = {
    1: (
      <>
        <div id="chapter-1" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />
          <div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col items-center bg-white">
            <div className="w-16 h-0.5 bg-slate-900 mb-10" />
            <div className="text-center space-y-8 flex-1">
              <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 font-black uppercase tracking-widest text-[13px]">
                Memória descritiva
              </div>
              <div className="space-y-4">
                <h1 className=" font-black text-slate-900 leading-[1.1] max-w-2xl mx-auto text-[13px]">
                  SIGIP
                </h1>
                <p className="text-slate-500 italic font-medium max-w-xl mx-auto leading-relaxed text-[12px]">
                  "Sistema Integrada de Gestão de Processos"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="chapter-1-contra" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-inside-avoid print:break-after-page page-break-after:always">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none" />
          <div className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col bg-white">
            <div className="w-full h-full p-8 text-left">
              <h2 className="font-black text-slate-900 mb-8 border-b pb-4 text-[13px]">Contra-Capa (Ficha Técnica)</h2>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <p className="font-black text-slate-400 uppercase tracking-widest mb-2 text-[13px]">DONO DO PROJETO</p>
                    <p className="font-bold text-slate-800 text-[12px]">Direção Nacional de Ensino Superior (DNES)</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-400 uppercase tracking-widest mb-2 text-[13px]">RESPONSÁVEL TÉCNICO</p>
                    <p className="font-bold text-slate-800 text-[12px]">Fransissi Tripalonga Vicente</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-400 uppercase tracking-widest mb-2 text-[13px]">DATA DE ELABORAÇÃO</p>
                    <p className="font-bold text-slate-800 text-[12px]">Janeiro de 2026</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-400 uppercase tracking-widest mb-2 text-[13px]">VERSÃO</p>
                    <p className="font-bold text-slate-800 text-[12px]">1.0.0 (Release Candidate)</p>
                  </div>
                </div>
                <div className="space-y-6 border-l pl-12 border-slate-100">
                  <p className="font-black text-slate-400 uppercase tracking-widest mb-2 text-[13px]">STATUS REGULATÓRIO</p>
                  <div className="flex items-center gap-2 text-[9px] text-emerald-600 font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Homologado & Confluente
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full mt-20 pt-12 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-8 text-left">
                <div>
                  <p className="text-[12px] font-bold text-slate-400">Classificação</p>
                  <p className="text-[12px] font-bold text-slate-900 mt-1">Uso Interno</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400">Distribuição</p>
                  <p className="text-[12px] font-bold text-slate-900 mt-1">Autorizada</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400">Documento ID</p>
                  <p className="text-[12px] font-bold text-slate-900 mt-1">SIGIP-MD-2026-001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
    `;
  
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx + 4);
  fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
}
