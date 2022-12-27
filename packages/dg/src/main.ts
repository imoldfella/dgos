import { compile } from './compile'
import * as ts from "typescript";
import tsvfs from '@typescript/vfs'
import fs from 'fs'
import { TextDecoder } from 'util';




function ex() {
    const fsMap = tsvfs.createDefaultMapFromNodeModules({ target: ts.ScriptTarget.ES2015 })
    fsMap.set('index.ts', 'console.log("Hello World")')
}


function main() {

    const filename = "test.ts";
    const codeb = fs.readFileSync('./album.ts')
    const code = new TextDecoder().decode(codeb)
    //`const test: number = 1 + 2;`;

    const sourceFile = ts.createSourceFile(
        filename, code, ts.ScriptTarget.Latest
    );

    function printRecursiveFrom(
        node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile
    ) {
        const indentation = "-".repeat(indentLevel);
        const syntaxKind = ts.SyntaxKind[node.kind];
        const nodeText = node.getText(sourceFile);
        console.log(`${indentation}${syntaxKind}: ${nodeText}`);

        node.forEachChild(child =>
            printRecursiveFrom(child, indentLevel + 1, sourceFile)
        );
    }

    printRecursiveFrom(sourceFile, 0, sourceFile);
}


const insert = `insert into my_table values (1, 'two')`
const join = `SELECT item.item_no,item_descrip,
invoice.invoice_no,invoice.sold_qty
FROM invoice
FULL OUTER JOIN item
ON invoice.item_no=item.item_no
ORDER BY item_no;
    `
const merge2 = `MERGE INTO wines w
USING (VALUES('Chateau Lafite 2003', '24')) v
ON v.column1 = w.winename
WHEN NOT MATCHED 
  INSERT VALUES(v.column1, v.column2)
WHEN MATCHED
  UPDATE SET stock = stock + v.column2;`

const merge = `MERGE CustomerAccount CA

USING (SELECT CustomerId, TransactionValue, 
       FROM Transactions
       WHERE TransactionId > 35345678) AS T

ON T.CustomerId = CA.CustomerId

WHEN MATCHED 
  UPDATE SET Balance = Balance - TransactionValue

WHEN NOT MATCHED
  INSERT (CustomerId, Balance)
  VALUES (T.CustomerId, T.TransactionValue)`

// this parser is interesting becuase its all typescript, but it won't keep pace with postgresql
//import { parse, parseFirst, Statement, toSql } from 'pgsql-ast-parser';
// function sql() {
//     // parse multiple statements
//     const ast: Statement = parseFirst(merge);
//     console.log(JSON.stringify(ast, null, 2))
//     const sql: string = toSql.statement(ast);
//     console.log(sql)
// }

// this is webassembly 
// newest fork is https://github.com/cybertec-postgresql/pg-query-emscripten
// we should compile for 15
// no merge
import PgQuery from 'pg-query-emscripten';
function sql2() {
    const ast = PgQuery.parse(join)
    console.log(JSON.stringify(ast, null, 2))
    const sql = PgQuery.deparse(ast)
    console.log(sql)
}
sql2()

// this is based on postgres, compiled for node only. It's old postgresql
// import { parse as parse2 } from 'pgsql-parser'
// function sql3() {
//     const stmts = parse2(merge);
//     console.log(JSON.stringify(stmts, null, 2))
// }
// sql3()

//main()
