const fs = require('fs');
const lexer = require('./lexer.js');
const Parser = require('./parser.js');
const Generator = require('./generator.js');
function compile (option) {
    const input = fs.readFileSync(option.filename || 'sml.syntax', 'utf-8');
    const tokens = lexer(input);
    const st = Parser.sml(tokens);
    const output = Generator.sml(st)
    fs.writeFileSync(option.outputfilename || `${option.filename}.js`, output);
}
const args = process.argv.slice(2);
const option = {};
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
        case '--version' : {
            console.log('SML Compiler 1.0');
            break;
        }
        case '-o' : {
            i++;
            option.outputfilename = args[i];
            break;
        }
        default : {
            option.filename = arg;
        }
    }
}
compile(option);