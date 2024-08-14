import * as fs from "node:fs";
import * as path from "node:path";
import Handlebars from "handlebars";
import pug from "pug";
import ejs from "ejs";

const compilers = {
    ['.pug'](filename, context) {
        return pug.renderFile(filename, context);
    },
    ['.hbs'](filename, context) {
        const template = fs.readFileSync(filename, 'utf-8');

        return Handlebars.compile(template)(context);
    },
    ['.ejs'](filename, context) {
        const template = fs.readFileSync(filename, 'utf-8');

        return ejs.compile(template)(context);
    },
}

/** @type {Record<string, string>} */
const pathMap = {
    'views'          : '.air/views',
}

const contextMap = new Map([
    ['help', {
        app: {
            name: 'ReVerseVIEW',
            version: '8.5.0',
            website: {
                text: "reverseview.github.io",
                url : "https://reverseview.github.io"
            },
        },
        runtime: {
            name: 'Adobe Air',
            version: /*air.NativeApplication.nativeApplication.runtimeVersion*/ '32',
        },
    }],
]);

for (const [from, to] of Object.entries(pathMap)) {
    const files = fs.readdirSync(from, { recursive: true, encoding: 'utf-8' });
    const validExtensions = Object.keys(compilers);

    for (const file of files) {
        const ext = path.extname(file);

        if (!validExtensions.includes(ext)) {
            continue;
        }

        const basename = path.basename(file, ext);

        const tplFilename = path.join(from, file);
        const outFilename = path.join(to, `${basename}.html`);

        fs.mkdirSync(path.dirname(outFilename), { recursive: true });

        const html = compilers[ext](tplFilename, contextMap.get(basename) || {});

        fs.writeFileSync(outFilename, html);
    }
}