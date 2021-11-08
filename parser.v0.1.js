Array.prototype.read = function (entry = 0) {
    return this[entry];
}
Array.prototype.next = function () {
    return this.shift();
}
Array.prototype.nextif = function (token, read) {
    if (this.read() == token) {
        return this.next();
    } else {
        if (read){
            return false;
        } else {
            console.error(new Error('Syntax error on token "' + this.read() + '", token ";" expected.'));
        }
    }
}
module.exports = class {
    bnf (tokens) {
        let st = [];
        st.push(this.define(tokens));
        st.push(...this._bnf_1(tokens));
        return st;
    }
    _bnf_1 (tokens) {
        let st = [];
        let _tokens = tokens.slice();
        while (_tokens.nextif(';', true) && this.define(_tokens, true)) {
            st.push(tokens.next());
            st.push(this.define(tokens));
        }
        return st;
    }
    define (tokens, read) {
        let st = [];
        let _tokens = tokens.slice();
        if (this.identifier(_tokens, read) && _tokens.nextif('=', read) && this.expression(_tokens, read)) {
            st.push(this.identifier(tokens));
            st.push(tokens.next());
            st.push(this.expression(tokens));
        } else {
            return false;
        }
        while (this.expression(_tokens, true) == true) {
            st.push(this.expression(tokens));
        }
        return st;
    }
    expression (tokens, read) {
        let st = [];
        let _tokens = tokens.slice();
        if (this.element(_tokens, read)) {
            st.push(this.element(tokens));
        } else {
            return false;
        }
        while (_tokens.nextif('|', true) && this.element(_tokens, true)) {
            st.push(tokens.next());
            st.push(this.element(tokens));
        }
        return st;
    }
    element (tokens, read) {
        let st = [];
        let _tokens = tokens.slice();
        if (this._element_1(_tokens, read)) {
            st.push(...this._element_1(tokens));
        } else {
            return false;
        }
        while (!(this._element_1(_tokens, true) == false)) {
            st.push(...this._element_1(tokens));
        }
        return st;
    }
    _element_1 (tokens, read) {
        let st = [];
        let _tokens = tokens.slice();
        if (this.str_s(_tokens, true)) {
            st.push(this.str_s(tokens));
            if (_tokens.nextif('+', true)) {
                st.push(tokens.next());
            }
            return st;
        }
        _tokens = tokens.slice();
        if (this.str_d(_tokens, true)) {
            st.push(this.str_d(tokens));
            if (_tokens.nextif('+', true)) {
                st.push(tokens.next());
            }
            return st;
        }
        _tokens = tokens.slice();
        if (this.identifier(_tokens, true)) {
            st.push(this.identifier(tokens));
            if (_tokens.nextif('+', true)) {
                st.push(tokens.next());
            }
            return st;
        }
        _tokens = tokens.slice();
        if (_tokens.nextif('(', true) && this.expression(_tokens, true) && _tokens.nextif(')', true)) {
            st.push(tokens.next());
            st.push(this.expression(tokens));
            st.push(tokens.next());
            if (_tokens.nextif('+', true)) {
                st.push(tokens.next());
            }
            return st;
        }
        _tokens = tokens.slice();
        if (_tokens.nextif('[', true) && this.expression(_tokens, true) && _tokens.nextif(']', true)) {
            st.push(tokens.next());
            st.push(this.expression(tokens));
            st.push(tokens.next());
            return st;
        }
        _tokens = tokens.slice();
        if (_tokens.nextif('{', true) && this.expression(_tokens, true) && _tokens.nextif('}', true)) {
            st.push(tokens.next());
            st.push(this.expression(tokens));
            st.push(tokens.next());
            return st;
        }
        if (read) {
            return false;
        } else {
            console.log('Syntax error, element expected.');
        }
    }
    identifier (tokens, read) {
        let st = [];
        if (/^[a-zA-Z\-][a-zA-Z\-_]*$/.test(tokens.read())) {
            st.push(tokens.next());
        } else {
            if (read) {
                return false;
            } else {
                console.log('Syntax error on token "' + tokens.read() + '", identifier expected.');
            }
        }
        return st;
    }
    str_s (tokens, read) {
        let st = [];
        if (/^'(?:\\[\s\S]|[^'\r\n\\])*'$/.test(tokens.read())) {
            st.push(tokens.next());
        } else {
            if (read == true) {
                return false;
            } else {
                console.log('Syntax error on token "' + tokens.read() + '", string expected.');
            }
        }
        return st;
    }
    str_d (tokens, read) {
        let st = [];
        if (/^"(?:\\[\s\S]|[^"\r\n\\])*"$/.test(tokens.read())) {
            st.push(tokens.next());
        } else {
            if (read) {
                return false;
            } else {
                console.log('Syntax error on token "' + tokens.read() + '", string expected.');
            }
        }
        return st;
    }
}