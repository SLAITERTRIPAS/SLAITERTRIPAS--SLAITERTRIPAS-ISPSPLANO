const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The grep failed previously because there were no residual text sizes in the headings/paragraphs,
// but let's make sure the PDF print formatting also reflects the specific sizes the user wants.

content = content.replace(/text-\[12px\]/g, 'text-[12px]'); 
// Wait, they are already 12px. Let's just confirm the file compiles properly (which it did).

