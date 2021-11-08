module.exports = function (code) {
    const tokenize_pattern = /("(?:\\[\s\S]|[^"\r\n\\])*"|'(?:\\[\s\S]|[^'\r\n\\])*'|[()\[\]{}=;|+]|[a-zA-Z\-][a-zA-Z\-_]*)/g;
    const tokens = code.match(tokenize_pattern) || [];
    return tokens;
}