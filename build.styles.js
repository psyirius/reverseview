import postcss from "postcss";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import postcssrc from "postcss-load-config";

const toBuild = {
    'src/app/main.pcss': 'app/css/app.main.css',
}

/** @type {import('postcss-load-config').ConfigContext} */
const ctx = {
    map: 'inline',
    env: (process.env.NODE_ENV || 'development').toLowerCase().trim(),
}

postcssrc(ctx).then(({ plugins, options }) => {
    const processor = postcss(plugins);

    for (const [from, to] of Object.entries(toBuild)) {
        const css = fs.readFileSync(from, 'utf-8');

        processor.process(css, { from, to }).then(result => {
            fs.mkdirSync(path.dirname(to), { recursive: true });
            fs.writeFileSync(to, result.css);
        })
    }
})
