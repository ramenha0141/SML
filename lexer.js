module.exports = function (code) {
    const tokenize_pattern = /("(?:\\[\s\S]|[^"\r\n\\])*"|'(?:\\[\s\S]|[^'\r\n\\])*'|[()\[\]{}=;|+ε]|[@a-zA-Z\-_][a-zA-Z\-_]*)/g;
    const _tokens = code.match(tokenize_pattern) || [];
    const tokens = [];
    for (let i = 0; i < _tokens.length; i++) {
        const token = _tokens[i];
        switch (true) {
            case /^("(?:\\[\s\S]|[^"\r\n\\])*"|'(?:\\[\s\S]|[^'\r\n\\])*')$/.test(token): {
                tokens.push({type: 'string', value: token});
                break;
            }
            case /^([@a-zA-Z\-_][a-zA-Z\-_]*)$/.test(token): {
                tokens.push({type: 'identifier', value: token});
                break;
            }
            case /^\s*$/.test(token): {
                break;
            }
            default: {
                tokens.push(token);
            }
        }
    }
    return tokens;
}