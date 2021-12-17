module.exports = parser = function (tokens, parsing_table) {
    const stack = [['S']];
    const rules = [];
    tokens.push({type:'$',value:''});
    while (stack.length > 0) {
        if (typeof stack[0] === 'object') {
            const symbol = stack.shift();
            if (tokens[0].type === undefined) {
                stack.unshift(...parsing_table[symbol[0]][tokens[0].value]);
                rules.push(symbol);
            } else {
                stack.unshift(...parsing_table[symbol[0]][Symbol.for(tokens[0].type)]);
                rules.push(symbol);
            }
        } else if (typeof stack[0] === 'string') {
            const symbol = stack.shift();
            if (tokens[0].value === symbol) {
                rules.push(tokens.shift().value);
            } else {
                console.error(`${tokens.shift().value} token is not ${symbol}`);
            }
        } else if (typeof stack[0] === 'symbol') {
            const symbol = stack.shift();
            if (tokens[0].type === Symbol.keyFor(symbol)) {
                rules.push(tokens.shift().value);
            } else {
                console.error(`${tokens.shift().value} token type is not ${Symbol.keyFor(symbol)}`);
            }
        }
    }
    return rules.slice(0, -1);
}
const $ = {number: Symbol.for('number'), $: Symbol.for('$')};
const tokens = [{type:'number',value:'1'},{value:'+'},{type:'number',value:'2'},{value:'-'},{type:'number',value:'3'}];
const parsing_table = {
    'S' : {
        [$.number] : [['exp']]
    },
    'exp' : {
        [$.number] : [$.number, ['exp_']]
    },
    'exp_' : {
        '+' : ['+', $.number, ['exp_']],
        '-' : ['-', $.number, ['exp_']],
        [$.$] : [$.$]
    }
};
console.log(parser(tokens, parsing_table));