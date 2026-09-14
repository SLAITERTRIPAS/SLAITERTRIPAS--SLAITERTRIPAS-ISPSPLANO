const fs = require('fs');
const content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('const generatePDF = () => {'));
if (idx > -1) {
  console.log(lines.slice(idx, idx + 40).join('\n'));
}
