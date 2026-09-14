const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The issue is on line 719: `)}` is left dangling from a removed {activeChapter === 1 && ( condition.
// Let's remove the stray `)}` near line 719.

content = content.replace(/\{activeTab === "contracapa" && \(\s*<motion\.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0\.5 bg-orange-500" \/>\s*\)\}\s*<\/button>\s*<\/div>\s*\)\}/, 
`{activeTab === "contracapa" && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                  )}
                </button>
              </div>`);

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
