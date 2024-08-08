import postcss_import from "postcss-import";
import autoprefixer from "autoprefixer";
import postcss_nested from "postcss-nested";
import postcss_alias from "postcss-alias";
import postcss_preset_env from "postcss-preset-env";
import stylelint from "stylelint";
import styleLintConfig from "./.stylelintrc.js";

import cssnano from "cssnano";

/** @type {import('postcss-load-config').Config} */
const config = {
    map: false,
    plugins: [
        postcss_import,
        autoprefixer,
        postcss_nested,
        postcss_alias,
        postcss_preset_env({
            stage: 0,
            features: {
                'custom-properties': false, // Disable custom properties support if not needed
            },
        }),
        stylelint(styleLintConfig),
        // cssnano,
    ]
}

export default config