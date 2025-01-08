const COLORS = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    reset: "\x1b[0m",
};

function colorize(str: string, color: string): string {
    return [color, str, COLORS.reset].join("");
}

function isNull(value: any): value is null {
    return value === null;
}

function isUndefined(value: any): value is undefined {
    return value === undefined;
}

function isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
}

function isDate(value: any): value is Date {
    return value instanceof Date;
}

function isFunction(value: any): value is Function {
    return typeof value === 'function';
}

function isAnonymousFunction(value: any): value is Function {
    return isFunction(value) && value.name === "";
}

function isPlainObject(value: any): value is object {
    return value !== null && typeof value === 'object' && value.constructor === Object;
}

function isArray(value: any): value is any[] {
    return Array.isArray(value);
}

function isNumber(value: any): value is number {
    return typeof value === 'number';
}

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isSymbol(value: any): value is symbol {
    return typeof value === 'symbol';
}

function repeatString(str: string, num: number): string {
    let result = "";
    for (let i = 0; i < num; i++) {
        result += str;
    }
    return result;
}

function objectToString(obj: any, indent = 0): string {
    // null
    if (isNull(obj)) {
        return colorize("null", COLORS.gray);
    }

    // undefined
    if (isUndefined(obj)) {
        return colorize("undefined", COLORS.gray);
    }

    // boolean
    if (isBoolean(obj)) {
        return colorize(String(obj), COLORS.yellow);
    }

    // function
    if (isFunction(obj)) {
        if (isAnonymousFunction(obj)) {
            return colorize("[Function (anonymous)]", COLORS.blue);
        }

        return colorize(`[Function: ${obj.name}]`, COLORS.blue);
    }

    // date
    if (isDate(obj)) {
        return colorize(obj.toISOString(), COLORS.magenta);
    }

    // array
    if (isArray(obj)) {
        const indentStr = repeatString('  ', indent);

        const lines: string[] = [
            '[',
        ];

        for (let j = 0; j < obj.length; j++) {
            let value = obj[j];
            let valueStr: string;

            switch (typeof value) {
                case 'string': valueStr = colorize(`"${value}"`, COLORS.green); break;
                case 'number': valueStr = colorize(String(value), COLORS.yellow); break;

                case 'object':
                default: valueStr = objectToString(value, indent + 1); break;
            }

            let output = `${indentStr}  ${valueStr}`;

            output += (j < obj.length - 1) ? ',' : '';

            lines.push(output);
        }

        lines.push(indentStr + ']');

        return lines.join('\n');
    }

    // non-plain object
    if ((typeof obj.toString === 'function') && (obj.toString() !== '[object Object]')) {
        return obj.toString();
    }

    // plain object
    {
        const indentStr = repeatString('  ', indent);

        const lines: string[] = [
            '{',
        ];

        const keys: string[] = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        for (let j = 0; j < keys.length; j++) {
            const k = keys[j];

            let value = obj[k as keyof typeof obj];
            let valueStr: string;

            switch (typeof value) {
                case 'string': valueStr = colorize(`"${value}"`, COLORS.green); break;
                case 'number': valueStr = colorize(String(value), COLORS.yellow); break;

                case 'object':
                default: valueStr = objectToString(value, indent + 1); break;
            }

            let output = `${indentStr}  ${k}: ${valueStr}`;

            output += (j < keys.length - 1) ? ',' : '';

            lines.push(output);
        }

        lines.push(indentStr + '}');

        return lines.join('\n');
    }
}

function polyfillLog(outputLog: (val: string) => void, ...args: any[]): void {
    outputLog(
        args
            .map((arg) => objectToString(arg))
            .join(" ")
    );
}

export {
    polyfillLog,
};