import { Statement } from '../data'
import { DbmsSvr, StatementSvr } from './server'

// this should be bundled separately? or just depend on tree shaking?
export class Compiler {
    constructor(public dbms: DbmsSvr) {

    }
    async exec(sql: string): Promise<boolean> {
        const a = await this.prepare(sql)
        const tx = await this.dbms.begin()
        a.exec(tx)
        return tx.commit()
    }

    // we need an interface that we can return through the proxy

    async prepare<P, T>(sql: string): Promise<Statement<P, T>> {
        // we can't
        return new StatementSvr<P, T>()
    }

}