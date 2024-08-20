import peggy from 'peggy'

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as util from 'node:util'

const GRAMMAR_DIR = path.join(import.meta.dirname, '../grammar');
const INPUT_DIR = path.join(import.meta.dirname, '../input');

const inputFiles = fs.readdirSync(INPUT_DIR, { recursive: true, encoding: 'utf-8' });
const grammarFiles = fs.readdirSync(GRAMMAR_DIR, { recursive: true, encoding: 'utf-8' });

const grammar = [];

for (const file of grammarFiles) {
    const ext = path.extname(file);

    if (ext === '.peggy') {
        const filename = path.join(GRAMMAR_DIR, file);
        const text = fs.readFileSync(filename, { encoding: 'utf-8' });
        grammar.push({ source: file, text });
    }
}

const inputs = [];

for (const file of inputFiles) {
    const ext = path.extname(file);

    if (ext === '.as') {
        const filename = path.join(INPUT_DIR, file);

        const pkg = path.dirname(file).split(path.sep).join('.');

        const text = fs.readFileSync(filename, { encoding: 'utf-8' });

        inputs.push({ file, text, package: pkg });
    }
}

const parser = peggy.generate(grammar);

for (const { file, text, package: pkg } of inputs) {
    const result = parser.parse(text, {
        startRule: 'Program',
        // peg$library: true,
    });

    console.log('AST:', util.inspect(result, {
        depth: null,
        colors: true,
    }));
}