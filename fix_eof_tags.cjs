const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Looking at what I injected:
// `            <div className="w-full flex flex-col space-y-12 print:space-y-0"> ... </div>`
// This replaced the `<motion.div>` entirely.
// But earlier, the file ended with:
// `            </motion.div>
//           </main>
//         </div>
//     </div>
//   );
// };
// export default ManualInstrucoesView;`

// Wait, the regex replaced from `<motion.div` to `</motion.div>`.
// So the file now ends with:
// `</div> // from my replacement
//           </main>
//         </div>
//     </div>
//   );
// };
// export default ManualInstrucoesView;`

// But the compiler says `<main>` doesn't match `<div>`!
// This implies we are missing a `</div>` BEFORE `</main>` or we have an extra one.
// Let's replace the EOF completely to be safe.

const replacement = `
            </div>
          </main>
        </div>
    </div>
  );
};
export default ManualInstrucoesView;
`;

const badIdx = content.lastIndexOf('</main>');
if (badIdx !== -1) {
    let before = content.substring(0, badIdx);
    // Find how many open vs close divs exist in the entire return block.
    // Actually, let's just balance it.
}

// A simpler way is to use regex to just clean up the end:
content = content.replace(/<\/div>\s*<\/main>\s*<\/div>\s*<\/div>\s*\)\;\s*\}\;\s*export default ManualInstrucoesView\;/g,
  `          </main>
        </div>
    </div>
  );
};
export default ManualInstrucoesView;`
);

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);

