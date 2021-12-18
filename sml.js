const fs = require('fs');
const lexer = require('./lexer.js');
const Parser = require('./parser.js');
function compile(option) {
    try {
        const input = fs.readFileSync(option.filename, 'utf-8');
        const tokens = lexer(input);
        const st = Parser(tokens);
        console.log(JSON.stringify(st));
    } catch (e) {
        console.error(`\u001b[31m\u001b[1mError! \u001b[0m${e}`);
    }
}
const args = process.argv.slice(2);
const option = {};
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
        case '--version': {
            console.log('SML Compiler 1.0');
            break;
        }
        case '-o': {
            i++;
            option.outputfilename = args[i];
            break;
        }
        default: {
            option.filename = arg;
        }
    }
}
if (args.length == 0) {
    console.log(`Options\n  --version : Show version\n  <path> : Set input file\n  -o <path> : Set output file (If this option is not set, '<input-file-name>.<json/js>' will be set by default)`)
}
if (option.filename) {
    compile(option);
}