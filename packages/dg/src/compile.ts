import * as ts from "typescript";
import tsvfs from '@typescript/vfs'

// 

export function compile(fileNames: string[], options: ts.CompilerOptions): void {
    let program = ts.createProgram(fileNames, {});
    let emitResult = program.emit();

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}

compile(process.argv.slice(2), {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
})


/* const table = { }
VariableStatement
VariableDeclarationList
VariableDeclaration
Identifier
ObjectLiteralExpression
PropertyAssignment
Identifier
StringLiteral
PropertyAssignment
Identifier
NumericLiteral
*/

// primary(table.id)
// ExpressionStatement
// CallExpression
// Identifier
// PropertyAccessExpression
// Identifier
// Identifier
// PropertyAccessExpression
// Identifier
// Identifier

// function definition #1
// FunctionDeclaration
// ExportKeyword
// Identifier
// Block
// ExpressionStatement
// BinaryExpression
// PropertyAccessExpression
// Identifier
// Identifier
// EqualsEqualsToken
// PropertyAccessExpression
// CallExpression
// Identifier
// Identifier
// QuestionDotToken
// Identifier
// ReturnStatement
// ObjectLiteralExpression
// PropertyAssignment
// Identifier
// PropertyAccessExpression
// Identifier
// Identifier
// PropertyAssignment
// Identifier
// BinaryExpression
// PropertyAccessExpression
// Identifier
// QuestionDotToken
// Identifier
// QuestionQuestionToken
// StringLiteral

// function 2
// VariableStatement
// ExportKeyword
// VariableDeclarationList
// VariableDeclaration
// Identifier
// TypeReference
// Identifier
// ArrowFunction
// Parameter
// Identifier
// TypeLiteral
// PropertySignature
// Identifier
// StringKeyword
// PropertySignature
// Identifier
// NumberKeyword
// EqualsGreaterThanToken
// Block
// ExpressionStatement
// CallExpression
// Identifier
// ArrowFunction
// Parameter
// Identifier
// TypeReference
// Identifier
// EqualsGreaterThanToken
// Block
// ExpressionStatement
// BinaryExpression
// Identifier
// EqualsToken
// Identifier
function transform() {
    const transformerFactory: ts.TransformerFactory<ts.Node> = context => rootNode => {
        function visit(node: ts.Node): ts.Node {
            node = ts.visitEachChild(node, visit, context);
            if (ts.isIdentifier(node))
                return context.factory.createIdentifier(node.text + "suffix");

            return node;
        }
        return ts.visitNode(rootNode, visit);
    };

    const program = ts.createProgram(["album.ts"], {})
    console.log(program.getRootFileNames())

    // PRINTER
    const sourceFile = program.getSourceFile("album.ts")
    const transformationResult = ts.transform(sourceFile!, [transformerFactory])
    const transformedSourceFile = transformationResult.transformed[0];
    const printer = ts.createPrinter();
    const result = printer.printNode(
        ts.EmitHint.Unspecified,
        transformedSourceFile,
        sourceFile!
    );
    console.log(result)

    // EMIT
    program.emit();
}