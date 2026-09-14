const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// replace h-full from the inner wrapper
content = content.replace(/className="relative z-10 h-full"/g, 'className="relative z-10 flex-1 w-full flex flex-col"');

// replace h-full from chapter wrappers
content = content.replace(/className="space-y-8 h-full"/g, 'className="space-y-8 flex-1"');

// also replace the specific one for fallback
content = content.replace(/className="space-y-8 h-full flex flex-col items-center justify-center text-center"/g, 'className="space-y-8 flex-1 flex flex-col items-center justify-center text-center"');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
