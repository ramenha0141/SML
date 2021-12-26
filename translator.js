module.exports = Translator = function Translator(sourceObj, indent = '') {
    let string = '';
    if (Array.isArray(sourceObj)) {
        if (sourceObj.length === 0) {
            return `[]`;
        }
        string += `[${sourceObj.length > 1 ? '\n': ''}`;
        for (let i = 0; i < sourceObj.length; i++) {
            const element = sourceObj[i];
            if (typeof element === 'string') {
                string += `${sourceObj.length > 1 ? indent + '    ': ''}'${element}'`;
            } else if (typeof element === 'symbol') {
                string += `${sourceObj.length > 1 ? indent + '    ': ''}Symbol.for('${Symbol.keyFor(element)}')`;
            } else if (typeof element === 'object') {
                string += `${sourceObj.length > 1 ? indent + '    ': ''}${Translator(element, indent + '    ')}`;
            }
            if (i < sourceObj.length - 1) {
                string += `,`;
            }
            string += `${sourceObj.length > 1 ? '\n': ''}`;
        }
        string += `${sourceObj.length > 1 ? indent: ''}]`;
    } else if (typeof sourceObj === 'object') {
        function keyFor(key) {
            if (typeof key === 'symbol') {
                return `[Symbol.for('${Symbol.keyFor(key)}')]`;
            }
            return `'${key}'`;
        }
        const keys = Reflect.ownKeys(sourceObj);
        if (keys.length === 0) {
            return `{}`;
        }
        string += `{\n`;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (typeof sourceObj[key] === 'string') {
                string += `${indent + '    '}${keyFor(key)}: '${sourceObj[key]}'`;
            } else if (typeof sourceObj[key] === 'symbol') {
                string += `${indent + '    '}${keyFor(key)}: Symbol.for('${Symbol.keyFor(sourceObj[key])}')`;
            } else if (typeof sourceObj[key] === 'object') {
                string += `${indent + '    '}${keyFor(key)}: ${Translator(sourceObj[key], indent + '    ')}`;
            }
            if (i < keys.length - 1) {
                string += `,`;
            }
            string += `\n`;
        }
        string += `${indent}}`;
    }
    return string;
}