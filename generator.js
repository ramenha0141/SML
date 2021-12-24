module.exports = function Generator(ast) {
    const { first, follow } = require('./lib.js')(ast);
}