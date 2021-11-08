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
module.exports = class Parser {
static _sml_1 (tokens, read){
const st = {type:'_sml_1',child:[]};
if (tokens.test(';', Parser.define, read)) {
tokens.parse(';', Parser.define, st);
} else {
return false;
}
return st;
}
static sml (tokens, read){
const st = {type:'sml',child:[]};
if (tokens.test(Parser.define, ['brace', Parser._sml_1], read)) {
tokens.parse(Parser.define, ['brace', Parser._sml_1], st);
} else {
return false;
}
return st;
}
static define (tokens, read){
const st = {type:'define',child:[]};
if (tokens.test(Parser.identifier, '=', Parser.expression, read)) {
tokens.parse(Parser.identifier, '=', Parser.expression, st);
} else {
return false;
}
return st;
}
static _expression_1 (tokens, read){
const st = {type:'_expression_1',child:[]};
if (tokens.test('|', Parser.element, read)) {
tokens.parse('|', Parser.element, st);
} else {
return false;
}
return st;
}
static expression (tokens, read){
const st = {type:'expression',child:[]};
if (tokens.test(Parser.element, ['brace', Parser._expression_1], read)) {
tokens.parse(Parser.element, ['brace', Parser._expression_1], st);
} else {
return false;
}
return st;
}
static _element_1 (tokens, read){
const st = {type:'_element_1',child:[]};
if (tokens.test(Parser.str_s, true)) {
tokens.parse(Parser.str_s, st);
} else if (tokens.test(Parser.str_d, true)) {
tokens.parse(Parser.str_d, st);
} else if (tokens.test(Parser.identifier, true)) {
tokens.parse(Parser.identifier, st);
} else if (tokens.test(Parser.paren, true)) {
tokens.parse(Parser.paren, st);
} else if (tokens.test(Parser.brace, true)) {
tokens.parse(Parser.brace, st);
} else if (tokens.test(Parser.bracket, true)) {
tokens.parse(Parser.bracket, st);
} else {
return false;
}
return st;
}
static element (tokens, read){
const st = {type:'element',child:[]};
if (tokens.test(['brace', Parser._element_1], read)) {
tokens.parse(['brace', Parser._element_1], st);
} else {
return false;
}
return st;
}
static paren (tokens, read){
const st = {type:'paren',child:[]};
if (tokens.test('(', Parser.expression, ')', read)) {
tokens.parse('(', Parser.expression, ')', st);
} else {
return false;
}
return st;
}
static brace (tokens, read){
const st = {type:'brace',child:[]};
if (tokens.test('{', Parser.expression, '}', read)) {
tokens.parse('{', Parser.expression, '}', st);
} else {
return false;
}
return st;
}
}