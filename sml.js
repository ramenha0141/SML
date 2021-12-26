const fs = require('fs');
const Lexer = require('./lexer.js');
const Parser = require('./parser.js');
const Generator = require('./generator');
function compile(option) {
    try {
        const input = fs.readFileSync(option.filename, 'utf-8');
        const tokens = Lexer(input);
        const ast = Parser(tokens);
        const output = Generator(ast);
        fs.writeFileSync(option.outputfilename || `${option.filename}.js`, output);
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
    console.log(`Command line options\n  --version : Show version\n  <path> : Set input file\n  -o <path> : Set output file (If this option is not set, '<input-file-name>.js' will be set by default)`)
}
if (option.filename) {
    compile(option);
}