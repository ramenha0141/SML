module.exports = parser = function (tokens, parsing_table) {
    const stack = [['S'], ['$']];
    const rules = [];
    while (stack.length > 0) {
        if (stack[0][0] === '$') {
            const symbol = stack.shift();
            if (tokens[0][0] === '$') {
                return rules;
            } else {
                console.error('Parsing Error');
            }
        } else if (!(typeof stack[0] === 'string')) {
            const symbol = stack.shift();
            stack.unshift(...parsing_table[symbol[0]][tokens[0]]);
            rules.push(symbol);
        } else {
            const token = stack.shift();
            if (tokens[0] === token) {
                rules.push(tokens.shift());
            } else {
                console.error(`${tokens.shift()} != ${token}`);
            }
        }
    }
    return rules;
}
const tokens = ['a' ,'b', 'c', ['$']];
const parsing_table = {
    'S' : {
        'a' : [['A']],
        'b' : [['B']]
    },
    'A' : {
        'a' : ['a', ['B']]
    },
    'B' : {
        'b' : ['b', 'c']
    }
};
console.log(parser(tokens, parsing_table));