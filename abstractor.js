module.exports = function (st) {
    const ast = {};
    for (let i = 0; i < st.child.length; i++) {
        const temp = define(st.child[i]);
        ast[temp.identifier] = temp.value;
    }
}
function define (st) {
    const ast = {};
    ast.identifier = st.child[0];
    
}