const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Replace any remaining 10px and 11px depending on context
content = content.replace(/text-\[10px\]|text-\[11px\]/g, (match) => {
    return 'text-[12px]';
});

// Remove trailing spaces inside className
content = content.replace(/className="([^"]*)\s+"/g, 'className="$1"');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
