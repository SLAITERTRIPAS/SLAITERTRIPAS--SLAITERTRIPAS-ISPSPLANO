const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The user asked for a 1px separation. A border bottom or divide-y is typically what this means.
content = content.replace(/className="p-4 space-y-\[1px\] max-h-\[70vh\] overflow-y-auto scrollbar-hide"/g, 'className="p-4 flex flex-col gap-[1px] bg-slate-100 max-h-[70vh] overflow-y-auto scrollbar-hide"');
content = content.replace(/activeChapter === chapter.id \n                       \? "bg-\[#0B1222\]/g, 'activeChapter === chapter.id \n                       ? "bg-[#0B1222]');
content = content.replace(/: "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"/g, ': "text-slate-600 hover:bg-slate-50 bg-white"');

// Actually let's just use divide-y for a clean 1px separator line
content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');
content = content.replace(/className="p-4 space-y-\[1px\] max-h-\[70vh\] overflow-y-auto scrollbar-hide"/g, 'className="p-2 flex flex-col divide-y divide-slate-100 max-h-[70vh] overflow-y-auto scrollbar-hide"');

content = content.replace(/className=\{\`w-full flex items-center justify-between px-5 py-4 rounded-lg transition-all group \$\{/g, 'className={`w-full flex items-center justify-between px-5 py-4 transition-all group ${');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
