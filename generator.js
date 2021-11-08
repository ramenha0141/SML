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
    sml (st) {
        
    }
}