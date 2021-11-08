const fs = require('fs');
const lexer = require('./lexer.js');
const Parser = require('./parser.js');
function compile (filename='sml.syntax') {
    const code = fs.readFileSync(filename, 'utf-8');
    const tokens = lexer(code);
    const st = Parser.sml(tokens);
    console.log(JSON.stringify(st));
}
compile(process.argv[2]);