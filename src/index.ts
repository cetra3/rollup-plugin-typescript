import { createFilter } from 'rollup-pluginutils';
import * as ts from 'typescript';
import assign from 'object-assign';

interface IncludeExclude {
    exclude?: string | string[];
    include?: string | string[];
}

export default function typescript(options: IncludeExclude & ts.CompilerOptions) {
    options = assign({}, options || {});

    var filter = createFilter(options.include, options.exclude);
    delete options.include;
    delete options.exclude;

    return {
        transform(code: string, id: string) {
            if (!filter(id)) return null;

            var transformed = ts.transpileModule(code, {
                compilerOptions: assign({
                    target: ts.ScriptTarget.ES5,
                    module: ts.ModuleKind.ES6,
                    sourceMap: true
                }, options)
            });

            if (transformed.diagnostics) {
                transformed.diagnostics.forEach(diagnostic => {
                    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                });
            }

            return {
                code: transformed.outputText,
                // Rollup expects an object so we must parse the string
                map: JSON.parse(transformed.sourceMapText)
            };
        }
    };
}
