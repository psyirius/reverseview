import * as path from "node:path";
import * as fs from "node:fs";
import YUI from "yui";

const Y = YUI();

//Create the loader instance
const loader = new Y.Loader({
    // Set up the base path that your YUI files live in
    base: path.join(__dirname, './node_modules/yui/'),
    // Ignore all registered modules
    ignoreRegistered: true,
    // require node
    require: ['node']
});

// Resolve these file (passing true calculates the dependencies for you)
const out = loader.resolve(true);

const str = [];

//Now walk the list of resolved files
out.js.forEach(function(file) {
    //Read the files
    str.push(fs.readFileSync(file, 'utf8'));
});

// Write all the files out into a single file
fs.writeFileSync('./combined.js', str.join('\n'), 'utf8');