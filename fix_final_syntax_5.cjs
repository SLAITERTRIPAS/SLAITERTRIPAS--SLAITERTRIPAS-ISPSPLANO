const fs = require('fs');
let content = fs.readFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', 'utf8');

// The output from the background task:
// `740	              ))}   `
// `741	                                </main>   `
// Wait, the `))} ` is closing the `chapters.map`. 
// BUT in `newRenderLogic`, I had `</div>` at the end!
// Oh!
// `              ))}   `
// `            </div>`
// `                                </main> `
// In the background task output, there is NO `</div>` after `}))}`!
// My `newRenderLogic` was:
// `              ))}
//             </div>`

// Wait, the regex replaced it, but maybe I missed it or something ate it?
// Let's just fix the end of the file.

const badEOF = `                </div>
              ))}
                                </main>
        </div>
      </div>
    </div>
  );
};
export default ManualInstrucoesView;`;

const goodEOF = `                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default ManualInstrucoesView;`;

content = content.replace(badEOF, goodEOF);
fs.writeFileSync('src/blocos/bloco8_gerais/ManualInstrucoesView.tsx', content);

