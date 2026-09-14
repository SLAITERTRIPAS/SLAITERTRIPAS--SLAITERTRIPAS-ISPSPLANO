const fs = require('fs');
const content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('Capítulos do Documento'));
if (idx > -1) {
  console.log(lines.slice(idx, idx + 30).join('\n'));
}
