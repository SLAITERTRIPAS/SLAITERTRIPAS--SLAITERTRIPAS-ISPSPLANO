const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The issue is that the opening `<motion.div>` was deleted or not closed?
// Line 720 has `<motion.div key={activeChapter + activeTab}...`
// Line 729 has `{chapterContent[activeChapter] || (`
// But we deleted the closing of `}` and `</motion.div>`!
// Let's restore the end of the file properly!

const newTail = `
                {chapterContent[activeChapter] || (
                  <div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2px] flex items-center justify-center mb-6">
                      <Clock className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="font-black text-slate-900 mb-2 text-[13px]">{chapters.find(c => c.id === activeChapter)?.title}</h2>
                    <p className="text-slate-400 max-w-sm text-[12px]">Informação detalhada em fase de consolidação para este capítulo técnico.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </main>
        </div>
    </div>
  );
};
export default ManualInstrucoesView;
`;

const index = content.indexOf('{chapterContent[activeChapter] || (');
if(index !== -1) {
    content = content.substring(0, index) + newTail;
    fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
} else {
    console.log("Could not find the hook");
}

