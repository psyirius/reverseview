import * as path from "node:path";
import * as process from "node:process";
import { Command, Option } from "commander";
import ts from "typescript";

const prog = new Command();

prog
    .name('build.src')
    .version('0.0.0')
    .description('Air JS/TS Builder');
prog.addOption(
    new Option('-p, --project <tsconfig>', 'choose a tsconfig')
)
// UNUSED
prog.addOption(
    new Option('-tr, --trace-resolution', 'trace module resolution')
)

prog.parse(process.argv);

const options = prog.opts();

const configPath = path.join(
    process.cwd(),
    options.project ?? "tsconfig.json",
);

// Read the tsconfig file
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

// Parse the JSON content of the tsconfig file
const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
);

const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const emitResult = program.emit();

// program.getSourceFiles().forEach(sourceFile => {
//     console.log(sourceFile.fileName);
// });

// Get any diagnostics (errors/warnings) during the compilation
const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
        console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
});

process.exit(emitResult.emitSkipped ? 1 : 0);

