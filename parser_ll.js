module.exports = parser = function (tokens, parsing_table) {
    const stack = [['S']];
    const parsed_tokens = [];
    const rules = [];
    const state = 0;
    while (stack.length > 0) {
        if (typeof stack[0] === 'object') {
            const symbol = stack.shift()[0];
            stack.unshift(...parsing_table[symbol][tokens[0]]);
            rules.push(symbol);
        } else {
            const token = stack.shift();
            if (tokens[0] === token) {
                parsed_tokens.push(tokens.shift());
            } else {
                console.error(`${tokens.shift()} != ${token}`);
            }
        }
    }
    return rules;
}
const tokens = ['a' ,'b', 'c'];
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