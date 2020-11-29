const fs = require('fs');
const {scanner} = require('./src/compiler/scanner');
const {parser} = require('./src/compiler/parser');
const {generator} = require('./src/compiler/generator');

const {getSymbolTable} = require('./src/compiler/symbol_table');

(async() => {
  const filename = 'input.micro';
  const input = await fs.readFileSync(filename).toString();

  const tokens = scanner(input);
  console.dir(tokens, {depth: null});

  const ast = parser(tokens);
  console.dir(ast, {depth: null});

  /** DEBUG */
  console.log(getSymbolTable());

  const output = generator(ast);
  console.log(output);
})();
