function generator(ast) {
  return ast.body.reduce((acc, item) => {
    switch (item.type) {
      case 'IDENTIFIER':
        acc += `var ${item.identifier} = ${item.value};\n`;
        break;
    }

    return acc;
  }, '');
}

module.exports = {
  generator
}
