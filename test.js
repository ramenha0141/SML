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
const ast = {
    "sml": [
        [
            [
                "_sml"
            ]
        ]
    ],
    "_sml": [
        [
            [
                "define"
            ],
            ";",
            [
                "_sml"
            ]
        ],
        "ε"
    ],
    "define": [
        [
            Symbol.for('identifier'),
            "=",
            [
                "expression"
            ]
        ]
    ],
    "expression": [
        [
            [
                "element"
            ],
            [
                "_expression"
            ]
        ]
    ],
    "_expression": [
        [
            "|",
            [
                "element"
            ],
            [
                "_expression"
            ]
        ],
        "ε"
    ],
    "element": [
        [
            [
                "_element"
            ]
        ],
        [
            [
                "epsilon"
            ]
        ]
    ],
    "_element": [
        [
            [
                "string"
            ],
            [
                "_element"
            ]
        ],
        [
            [
                "identifier"
            ],
            [
                "_element"
            ]
        ],
        [
            [
                "paren"
            ],
            [
                "_element"
            ]
        ],
        [
            [
                "brace"
            ],
            [
                "_element"
            ]
        ],
        [
            [
                "bracket"
            ],
            [
                "_element"
            ]
        ],
        "ε"
    ],
    "epsilon": [
        [
            "ε"
        ]
    ],
    "string": [
        [
            Symbol.for('string')
        ]
    ],
    "identifier": [
        [
            Symbol.for('identifier')
        ]
    ],
    "paren": [
        [
            "(",
            [
                "expression"
            ],
            ")"
        ]
    ],
    "brace": [
        [
            "{",
            [
                "expression"
            ],
            "}"
        ]
    ],
    "bracket": [
        [
            "[",
            [
                "expression"
            ],
            "]"
        ]
    ]
};
const firsts = {};
for (let i = 0; i < Object.keys(ast).length; i++) {
    const key = Object.keys(ast)[i];
    firsts[key] = first(key);
}
console.log(firsts);