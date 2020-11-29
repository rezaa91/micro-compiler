const keywords = {
  beginKeyword: 'begin',
  endKeyword: 'end',
  readKeyword: 'read',
  writeKeyword: 'write',
  scaneofKeyword: 'SCANEOF'
};

const characters = {
  lineBreak: '\n',
  tab: '\t',
  whitespace: ' ',
  plusOp: '+',
  minusOp: '-',
  semiColon: ';',
  colon: ':',
  backSlash: '/',
  equals: '='
}

const syntaxKind = {
  keyword: 0,
  plusOp: 1,
  minusOp: 2,
  whitespace: 3,
  initialiser: 4,
  semiColon: 5,
  intLiteral: 6,
  identifier: 7,
}

module.exports = {
  keywords,
  characters,
  syntaxKind
}
