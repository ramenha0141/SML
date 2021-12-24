module.exports = function (ast) {
    const first_memo = {};
    function first(A) {
        if (first_memo[A] === undefined) {
            const s = ast[A];
            const firsts = [];
            for (let i = 0; i < s.length; i++) {
                firsts.push(..._first(s[i]));
            }
            first_memo[A] = [...new Set(firsts)];
        }
        return first_memo[A];
    }
    function _first(s) {
        if (s === 'ε' || s.length === 0) {
            return [Symbol.for('ε')];
        }
        switch (typeof s[0]) {
            case 'string': {
                return [s[0]];
            }
            case 'symbol': {
                return [s[0]];
            }
            case 'object': {
                const firsts = first(s[0][0]);
                if (firsts.includes(Symbol.for('ε'))) {
                    firsts.splice(firsts.indexOf(Symbol.for('ε')), 1);
                    firsts.push(..._first(s.slice(1)));
                }
                return firsts;
            }
        }
    }
    const follow_memo = {};
    const ast_keys = Object.keys(ast);
    for (let i = 0; i < ast_keys.length; i++) {
        follow_memo[ast_keys[i]] = [];
    }
    function follow_calc() {
        for (let i = 0; i < ast_keys.length; i++) {
            if (i === 0) {
                follow_memo[ast_keys[0]].push(Symbol.for('$'));
            }
            const A = ast[ast_keys[i]];
            for (let j = 0; j < A.length; j++) {
                if (typeof A[j] === 'object') {
                    for (let k = 0; k < A[j].length; k++) {
                        const element = A[j][k];
                        if (k === A[j].length - 1) {
                            if (typeof element === 'object') {
                                follow_memo[element[0]].push(...follow_memo[ast_keys[i]]);
                            }
                        } else if (typeof element === 'object') {
                            const firsts = [...new Set(_first(A[j].slice(k + 1)))];
                            if (firsts.includes(Symbol.for('ε'))) {
                                follow_memo[element[0]].push(...follow_memo[ast_keys[i]]);
                                firsts.splice(firsts.indexOf(Symbol.for('ε')), 1);
                            }
                            follow_memo[element[0]].push(...firsts);
                        }
                    }
                }
            }
            follow_memo[ast_keys[i]] = [...new Set(follow_memo[ast_keys[i]])];
        }
    }
    let old_count = 0;
    let new_count = 0
    function comp_follow() {
        old_count = new_count;
        new_count = 0;
        follow_calc();
        for (let i = 0; i < ast_keys.length; i++) {
            new_count += follow_memo[ast_keys[i]].length;
        }
        return old_count === new_count;
    }
    let count = 0;
    while(!comp_follow()) {count++}
    console.log(count);
    function follow(A) {
        return follow_memo[A];
    }
    return { first, follow };
}