const keywords = ['begin', 'end', 'SCANEOF'];

const syntaxKind = {
  keyword: 0,
  plusOp: 1,
  minusOp: 2,
  whitespace: 3,
  initialiser: 4,
  semiColon: 5,
  intLiteral: 6,
  identifier: 7,
  comment: 8
}

module.exports = {
  keywords,
  syntaxKind
}
