const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Looking at `cat -n src/blocos/bloco8_gerais/ManualInstrucoesView.tsx | tail -n 25`:
// 735	                        <h2 className="font-black text-slate-900 mb-2 text-[13px]">{chapter.title}</h2>
// 736	                        <p className="text-slate-400 max-w-sm text-[12px]">Informação detalhada em fase de consolidação para este capítulo técnico.</p>
// 737	                      </div>
// 738	                    )}
// 739	                  </div>
// 740	                </div>
// 741	              ))}
// 742	            </div>
// 743	
// 744	          </main>
// 745	        </div>
// 746	      </div>
// 747	    </div>
// 748	  );
// 749	};

// The wrapper for the stacked chapters on line 742 is:
// `            <div className="w-full flex flex-col space-y-12 print:space-y-0">`
// Wait, is it closed correctly? Yes, line 742.
// BUT <main> was:
// `<main className="...">`
// Maybe `<main>` is not closed correctly?
// Wait, earlier I did:
// `content = content.replace(regex, newRenderLogic);`
// Where regex matched `<motion.div ... </motion.div>`.
// BUT `<motion.div>` had a `<div className="absolute inset-0 bg-[radial-gradient...` INSIDE it!
// Oh, the closing `</div>` from `className="relative z-10 flex-1 w-full flex flex-col"` was OUTSIDE the `<motion.div>`!
// Let's count the divs in `newRenderLogic`:
// `<div className="w-full flex flex-col space-y-12 print:space-y-0">` (1 OPEN)
//   `{chapters.map((chapter) => (`
//     `<div id={"chapter-" + chapter.id} ...>` (2 OPEN)
//       `<div className="absolute inset-0 ... />` (SELF CLOSE)
//       `<div className="relative z-10 flex-1 ...">` (3 OPEN)
//         `{chapterContent[chapter.id] || (`
//           `<div className="space-y-8 ...">` (4 OPEN)
//             `<div ...>` (5 OPEN)
//             `</div>` (5 CLOSE)
//           `</div>` (4 CLOSE)
//         `)}`
//       `</div>` (3 CLOSE)
//     `</div>` (2 CLOSE)
//   `))}`
// `</div>` (1 CLOSE)

// Wait! If `newRenderLogic` is perfectly balanced, why does it say:
// `Unexpected closing "main" tag does not match opening "div" tag`?
// Because BEFORE `<motion.div>`, there was an opening `<div>` that we didn't close!
// Yes! Look at line 689:
// `            <div id="chapter-1" className="bg-white border border-slate-200 ...">`
// `              <div className="relative z-10 flex-1 w-full flex flex-col">`
// `              <div className="flex items-center gap-8 border-b border-slate-200 pb-px print:hidden">`

// AAH! When I ran `make_stacked_pages2.cjs`, it replaced `{activeChapter === 1 && (` with:
// `<div id="chapter-1"... >`
// `<div className="relative z-10...">`
// AND I NEVER REVERTED IT BECAUSE IT WAS NOT A GIT REPO!
// So we STILL HAVE an unclosed `<div id="chapter-1">` and `<div className="relative z-10...">` dangling before the tab buttons!

const badCodeStr = `            <div id="chapter-1" className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col shrink-0 mb-10 print:mb-0 print:block print:break-after-page" style={{ pageBreakAfter: 'always' }}>
              <div className="relative z-10 flex-1 w-full flex flex-col">`;

content = content.replace(badCodeStr, "");

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);

