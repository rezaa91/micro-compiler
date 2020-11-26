const fs = require('fs');
const {scanner} = require('./src/scanner');
const {parser} = require('./src/parser');
const {generator} = require('./src/generator');

(async() => {
  const filename = 'input.micro';
  const input = await fs.readFileSync(filename).toString();

  const tokens = scanner(input);
  console.dir(tokens, {depth: null});
})();
