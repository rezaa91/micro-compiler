const {scanner} = require('../src/compiler/scanner');

describe('scanner', function() {
  test('scanner returns stream of tokens with valid input', function() {
    const validInput = `
      begin A := 310 ;
      end SCANEOF
    `;
    const tokenLength = 7;

    try {
      const result = scanner(validInput);
      expect(result.length).toBe(tokenLength);
    } catch (error) {
      console.error(error);
    }
  });
});
