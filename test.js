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
const { first, follow } = require('./lib.js')(ast);
function getFirsts() {
    const firsts = {};
    for (let i = 0; i < Object.keys(ast).length; i++) {
        const key = Object.keys(ast)[i];
        firsts[key] = first(key);
    }
    console.log(firsts);
}
function getFollows() {
    const follows = {};
    for (let i = 0; i < Object.keys(ast).length; i++) {
        const key = Object.keys(ast)[i];
        follows[key] = follow(key);
    }
    console.log(follows);
}
//getFirsts();
getFollows();