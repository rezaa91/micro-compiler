const {scanner} = require('../src/compiler/scanner');

describe('scanner', function() {
  test('returns stream of tokens with valid input', function() {
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

  test('no error thrown if identifier value followed by a space', function() {
    const validInput = `A := 310 B := 200`;
    const tokenLength = 6;

    const result = scanner(validInput);
    expect(result.length).toBe(tokenLength);
  });

  test('no error thrown if identifier value followed by line break', function() {
    const validInput = `A := 310
      B := 200`;
    const tokenLength = 6;

    const result = scanner(validInput);
    expect(result.length).toBe(tokenLength);
  })

  test('throws error if invalid token found', function() {
    const invalidInput = `@`;

    expect(() => scanner(invalidInput)).toThrow(`Unexpected token: "@"`);
  });

  test('throws error if no space following identifier value', function() {
    const invalidInput = `A := 310B`;

    expect(() => scanner(invalidInput)).toThrow(`Unrecognised character B`);
  });
});
