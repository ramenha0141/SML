module.exports = function (st) {
    const ast = {};
    for (let i = 0; i < st.child.length; i++) {
        if (i % 2 === 0) {
            const temp = define(st.child[i]);
            console.log(JSON.stringify(temp))
            ast[temp.identifier] = temp.value;
        }
    }
    return ast;
}
function define (st) {
    return {identifier:st.child[0].child[0].value, value:expression(st.child[2])};
}
function expression (st) {
    const ast = [];
    for (let i = 0; i < st.child.length; i++) {
        if (i % 2 === 0) {
            ast.push(element(st.child[i]));
        }
    }
    return ast;
}
function element (st) {
    const ast = [];
    for (let i = 0; i < st.child.length; i++) {
        switch (st.child[i].type) {
            case 'identifier' : {
                ast.push([st.child[i].child[0].value]);
                break;
            }
            case 'str' : {
                ast.push(st.child[i].child[0].value.slice(1, -1));
                break;
            }
            case 'paren' : {
                ast.push({type:'paren',expression:expression(st.child[i].child[1])});
                break;
            }
            case 'brace' : {
                ast.push({type:'brace',expression:expression(st.child[i].child[1])});
                break;
            }
            case 'bracket' : {
                ast.push({type:'bracket',expression:expression(st.child[i].child[1])});
                break;
            }
        }
    }
    return ast;
}