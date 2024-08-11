import postcss from "postcss";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import postcssrc from "postcss-load-config";

const toBuild = {
    'styles/app.pcss'               : '.air/css/app.css',
    'styles/main.pcss'              : '.air/css/main.css',
    'styles/fonts.pcss'             : '.air/css/fonts.css',
    'styles/graphics.pcss'          : '.air/css/graphics.css',

    'styles/stageview.pcss'         : '.air/css/stageview.css',
    'styles/presentation.pcss'      : '.air/css/presentation.css',
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
