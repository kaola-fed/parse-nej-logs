var compose = require('./compose');

function symbolToReg (symbol) {
    return compose(createRegExp, replacePlaceholder, escapeRegExp)(symbol);
}

function escapeRegExp(symbol) {
  return symbol.replace(/[[\]]/g, '\\$&');
}

function createRegExp(symbol) {
    return new RegExp(symbol + '$', 'ig')
}

function replacePlaceholder(symbol) {
    return symbol
        .replace(
            /\%s/g, '(.*)'
        )
        .replace(
            /\%j/g, '(.*)'
        );
}

module.exports = symbolToReg;