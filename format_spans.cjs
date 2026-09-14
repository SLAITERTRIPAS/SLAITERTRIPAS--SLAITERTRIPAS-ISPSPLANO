const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Replace any remaining text sizing classes that shouldn't be there.
content = content.replace(/text-xs|text-sm|text-2xl|text-3xl|text-xl/g, 'text-[12px]');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
