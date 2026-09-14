const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Ensure that active state still looks good if it doesn't have rounded-lg. Actually, adding a small gap and 1px separator is fine.
// But another way to interpret "separacao de 1px" is simply putting a 1px gap between buttons with a different background.
// Let's make sure divide-y is actually showing. 
