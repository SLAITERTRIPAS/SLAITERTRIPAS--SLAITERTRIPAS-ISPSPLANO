const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// Add print classes to hide non-document elements
content = content.replace(/className="mb-8"/g, 'className="mb-8 print:hidden"');
content = content.replace(/<header className="bg-\[#022c22\]/g, '<header className="bg-[#022c22] print:hidden');
content = content.replace(/<aside className="space-y-8">/g, '<aside className="space-y-8 print:hidden">');
content = content.replace(/<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">/g, '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">');
content = content.replace(/<div className="flex items-center gap-8 border-b border-slate-200 pb-px">/g, '<div className="flex items-center gap-8 border-b border-slate-200 pb-px print:hidden">');

// Make the main wrapper print properly
content = content.replace(/className="min-h-screen bg-\[#F4F7F9\] font-sans selection:bg-blue-100 pb-20"/g, 'className="min-h-screen bg-[#F4F7F9] print:bg-white font-sans selection:bg-blue-100 pb-20 print:pb-0"');
content = content.replace(/className="w-\[90%\] mx-auto p-4 md:p-10"/g, 'className="w-[90%] print:w-full mx-auto p-4 md:p-10 print:p-0"');
content = content.replace(/className="grid grid-cols-1 lg:grid-cols-\[340px_1fr\] gap-10"/g, 'className="grid grid-cols-1 lg:grid-cols-[340px_1fr] print:block print:w-full gap-10 print:gap-0"');
content = content.replace(/<main className="space-y-8">/g, '<main className="space-y-8 print:space-y-0 print:w-full print:block">');

// Make the A4 page print properly
content = content.replace(/className="bg-white border border-slate-200 p-12 w-full max-w-\[794px\] min-h-\[1123px\] mx-auto shadow-xl relative flex flex-col mb-10"/g, 'className="bg-white border border-slate-200 print:border-none p-12 print:p-0 w-full max-w-[794px] print:max-w-none min-h-[1123px] print:min-h-0 mx-auto shadow-xl print:shadow-none relative flex flex-col mb-10 print:mb-0 print:block"');

fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);
