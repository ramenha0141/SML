const fs = require('fs');
const lexer = require('./lexer.js');
const Parser = require('./parser.js');
const Generator = require('./generator.js');
function compile (option) {
    console.log(`\nCompile options:\n  input: ${option.filename},\n  ${option.include ? `include: ${option.include},\n  ` : ''}output: ${option.outputfilename || `${option.filename}.js`}\n`);
    const input = fs.readFileSync(option.filename, 'utf-8');
    const include = option.include ? fs.readFileSync(option.include, 'utf-8') : '';
    const tokens = lexer(input);
    const st = Parser.sml(tokens);
    const output = Generator.sml(st, include);
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
        case '-i' : {
            i++;
            option.include = args[i];
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
if (args.length == 0) {
    console.log(`Options\n  --version : Show version\n  <path> : Set input file\n  -o <path> : Set output file (If this option is not set, '<input-file-name>.js' will be set by default)`)
}
if (option.filename) {
    compile(option);
}