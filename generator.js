const header = `Array.prototype.read = function (entry = 0) {
    return this[entry];
}
Array.prototype.next = function () {
    return {type:'value',value:this.shift()};
}
String.prototype.nextif = function (tokens, read) {
    if (tokens.read() == this.slice()) {
        return tokens.next();
    } else {
        if (read) {
            return false;
        } else {
            console.error('Syntax error on token "' + tokens.read() + '"');
        }
    }
}
Array.prototype.test = function (...elements) {
    const _tokens = this.slice();
    let result = true;
    const read = elements.pop();
    for (let i = 0; i < elements.length; i++) {
        if (typeof elements[i] == 'function') {
            result = result && elements[i](_tokens, read);
        } else if (typeof elements[i] == 'object') {
            const __tokens = _tokens.slice();
            if (elements[i][0] == 'paren') {
                result = result && elements[i][1](_tokens, read);
            } else if (elements[i][0] == 'brace') {
                while (elements[i][1](__tokens, true)){
                    elements[i][1](_tokens);
                }
            } else if (elements[i][0] == 'bracket') {
                if (elements[i][1](__tokens, true)){
                    elements[i][1](_tokens);
                }
            }
        } else {
            result = result && elements[i].nextif(_tokens, read);
        }
    }
    return result;
}
Array.prototype.parse = function (...elements) {
    const tokens = this;
    const st = elements.pop();
    for (let i = 0; i < elements.length; i++) {
        if (typeof elements[i] == 'function') {
            st.child.push(elements[i](tokens));
        } else if (typeof elements[i] == 'object') {
            const _tokens = tokens.slice();
            if (elements[i][0] == 'paren') {
                st.child.push(...elements[i][1](tokens).child);
            } else if (elements[i][0] == 'brace') {
                while (elements[i][1](_tokens, true)){
                    st.child.push(...elements[i][1](tokens).child);
                }
            } else if (elements[i][0] == 'bracket') {
                if (elements[i][1](_tokens, true)){
                    st.child.push(...elements[i][1](tokens).child);
                }
            }
        } else {
            st.child.push(elements[i].nextif(tokens));
        }
    }
}
`;
const defines = [];
module.exports = class Generator {
    static sml (st, include) {
        for (let i = 0; i < st.child.length; i++) {
            if (i % 2 == 0) {
                Generator.define(st.child[i]);
            }
        }
        return `${header}module.exports = class Parser {\r\n${defines.join('')}${include}}`;
    }
    static define (st) {
        const identifier = st.child[0].child[0].value;
        const expression = st.child[2];
        let id = [1];
        defines.push(`    static ${identifier} (tokens, read) {\r\n        const st = {type:'${identifier}',child:[]};\r\n        ${Generator.expression(expression, identifier, id)}        return st;\r\n    }\r\n`);
    }
    static expression (st, identifier, id) {
        const elements = [];
        for (let i = 0; i < st.child.length; i++) {
            if (i % 2 == 0) {
                elements.push(st.child[i]);
            }
        }
        let ret = '';
        for (let i = 0; i < elements.length; i++) {
            const tmp = Generator.element(elements[i], identifier, id);
            ret += `if (tokens.test(${tmp}, ${elements.length == 1 ? 'read' : 'true'})) {\r\n            tokens.parse(${tmp}, st);\r\n        } else `;
        }
        return `${ret}{\r\n            return false;\r\n        }\r\n`;
    }
    static element (st, identifier, id) {
        const factors = [];
        for (let i = 0; i < st.child.length; i++) {
            const factor = st.child[i];
            switch (factor.type) {
                case 'str' : {
                    factors.push(factor.child[0].value);
                    break;
                }
                case 'identifier' : {
                    factors.push(`Parser.${factor.child[0].value}`);
                    break;
                }
                case 'paren' : {
                    factors.push(`['paren', Parser._${identifier}_${id}]`);
                    Generator.define({child:[{child:[{value:`_${identifier}_${id}`}]}, '=', factor.child[1]]});
                    id++;
                    break;
                }
                case 'brace' : {
                    factors.push(`['brace', Parser._${identifier}_${id}]`);
                    Generator.define({child:[{child:[{value:`_${identifier}_${id}`}]}, '=', factor.child[1]]});
                    id[0]++;
                    break;
                }
                case 'bracket' : {
                    factors.push(`['bracket', Parser._${identifier}_${id}]`);
                    Generator.define({child:[{child:[{value:`_${identifier}_${id}`}]}, '=', factor.child[1]]});
                    id[0]++;
                    break;
                }
                default : {
                    console.log('error');
                }
            }
        }
        return factors.join(', ');
    }
}