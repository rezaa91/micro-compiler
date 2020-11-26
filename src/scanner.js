const {syntaxKind, keywords} = require('./types');

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

    tokens.push({type: syntaxKind.identifier, value});
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
      case ' ':
      case '\n':
      case '\t':
        break; // do nothing - we don't care for whitespaces, new lines or tabs
      case '+':
        tokens.push({type: syntaxKind.plusOp, value: char});
        break;
      case '-':
        tokens.push({type: syntaxKind.minusOp, value: char});
        break;
      case ';':
        tokens.push({type: syntaxKind.semiColon, value: char});
        break;
      case ':': // first char of initialiser symbol (:=)
        next = getNextCharacter();
        match('=', next);

        next = getNextCharacter();
        match(' ', next);

        tokens.push({type: syntaxKind.initialiser, value: ':='});
        break;
      case '/': // start of a comment?
        next = getNextCharacter();
        match('/', next);

        while(getNextCharacter() !== '\n');
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

  /**
   * if any identifiers that are picked up are keywords specific to micro,
   * change the type to reflect this in order for parsing to be accurate
   */
  return tokens.map((token) => {
    if (token.type !== syntaxKind.identifier) {
      return token;
    }

    const isKeyword = keywords.includes(token.value);
    token.type = isKeyword ? syntaxKind.keyword : syntaxKind.identifier;

    return token;
  });
}

module.exports = {
  scanner
}
