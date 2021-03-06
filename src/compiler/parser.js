const {syntaxKind, characters, keywords} = require('./types');
const {setSymbolValue, existsInSymbolTable} = require('./symbol_table');

let pointer = -1;
const lexemes = [];

function match(expected, received) {
  if (expected !== received) {
    throw new Error(`Expected ${expected}. Received ${received}`);
  }
}

function assert(expected, received) {
  return expected === received;
}

function getCurrentToken() {
  return lexemes[pointer];
}

function peek() {
  return lexemes[pointer + 1];
}

function getNextToken() {
  return lexemes[++pointer];
}

function primary(type) {
  switch (type) {
    case syntaxKind.intLiteral:
      break;
  }
}

function expression() {
  let token = getNextToken();

  primary(token.type);

  /**
   * If a '+' or '-' follows, keep checking the rest of the expression
   * e.g. A + 310 - 12 + 67 <---- we want to make sure the full expression is correct
   */
  for (
    token = getNextToken();
    token.value === characters.plusOp || token.value === characters.minusOp;
    token = getNextToken()
  ) {
    primary(getNextToken().type);
  }

  pointer--; // decrement pointer to compensate for incrementing on last iteration of for loop
}


function statement(type) {
  const node = {};
  const currentToken = getCurrentToken();

  switch (type) {
    case syntaxKind.identifier:
      match(type, currentToken.type);

      if (assert(':=', peek().value)) {
        match(':=', getNextToken().value);

        // TODO - bug here! We want to store the full expression value; e.g: A := B + 12 - 1;
        //                                                                        ^   ^^   ^
        setSymbolValue(currentToken.symbolId, peek().value); // peek the value to store, e.g. A := 10
        node.identifier = currentToken.value;
        node.value = peek().value;
      } else {
        node.value = getCurrentToken();
      }

      node.type = 'IDENTIFIER';

      // TODO - store expression in ast
      expression();
      match(characters.semiColon, getNextToken().value);
      break;
    default:
      throw new Error(`unrecognised token: "${currentToken}"`);
  }

  return node;
}

function statementList() {
  const node = [];

  while(pointer < lexemes.length) {
    const token = getNextToken();

    switch (token.type) {
      case syntaxKind.identifier:
        const statementNode = statement(token.type);
        node.push(statementNode);
        break;
      default: // return once we have finished parsing all statements
        pointer--; // decrement as no match

        return node;
    }
  }

  return node;
}

function program() {
  /**
   * match: begin <statementList> end
   */
  match(keywords.beginKeyword, getNextToken().value);
  const statementListNode = statementList();
  match(keywords.endKeyword, getNextToken().value);

  return [...statementListNode];
}

function systemGoal() {
  /**
   * match: <program> SCANEOF
   */
  const programNode = program();
  match(keywords.scaneofKeyword, getNextToken().value); // assert program ends with SCANEOF

  return programNode;
}

function parser(tokens) {
  /**
   * store our scanned tokens in the lexemes array initialised at the
   * top of this file; in order to easily iterate through them from
   * anywhere in this module
   */
  lexemes.push(...tokens);

  const node = {
    type: 'Program',
    body: []
  }

  const programBody = systemGoal();
  node.body.push(...programBody);

  /**
   *  {
   *    type: 'Program',
   *    body: [
   *      {
   *        type: 'IDENTIFIER',
   *        identifier: 'varName',
   *        value: 'value'
   *      },
   *      {},
   *      ...
   *    ]
   *  }
   */
  return node;
}

module.exports = {
  parser
}
