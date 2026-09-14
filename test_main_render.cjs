const fs = require('fs');
const content = fs.readFileSync('src/blocos/bloco5_sistema/SistemaView.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(2085, 2150).join('\n'));
