module.exports = class {
    tmp = '';
    bnf (st) {
        return `module.exports = class {\n${st.child.reduce((output, current) => {
            return output + this.define(current);
        }) + this.tmp}}`;
    }
    define (st) {
        return `${st.child[0].child[0].value} (tokens, read) {
const st = {type:${st.child[0].child[0].value},child:[]};
let _tokens = tokens.slice();
${this.expression(st.child[2], ['_' + st.child[0].child[0].value + '_', 1])}}
return st;
`;
    }
    expression (st, ) {
        let output = '';
        for (let i = 0; i < st.child.length; i++)
        return `${st.child.reduce((output, current) => {
            return output + current.type == 'element' ? this.element(current) : `_tokens = tokens.slice();\n`;
        })}`
    }
    element (st) {
        const factors = [];
        for (let i = 0; i < st.child.length; i ++) {
            switch (st.child[i].type) {
                case 'str_s' : {
                    factors.push({type:'value',value:st.child[i].child[0].value});
                    break;
                }
                case 'str_d' : {
                    factors.push({type:'value',value:st.child[i].child[0].value});
                    break;
                }
                case 'identifier' : {
                    factors.push({type:'identifier',identifier:st.child[i].child[0].value});
                }
            }
        }
    }
}