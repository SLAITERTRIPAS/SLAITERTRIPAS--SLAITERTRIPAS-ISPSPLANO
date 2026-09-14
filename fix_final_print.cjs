const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The file was not fully reverted because it's not a git repo, but wait, the activeChapter references ARE GONE?
// Ah, `grep` showed only three results in the sidebar! 
// This means my previous script that replaced `{activeChapter === 1 && (` with `<div id="chapter-1"...` ACTUALLY RAN and the file STILL HAS IT!
// But the syntax error was on line 738 with an unterminated regular expression. Let's fix that specific syntax error.

