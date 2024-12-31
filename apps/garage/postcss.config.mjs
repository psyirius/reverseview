import autoprefixer from 'autoprefixer'
import prettify from 'postcss-prettify'
import UnoCSS from '@unocss/postcss'
import variables from 'postcss-css-variables'
import postcssSass from "@csstools/postcss-sass";
import presetEnv from "postcss-preset-env";

export default {
    parser: postcssSass.parser,
    plugins: [
        UnoCSS(),
        variables(),
        presetEnv({
            autoprefixer: {
                // remove: false,
                overrideBrowserslist: ['Safari 5'],
            },
        }),
        prettify(),
    ],
}