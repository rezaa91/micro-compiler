/**
 * used to store and access identifiers and their attributes; value, name, id, etc.
 * 
 *  [
 *    {
 *      id: 0,
 *      name: "varName",
 *      value: 12
 *    },
 *    {},
 *    ...
 *  ]
 */
const symbolTable = [];
let id = 0;

function setSymbol(name) {
  const exists = symbolTable.find((symbol) => symbol.name === name);

  /**
   * if the identifier already exists, return the id of the existing identifier
   */
  if (exists) {
    return exists.id;
  }

  return symbolTable.push({
    id: ++id,
    name,
    value: null
  });
}

function setSymbolValue(id, value) {
  const found = symbolTable.find((symbol) => symbol.id === id);

  if (!found) {
    return null;
  }

  found.value = value;
}

function getSymbol(id) {
  return symbolTable[id];
}

function existsInSymbolTable(id) {
  return Boolean(symbolTable[id]);
}

function getSymbolTable() {
  return symbolTable;
}

module.exports = {
  setSymbol,
  setSymbolValue,
  getSymbol,
  existsInSymbolTable,
  getSymbolTable
}
