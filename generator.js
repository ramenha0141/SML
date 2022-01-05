module.exports = function Generator(ast) {
    const { first, _first, follow } = require('./lib.js')(ast);
    function symbol_wrap (symbol_or_string) {
        if (typeof symbol_or_string === 'symbol') {
            return `Symbol(${Symbol.keyFor(symbol_or_string)})`;
        }
        return symbol_or_string;
    }
    const parsing_table = {};
    const ast_keys = Object.keys(ast);
    for (let i = 0; i < ast_keys.length; i++) {
        const A = ast[ast_keys[i]];
        parsing_table[ast_keys[i]] = {};
        for (let j = 0; j < A.length; j++) {
            const s = A[j];
            if (s === 'ε') continue;
            const firsts = _first(s);
            if (firsts.includes(Symbol.for('ε'))) firsts.splice(firsts.indexOf(Symbol.for('ε')), 1);
            for (let k = 0; k < firsts.length; k++) {
                if (parsing_table[ast_keys[i]][firsts[k]] === undefined) {
                    parsing_table[ast_keys[i]][firsts[k]] = s;
                } else {
                    throw `Generation Error: This rule cannot parse by LL(1).\nRule '${ast_keys[i]}', Lookahead'${symbol_wrap(firsts[k])}', Conflict between ${JSON.stringify(parsing_table[ast_keys[i]][firsts[k]])} and ${JSON.stringify(s)}.`;
                }
            }
        }
        if (first(ast_keys[i]).includes(Symbol.for('ε'))) {
            const follows = follow(ast_keys[i]);
            for (let j = 0; j < follows.length; j++) {
                if (parsing_table[ast_keys[i]][follows[j]] === undefined) {
                    parsing_table[ast_keys[i]][follows[j]] = [];
                } else {
                    throw `Generation Error: This rule cannot parse by LL(1).\nRule '${ast_keys[i]}', Lookahead'${symbol_wrap(follows[j])}', Conflict between ${JSON.stringify(parsing_table[ast_keys[i]][follows[j]])} and ${JSON.stringify([])}.`;
                }
            }
        }
    }
    const fs = require('fs');
    const Translator = require('./translator.js');
    const header = fs.readFileSync('./generator_header.js', 'utf-8');
    const parsing_table_string = Translator(parsing_table);
    return `${header}\nconst parsing_table = ${parsing_table_string};`;
}