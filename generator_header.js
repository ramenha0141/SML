module.exports = function Parser(tokens) {
    // LL法構文解析
    const stack = [[Object.keys(parsing_table)[0]]];
    const rules = [];
    tokens.push({ type: '$' });
    while (stack.length > 0) {
        if (typeof stack[0] === 'object') {
            // 非終端記号
            const symbol = stack.shift();
            if (typeof tokens[0] === 'string') {
                if (parsing_table[symbol[0]][tokens[0]]) {
                    stack.unshift(...parsing_table[symbol[0]][tokens[0]], undefined);
                    rules.push(symbol);
                } else {
                    throw `SyntaxError: Unexpected token '${tokens[0]}'.`;
                }
            } else {
                if (parsing_table[symbol[0]][Symbol.for(tokens[0].type)]) {
                    stack.unshift(...parsing_table[symbol[0]][Symbol.for(tokens[0].type)], undefined);
                    rules.push(symbol);
                } else {
                    if (tokens[0].type === '$') {
                        throw `SyntaxError: Unexpected end of file.`;
                    } else {
                        throw `SyntaxError: Unexpected token '${tokens[0].value}'.`;
                    }
                }
            }
        } else if (typeof stack[0] === 'string') {
            // 終端記号
            const symbol = stack.shift();
            if (typeof tokens[0] === 'string' ? tokens[0] === symbol : tokens[0].value === symbol) {
                rules.push(typeof tokens[0] === 'string' ? tokens.shift() : tokens.shift().value);
            } else {
                throw `SyntaxError: Unexpected token '${typeof tokens[0] === 'string' ? tokens[0] : tokens[0].value}', ${symbol} expected.`;
            }
        } else if (stack[0] === Symbol.for('$')) {
            stack.shift();
        } else if (typeof stack[0] === 'symbol') {
            // 特殊終端記号
            const symbol = stack.shift();
            if (tokens[0].type === Symbol.keyFor(symbol)) {
                rules.push(tokens.shift().value);
            } else {
                throw `SyntaxError: Unexpected token '${typeof tokens[0] === 'string' ? tokens[0] : tokens[0].value}', ${Symbol.keyFor(symbol)} type expected.`;
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
                    if (_st.type.slice(0, 2) === '__') {
                        if (_st.child.length === 1) {
                            st.child.push(..._st.child);
                        } else {
                            st.child.push(_st);
                        }
                    } else if (_st.type.slice(0, 1) === '_') {
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