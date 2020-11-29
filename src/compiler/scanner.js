const {syntaxKind, characters, keywords} = require('./types');
const {setSymbol} = require('./symbol_table');

function isAlpha(char) {
  return /[a-z]/i.test(char);
}

function isNumber(char) {
  return /[0-9]/.test(char);
}

function matchEnding(received) {
  // possible endings to an int literal or identifier / keyword
  const possibleEnds = [' ', '\n', undefined];

  if (!possibleEnds.includes(received)) {
    throw new TypeError(`Unrecognised character ${received}`);
  }
}

function match(expected, received) {
  if (expected !== received) {
    throw new TypeError(`Expected ${expected}. Received ${received}`);
  }
}

function isKeyword(input) {
  return Object.values(keywords).find(keyword => keyword === input);
}

/**
 * scan the input source code and returns an array of tokens
 * 
 * example:
 *    [
 *      {type: syntaxKind.identifier, value: 'A'},
 *      {type: 'syntaxKind.initialiser', value: ':='},
 *      {type: syntaxKind.intLiteral, value: 100},
 *      ...
 *    ]
 */
function scanner(input) {
  // array of tokens which will be returned at the end of this function
  const tokens = [];

  /**
   * points to a specific char in the input.
   * This is incremented as we progress through the input
   * 
   * hello world        (pointer = 7)
   *        ^
   */
  let pointer = 0;
  let char = input[pointer];

  function getNextCharacter() {
    char = input[++pointer];

    return char;
  }

  function storeAlphaToken() {
    let value = '';

    while (/\w/.test(char)) {
      value += char;
      getNextCharacter();
    }

    matchEnding(char);

    /**
     * store the identifier in the symbol table and reference the id
     * in the token attributes
     */
    if (!isKeyword(value)) {
      const symbolId = setSymbol(value);
      tokens.push({type: syntaxKind.identifier, value, symbolId});

      return;
    }

    tokens.push({type: syntaxKind.keyword, value})
  }

  function storeNumericToken() {
    let value = '';

    while(/\d/.test(char)) {
      value += char;
      getNextCharacter();
    }

    matchEnding(char);

    tokens.push({type: syntaxKind.intLiteral, value});
  }

  function scan(char) {
    let next = null; // used by some case statements to get the next character in the input stream

    switch (char) {
      case characters.whitespace:
      case characters.lineBreak:
      case characters.tab:
        break; // do nothing - we don't care for whitespaces, new lines or tabs
      case characters.plusOp:
        tokens.push({type: syntaxKind.plusOp, value: char});
        break;
      case characters.minusOp:
        tokens.push({type: syntaxKind.minusOp, value: char});
        break;
      case characters.semiColon:
        tokens.push({type: syntaxKind.semiColon, value: char});
        break;
      case characters.colon: // first char of initialiser symbol (:=)
        next = getNextCharacter();
        match(characters.equals, next);

        next = getNextCharacter();
        match(characters.whitespace, next);

        tokens.push({type: syntaxKind.initialiser, value: ':='});
        break;
      case characters.backSlash: // start of a comment?
        next = getNextCharacter();
        match(characters.backSlash, next);

        while(getNextCharacter() !== characters.lineBreak);
        break;
      default:
        if (isAlpha(char)) {
          storeAlphaToken();
        } else if (isNumber(char)) {
          storeNumericToken();
        } else {
          throw new TypeError(`Unexpected token: "${char}"`);
        }
     }
  }

  while (pointer < input.length) {
    scan(char);
    getNextCharacter(); // increment to the next char ready for the next iteration
  }

  return tokens;
}

module.exports = {
  scanner
}
