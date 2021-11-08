Array.prototype.read = function (entry = 0) {
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
            while (elements[i][0](__tokens, true)){
                elements[i][0](_tokens);
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
            while (elements[i][0](_tokens, true)){
                st.child.push(elements[i][0](tokens));
            }
        } else {
            st.child.push(elements[i].nextif(_tokens));
        }
    }
}
module.exports = class Parser {
    static sml (tokens, read) {
        const st = {type:'sml',child:[]};
        if (tokens.test(Parser.define, [Parser._sml_1], read)) {
            tokens.parse(Parser.define, st);
        } else {
            return false;
        }
        while (tokens.test(Parser._sml_1, true)){
            st.child.push(...Parser._sml_1(tokens).child);
        }
        return st;
    }
    static _sml_1 (tokens, read) {
        const st = {type:'_sml_1',child:[]};
        if (tokens.test(';', Parser.define, read)) {
            st.child.push(tokens.next());
            st.child.push(Parser.define(tokens));
        } else {
            return false;
        }
        return st;
    }
    static define (tokens, read) {
        const st = {type:'define',child:[]};
        if (tokens.test(Parser.identifier, '=', Parser.expression, read)) {
            st.child.push(Parser.identifier(tokens));
            st.child.push(tokens.next());
            st.child.push(Parser.expression(tokens));
        } else {
            return false;
        }
        return st;
    }
    static expression (tokens, read) {
        const st = {type:'expression',child:[]};
        if (tokens.test(Parser.element, read)) {
            st.child.push(Parser.element(tokens));
        } else {
            return false;
        }
        while (tokens.test('|', Parser.element, true)) {
            st.child.push(tokens.next());
            st.child.push(Parser.element(tokens));
        }
        return st;
    }
    static element (tokens, read) {
        const st = {type:'element',child:[]};
        while (tokens.test(Parser._element_1, true)) {
            st.child.push(...Parser._element_1(tokens).child);
        }
        return st;
    }
    static _element_1 (tokens, read) {
        const st = {type:'_element_1',child:[]};
        if (tokens.test(Parser.str_s, true)) {
            st.child.push(Parser.str_s(tokens));
        } else
        if (tokens.test(Parser.str_d, true)) {
            st.child.push(Parser.str_d(tokens));
        } else
        if (tokens.test(Parser.identifier, true)) {
            st.child.push(Parser.identifier(tokens));
        } else
        if (tokens.test(Parser.paren, true)) {
            st.child.push(Parser.paren(tokens));
        } else
        if (tokens.test(Parser.brace, true)) {
            st.child.push(Parser.brace(tokens));
        } else
        if (tokens.test(Parser.bracket, true)) {
            st.child.push(Parser.bracket(tokens));
        } else
        {
            if (read) {
                return false;
            } else {
                console.log('Syntax error: element expected.');
            }
        }
        return st;
    }
    static paren (tokens, read) {
        const st = {type:'paren',child:[]};
        if (tokens.test('(', Parser.expression, ')', read)) {
            tokens.next();
            st.child.push(Parser.expression(tokens));
            tokens.next();
        } else {
            return false;
        }
        return st;
    }
    static brace (tokens, read) {
        const st = {type:'brace',child:[]};
        if (tokens.test('{', Parser.expression, '}', read)) {
            tokens.next();
            st.child.push(Parser.expression(tokens));
            tokens.next();
        } else {
            return false;
        }
        return st;
    }
    static bracket (tokens, read) {
        const st = {type:'bracket',child:[]};
        if (tokens.test('[', Parser.expression, ']', read)) {
            tokens.next();
            st.child.push(Parser.expression(tokens));
            tokens.next();
        } else {
            return false;
        }
        return st;
    }
    static identifier (tokens, read) {
        const st = {type:'identifier',child:[]};
        if (/^[a-zA-Z\-][a-zA-Z\-_]*$/.test(tokens.read())) {
            st.child.push(tokens.next());
        } else {
            if (read) {
                return false;
            } else {
                console.log('Syntax error on token "' + tokens.read() + '": identifier expected.');
            }
        }
        return st;
    }
    static str_s (tokens, read) {
        const st = {type:'str',child:[]};
        if (/^'(?:\\[\s\S]|[^'\r\n\\])*'$/.test(tokens.read())) {
            st.child.push(tokens.next());
        } else {
            if (read == true) {
                return false;
            } else {
                console.log('Syntax error on token "' + tokens.read() + '": string expected.');
            }
        }
        return st;
    }
    static str_d (tokens, read) {
        const st = {type:'str',child:[]};
        if (/^"(?:\\[\s\S]|[^"\r\n\\])*"$/.test(tokens.read())) {
            st.child.push(tokens.next());
        } else {
            if (read) {
                return false;
            } else {
                console.log('Syntax error on token "' + tokens.read() + '": string expected.');
            }
        }
        return st;
    }
}