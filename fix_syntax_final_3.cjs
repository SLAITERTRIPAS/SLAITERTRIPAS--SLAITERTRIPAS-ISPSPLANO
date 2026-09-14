const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The end of `Contra-Capa` is:
// `      </div>
//     ),`
// BUT wait, it was originally wrapped in `<>`. So the `</>` should be there, but I replaced `)\}\n      <\/div>\n    \),` with `</div></div></>),` which REMOVED the `</>`.
// So now Contra-Capa DOES NOT have a `</>` at the end.
// BUT Contra-Capa starts with a `<div>` right after my `newC1` replacement!
// `newC1` replaced `) : (` which means the `<>` at the start of Contra-Capa WAS ALSO REMOVED!
// Because the true branch ended with `</>` and the false branch started with `<>`.
// `      </>
//     ) : (
//       <>`
// Which means my replacement `) : (` actually replaced `) : (` but left the `</>` of Capa and `<>` of Contra-Capa.
// Let's replace the whole thing properly.

// Look at line 60:
// `          <div className="w-full h-full p-8 text-left">`
// Does it have a `<>` before it?
// In line 59: `          </></div></div><div id="chapter-1-contra"...`
// In my previous script, I replaced `</></div></div><div id="chapter-1-contra"` with `</div></div></div><div id="chapter-1-contra"`.
// Wait, so I replaced the `</>` of the Capa with `</div>` (to close `relative z-10`).
// But the Capa STILL STARTED WITH `<>`!
// Let's find where Capa starts.
// `        {activeTab === "capa" ? (`
// Was replaced by me with: `1: (<>\n<div id="chapter-1"...`
// So `chapterContent[1]` starts with `<>`.
// Then the Capa content starts with `<>`.
// So we have `<> <>`.
// Let's just fix it completely using regex.

