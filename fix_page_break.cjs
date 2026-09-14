const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The user wants each rendered section/chapter to be separated one by one. 
// Right now, when "Índice Geral do Documento" or multiple sections are printed or shown, they might be continuous.
// Wait, in the current implementation, we are using `activeChapter` to ONLY show ONE chapter at a time on screen.
// But when printing, do we want to print ALL chapters separated by pages?
// Let's check how the print layout is structured.

const lines = content.split('\n');
const printIdx = lines.findIndex(l => l.includes('const renderContent = () => {'));
if (printIdx > -1) {
    console.log(lines.slice(printIdx - 5, printIdx + 40).join('\n'));
}

