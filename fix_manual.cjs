const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Replace standard paragraph text classes
content = content.replace(/className="text-slate-600 leading-relaxed text-lg"/g, 'className="text-slate-600 leading-relaxed text-[12px] text-justify"');
content = content.replace(/className="text-lg leading-relaxed"/g, 'className="text-[12px] text-justify leading-relaxed text-slate-600"');
content = content.replace(/className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6"/g, 'className="text-[12px] text-justify text-slate-600 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6"');
content = content.replace(/className="text-slate-600 text-sm leading-relaxed"/g, 'className="text-[12px] text-justify text-slate-600 leading-relaxed"');
content = content.replace(/className="space-y-2 text-xs text-slate-600 relative z-10"/g, 'className="space-y-2 text-[12px] text-justify text-slate-600 relative z-10"');
content = content.replace(/className="text-sm text-indigo-800\/70 leading-relaxed"/g, 'className="text-[12px] text-justify text-indigo-800/70 leading-relaxed"');

// Fix raw <p> tags in chapters
content = content.replace(/<p>\s*O SIGEPI foi/g, '<p className="text-[12px] text-justify text-slate-600 leading-relaxed">\n            O SIGEPI foi');
content = content.replace(/<p>As Instituições de Ensino/g, '<p className="text-[12px] text-justify text-slate-600 leading-relaxed">As Instituições de Ensino');

// Fix descriptions inside cards that need justification and 12px
content = content.replace(/className="text-xs text-slate-500 leading-relaxed"/g, 'className="text-[12px] text-justify text-slate-500 leading-relaxed"');
content = content.replace(/className="text-\[11px\] text-slate-500 leading-relaxed"/g, 'className="text-[12px] text-justify text-slate-500 leading-relaxed"');

// Write back
fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
console.log("Done");
