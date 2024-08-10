import postcss from "postcss";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import postcssrc from "postcss-load-config";

const toBuild = {
    'src/styles/main.pcss'              : 'app/css/main.css',

    'src/styles/app.pcss'               : 'app/app.css',
    'src/styles/fonts.pcss'             : 'app/fonts.css',
    'src/styles/graphics.pcss'          : 'app/graphics.css',
    'src/styles/presentation.pcss'      : 'app/presentation.css',
    'src/styles/stageview.pcss'         : 'app/stageview.css',
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
