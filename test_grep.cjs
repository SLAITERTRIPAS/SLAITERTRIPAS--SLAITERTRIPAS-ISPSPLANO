const fs = require('fs');
const content = fs.readFileSync('src/blocos/bloco5_sistema/SistemaView.tsx', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('ManualInstrucoesView'));
if (idx > -1) {
  console.log(lines.slice(idx, idx + 20).join('\n'));
}

const renderIdx = lines.findIndex(l => l.includes('<ManualInstrucoesView'));
if (renderIdx > -1) {
  console.log('----- Render area -----');
  console.log(lines.slice(renderIdx - 10, renderIdx + 20).join('\n'));
}
