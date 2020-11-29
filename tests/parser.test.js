const {parser} = require('../src/compiler/parser');

const validTokens = [
  { type: 0, value: 'begin' },
  { type: 7, value: 'A', symbolId: 1 },
  { type: 4, value: ':=' },
  { type: 6, value: '310' },
  { type: 5, value: ';' },
  { type: 7, value: 'B', symbolId: 2 },
  { type: 4, value: ':=' },
  { type: 7, value: 'A', symbolId: 1 },
  { type: 1, value: '+' },
  { type: 6, value: '10' },
  { type: 2, value: '-' },
  { type: 6, value: '100' },
  { type: 5, value: ';' },
  { type: 0, value: 'end' },
  { type: 0, value: 'SCANEOF' }
]

describe('parser', function() {
  test('parser throws error if does not start with begin token', function() {
    const [beginToken, ...restOfTokens] = validTokens;

    expect(() => parser(restOfTokens)).toThrow(`Expected begin. Received ${restOfTokens[0].value}`);
  });
});
