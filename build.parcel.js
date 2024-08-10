import { Parcel } from '@parcel/core';

// parcel build src/app/index.html

const bundler = new Parcel({
    entries: [
        'src/app/index.html',
    ],
    defaultConfig: '@parcel/config-default',
    mode: 'development',
    cacheDir: '.cache',
    defaultTargetOptions: {
        engines: {
            browsers: [
                'IE 10'
            ]
        }
    }
});

try {
    let {bundleGraph, buildTime} = await bundler.run();
    let bundles = bundleGraph.getBundles();
    console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
} catch (err) {
    console.log(err.diagnostics);
}