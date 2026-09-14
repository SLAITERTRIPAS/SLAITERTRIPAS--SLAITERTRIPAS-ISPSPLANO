const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

const regex = /const generatePDF = \(\) => \{[\s\S]*?\};\n\n  return \(/;
const replacement = `const generatePDF = () => {
    window.print();
  };

  return (`

content = content.replace(regex, replacement);
fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
