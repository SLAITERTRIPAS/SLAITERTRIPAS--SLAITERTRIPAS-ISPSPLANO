const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// We have extra closing divs and a motion.div that doesn't belong there anymore.
// The file ends at line 745 basically.

const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-slate-50 to-transparent pointer-events-none" \/>\s*<\/motion.div>\s*<\/main>\s*<\/div>\s*<\/div>\s*\)\;\s*\}\;/;
// wait let's just replace from `<div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">` to the end of the file.

const tail = `                  <div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2px] flex items-center justify-center mb-6">
                      <Clock className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="font-black text-slate-900 mb-2 text-[13px]">{chapters.find(c => c.id === activeChapter)?.title}</h2>
                    <p className="text-slate-400 max-w-sm text-[12px]">Informação detalhada em fase de consolidação para este capítulo técnico.</p>
                  </div>
              </div>
            </div>
          </main>
        </div>
    </div>
  );
};
export default ManualInstrucoesView;
`;

const index = content.indexOf('<div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">');
if(index !== -1) {
    content = content.substring(0, index) + tail;
    fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
} else {
    console.log("Could not find the hook");
}

