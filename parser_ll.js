module.exports = parser = function (tokens, parsing_table) {
    const stack = [['S']];
    const rules = [];
    tokens.push({type:'$'});
    while (stack.length > 0) {
        if (typeof stack[0] === 'object') {
            // 非終端記号
            const symbol = stack.shift();
            if (tokens[0].type === undefined) {
                stack.unshift(...parsing_table[symbol[0]][tokens[0].value], undefined);
                rules.push(symbol);
            } else {
                stack.unshift(...parsing_table[symbol[0]][Symbol.for(tokens[0].type)], undefined);
                rules.push(symbol);
            }
        } else if (typeof stack[0] === 'string') {
            // 終端記号
            const symbol = stack.shift();
            if (tokens[0].value === symbol) {
                rules.push(tokens.shift().value);
            } else {
                console.error(`${tokens.shift().value} token is not ${symbol}`);
            }
        } else if (stack[0] === Symbol.for('$')) {
            stack.shift();
        } else if (typeof stack[0] === 'symbol') {
            // 特殊終端記号
            const symbol = stack.shift();
            if (tokens[0].type === Symbol.keyFor(symbol)) {
                rules.push(tokens.shift().value);
            } else {
                console.error(`${tokens.shift().value} token type is not ${Symbol.keyFor(symbol)}`);
            }
        } else if (stack[0] === undefined) {
            // リターン記号
            const symbol = stack.shift();
            rules.push([undefined]);
        }
    }
    console.log(rules);
    function tree() {
        const st = [];
        while (rules.length > 0) {
            if (typeof rules[0] === 'string') {
                st.push(rules.shift());
            } else if (typeof rules[0][0] === 'string') {
                rules.shift();
                const _st = tree();
                if (_st.length > 0) {
                    st.push(_st);
                }
            } else if (rules[0][0] === undefined) {
                rules.shift();
                return st;
            }
        }
        return st;
    }
    return JSON.stringify(tree());
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