function parser(tokens, parsing_table) {
    // LL法構文解析
    const stack = [['S']];
    const rules = [];
    tokens.push({ type: '$' });
    while (stack.length > 0) {
        if (typeof stack[0] === 'object') {
            // 非終端記号
            const symbol = stack.shift();
            if (typeof tokens[0] === 'string') {
                stack.unshift(...parsing_table[symbol[0]][tokens[0]], undefined);
                rules.push(symbol);
            } else {
                stack.unshift(...parsing_table[symbol[0]][Symbol.for(tokens[0].type)], undefined);
                rules.push(symbol);
            }
        } else if (typeof stack[0] === 'string') {
            // 終端記号
            const symbol = stack.shift();
            if (typeof tokens[0] === 'string' ? tokens[0] === symbol : tokens[0].value === symbol) {
                rules.push(typeof tokens[0] === 'string' ? tokens.shift() : tokens.shift().value);
            } else {
                console.error(`${typeof tokens[0] === 'string' ? tokens[0] : tokens[0].value} token is not ${symbol}`);
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
            stack.shift();
            rules.push([undefined]);
        }
    }
    // ST構築
    function tree(type) {
        const st = { type: type, child: [] };
        while (rules.length > 0) {
            if (typeof rules[0] === 'string') {
                st.child.push(rules.shift());
            } else if (typeof rules[0][0] === 'string') {
                const _st = tree(rules.shift()[0]);
                if (_st.child.length > 0) {
                    if (_st.type.slice(0, 1) === '_') {
                        st.child.push(..._st.child);
                    } else {
                        st.child.push(_st);
                    }
                }
            } else if (rules[0][0] === undefined) {
                rules.shift();
                return st;
            }
        }
        return st;
    }
    return tree().child[0];
}
const $ = { identifier: Symbol.for('identifier'), string: Symbol.for('string'), $: Symbol.for('$') };
const tokens = [{type: 'identifier', value: 'def'}, '=', {type: 'string', value: "'str'"}, {type: 'identifier', value: 'def2'}, '|', '(', {type: 'string', value: "'str2'"}, ')', ';'];
const parsing_table = {
    'S': {
        [$.identifier]: [['sml'], $.$]
    },
    'sml': {
        [$.identifier]: [['_sml']]
    },
    '_sml': {
        [$.identifier]: [['define'], ';', ['_sml']],
        [$.$]: []
    },
    'define': {
        [$.identifier]: [$.identifier, '=', ['expression']]
    },
    'expression': {
        [$.string]: [['element'], ['_expression']],
        [$.identifier]: [['element'], ['_expression']],
        '(': [['element'], ['_expression']],
        '{': [['element'], ['_expression']],
        '[': [['element'], ['_expression']]
    },
    '_expression': {
        '|': ['|', ['element'], ['_expression']],
        ';': [],
        ')': [],
        '}': [],
        ']': []
    },
    'element': {
        [$.string]: [['_element']],
        [$.identifier]: [['_element']],
        '(': [['_element']],
        '{': [['_element']],
        '{': [['_element']]
    },
    '_element': {
        [$.string]: [['string'], ['_element']],
        [$.identifier]: [['identifier'], ['_element']],
        '(': [['paren'], ['_element']],
        '{': [['brace'], ['_element']],
        '[': [['bracket'], ['_element']],
        '|': [],
        ';': [],
        ')': [],
        '}': [],
        ']': []
    },
    'string': {
        [$.string]: [$.string]
    },
    'identifier': {
        [$.identifier]: [$.identifier]
    },
    'paren': {
        '(': ['(', ['expression'], ')']
    },
    'brace': {
        '{': ['{', ['expression'], '}']
    },
    'bracket': {
        '[': ['[', ['expression'], ']']
    },
};
module.exports = function (tokens) {
    return parser(tokens, parsing_table);
}