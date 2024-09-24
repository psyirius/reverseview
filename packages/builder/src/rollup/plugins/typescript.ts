import {Plugin} from "rollup";
import typescript, {RollupTypescriptOptions as BaseOptions} from '@rollup/plugin-typescript'
import { createFilter } from '@rollup/pluginutils';
import {fileURLToPath} from "node:url";
import resolve from "resolve";

type RollupTypescriptOptions = BaseOptions & {

}

export default function plugin(options?: RollupTypescriptOptions): Plugin {
    // @ts-ignore
    if (options) {
        options.tslib = resolve.sync('tslib/tslib.es6.mjs');
    }

    const impl = typescript(options);

    return {
        ...impl,

        // name: 'typescript',
        // version: '0.0.0',

        // async buildStart(options) {
        //     console.log('BuildStart:', options);
        //     return (impl.buildStart as Function).apply(this, arguments);
        // },
        // async resolveId(id) {
        //     const result = await (impl.resolveId as Function).apply(this, arguments);
        //     console.log('Resolve:', id, result);
        //     return result;
        // },
        // async resolveDynamicImport(specifier, importer) {
        //     const result = await (impl.resolveDynamicImport as Function).apply(this, arguments);
        //     console.log('ResolveDynamicImport:', specifier, importer, result);
        //     return result;
        // },
        // async load(id) {
        //     const result = await (impl.load as Function).apply(this, arguments);
        //     console.log('Load:', id, result);
        //     return result;
        // },
        // async moduleParsed(info) {
        //     console.log('Parsed:', info);
        //     return (impl.moduleParsed as Function)?.apply(this, arguments);
        // },
        // async transform(code, id) {
        //     const result = await (impl.transform as Function)?.apply(this, arguments);
        //     console.log('Transform:', { id, code }, result);
        //     return result;
        // },
    };
}