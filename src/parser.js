const {syntaxKind} = require('./types');

/**
 * e.g.
 *      {
 *        varA: 10,
 *        varB: 97
 *      }
 */
const symbolTable = {};

let pointer = -1;
const lexemes = [];

function match(expected, received) {
  if (expected !== received) {
    throw new Error(`Expected ${expected}. Received ${received}`);
  }
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
  for (token = getNextToken(); token.value === '+' || token.value === '-'; token = getNextToken()) {
    primary(getNextToken().type);
  }

  pointer--; // decrement pointer to compensate for incrementing on last iteration of for loop
}

function storeInSymbolTable(prop, value) {
  symbolTable[prop] = value;
}

function existsInSymbolTable(prop) {
  /**
   * Check if the variable exists in the symbol table
   */
  return Boolean(symbolTable[prop]);
}

function statement(type) {
  const currentToken = getCurrentToken();

  switch (type) {
    case syntaxKind.identifier:
      match(type, currentToken.type);

      if (!existsInSymbolTable(currentToken.value)) {
        match(':=', getNextToken().value);
        storeInSymbolTable(currentToken.value, peek().value); // peek the value to store, e.g. A := 10
      }

      expression();
      match(';', getNextToken().value);
      break;
    default:
      throw new Error(`unrecognised token: "${currentToken}"`);
  }
}

function statementList() {
  while(true) {
    const token = getNextToken();

    switch (token.type) {
      case syntaxKind.identifier:
        statement(token.type);
        break;
      default: // return once we have finished parsing all statements
        pointer--; // decrement as no match
        return;
    }
  }
}

function program() {
  /**
   * match: begin <statementList> end
   */
  match('begin', getNextToken().value);
  statementList();
  match('end', getNextToken().value);
}

function systemGoal() {
  /**
   * match: <program> SCANEOF
   */
  program();
  match('SCANEOF', getNextToken().value); // assert program ends with SCANEOF
}

function parser(tokens) {
  /**
   * store our scanned tokens in the lexemes array initialised at the
   * top of this file; in order to easily iterate through them from
   * anywhere in this module
   */
  lexemes.push(...tokens);

  systemGoal();
}

module.exports = {
  parser
}
