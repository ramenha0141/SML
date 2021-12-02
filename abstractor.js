module.exports = function (st) {
    const ast = {};
    for (let i = 0; i < st.child.length; i++) {
        const temp = define(st.child[i]);
        ast[temp.identifier] = temp.value;
    }
}
function define (st) {
    const ast = [];
    for (let i = 0; i < st.child[3].child.length; i++) {
        if (i % 2 === 0) {
            ast.push(expression(st.child[3].child[i]));
        }
    }
    return {identifier:st.child[0], value:ast};
}
function expression (st) {
    const ast = [];
    
}