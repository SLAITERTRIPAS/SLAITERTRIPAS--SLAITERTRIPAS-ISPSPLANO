const fs = require('fs');
const content = fs.readFileSync('src/blocos/bloco5_sistema/SistemaView.tsx', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('case "Projeto Teórico":'));
if (idx > -1) {
  // search upwards for the return statement of the main function or the container
  for(let i = idx; i >= 0; i--) {
     if (lines[i].includes('return (')) {
        console.log(lines.slice(i, i + 10).join('\n'));
     }
  }
}
