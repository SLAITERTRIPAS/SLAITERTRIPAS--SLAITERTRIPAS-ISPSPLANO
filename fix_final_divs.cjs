const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Looking at the tail:
// `   742	            </div>
//     743	
//     744	          </main>
//     745	        </div>
//     746	    </div>
//     747	  );`
// The main wrapper is:
// `<div className="min-h-screen bg-[#F8FAFC]">` -> 1
// `<div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">` -> 2
// `<header>` -> inside 2
// `<div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] print:block print:w-full gap-10 print:gap-0">` -> 3
// `<div className="space-y-6 print:hidden">` -> 4 (Sidebar) -> Closed on line 687!
// `<main className="space-y-8 print:space-y-0 print:w-full print:block flex flex-col items-center max-w-full relative z-10">` -> inside 3

// So the structure is:
// return (
//   <div> // 1
//     <div> // 2
//       <header />
//       <div> // 3
//         <div /> // 4
//         <main>
//           ... 
//         </main>
//       </div> // close 3
//     </div> // close 2
//   </div> // close 1
// );

// Currently EOF has:
// `          </main>
//         </div>
//     </div>
//   );`
// WAIT, this means we are missing ONE `</div>` at the end!
// Let's add it!

content = content.replace(/<\/main>\s*<\/div>\s*<\/div>\s*\)\;\s*\}\;/g,
  `          </main>
        </div>
      </div>
    </div>
  );
};`
);

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);

