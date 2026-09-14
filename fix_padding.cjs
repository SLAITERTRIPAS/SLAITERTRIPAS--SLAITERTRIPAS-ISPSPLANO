const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Remove nested borders and padding from chapters to let them fit the A4 page naturally
content = content.replace(/className="p-12 space-y-8 h-full bg-white rounded-xl border border-slate-200"/g, 'className="space-y-8 h-full"');
content = content.replace(/className="relative z-10 border-\[3px\] border-slate-900 rounded-\[20px\] h-full p-12 flex flex-col items-center bg-white shadow-\[0_0_50px_rgba\(0,0,0,0\.05\)\]"/g, 'className="relative z-10 border-[2px] border-slate-900 h-full p-8 flex flex-col items-center bg-white"');

// Make sure motion.div is styled perfectly as an A4 page
content = content.replace(/className="bg-white border border-slate-200 p-12 w-full max-w-\[794px\] min-h-\[1123px\] mx-auto shadow-\[0_30px_100px_-20px_rgba\(0,0,0,0\.1\)\] relative overflow-hidden flex flex-col"/g, 'className="bg-white border border-slate-200 p-12 w-full max-w-[794px] min-h-[1123px] mx-auto shadow-xl relative flex flex-col mb-10"');

// Fix the fallback content chapter style
content = content.replace(/className="p-12 space-y-8 h-full bg-white rounded-\[2px\] border border-slate-200 flex flex-col items-center justify-center text-center"/g, 'className="space-y-8 h-full flex flex-col items-center justify-center text-center"');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
