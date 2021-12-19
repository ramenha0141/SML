module.exports = function Generator(ast) {
    function first(define) {
        const A = ast[define];
        const firsts = [];
        for (let i = 0; i < A.length; i++) {
            if (A[i] === 'ε') {
                firsts.push('ε');
            }
        }
    }
}