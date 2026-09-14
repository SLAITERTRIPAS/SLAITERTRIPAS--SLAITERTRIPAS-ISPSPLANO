const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Also update any remaining text-xs paragraphs to text-[12px] text-justify
content = content.replace(/className="text-xs"/g, 'className="text-[12px] text-justify leading-relaxed"');
content = content.replace(/className="text-xs text-rose-800\/70"/g, 'className="text-[12px] text-justify text-rose-800/70"');
content = content.replace(/className="text-xs text-emerald-800\/70"/g, 'className="text-[12px] text-justify text-emerald-800/70"');

// And text-sm to text-[12px] if it's a paragraph
content = content.replace(/className="text-sm text-slate-600 font-medium leading-relaxed"/g, 'className="text-[12px] text-justify text-slate-600 font-medium leading-relaxed"');
content = content.replace(/className="text-sm text-slate-500 mb-6 italic"/g, 'className="text-[12px] text-justify text-slate-500 mb-6 italic"');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
