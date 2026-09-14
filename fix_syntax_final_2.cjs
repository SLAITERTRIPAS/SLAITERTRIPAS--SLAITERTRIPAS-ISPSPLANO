const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The issue is on line 59!
// `          </></div></div><div id="chapter-1-contra"...`
// It still has `</>` ! Because my previous script replaced `</>\s*</>` which wasn't accurate!

content = content.replace(/<\/><\/div><\/div><div id="chapter-1-contra"/g, '</div></div></div><div id="chapter-1-contra"');

// And what about the end of `chapter-1-contra`?
// It was:
// `        )}
//       </div>
//     ),`
// Which I replaced with:
// `      </div></div></>),`

// BUT the contra-capa had a `<>` wrapper? 
// No, the contra-capa was wrapped in `<> ... </>`.
// But I replaced `) : (` with the middle section, which means I left the `<>` of the contra-capa!
// Let's check `cat -n src/blocos/bloco8_gerais/ManualInstrucoesView.tsx | sed -n '125,135p'`

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
