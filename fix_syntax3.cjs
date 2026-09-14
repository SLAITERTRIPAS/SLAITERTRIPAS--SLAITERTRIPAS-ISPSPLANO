const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Notice line 737: `</div>` has extra spaces maybe? Wait, the compiler says "Unterminated regular expression" at `</div>`.
// Ah! There is NO JS `return` error. Wait, looking at lines 737-738:
// `              </div>`
// `            </div>`
// Wait, `{chapters.find(c => c.id === activeChapter)?.title}` is evaluated.

// Let's replace the tail properly. The issue is likely that the compiler thinks `</div>` is a regex because there's a missing `{` or `}` somewhere.
// Let's trace it back. The fallback chapter starts with:
// `{activeChapter !== 1 && (` but it was deleted?
// Let's check line 720.

const idx = content.indexOf('<motion.div');
if (idx > -1) {
    console.log(content.substring(idx, idx + 1000));
}
