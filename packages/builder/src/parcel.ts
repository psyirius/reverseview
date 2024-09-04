import { Parcel } from '@parcel/core';

// TODO: too much boilerplate and too complex
(async () => {
    let bundler = new Parcel({
        entries: 'input/app.ts',
        defaultConfig: '@rvw/parcel-config',
        defaultTargetOptions: {
            engines: {
                browsers: ['IE 8'],
            },
        }
    });

    try {
        let {bundleGraph, buildTime} = await bundler.run();
        let bundles = bundleGraph.getBundles();
        console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
    } catch (err) {
        console.error(err);
    }
})();