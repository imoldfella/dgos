import { Schema } from "./data";

export class SchemaMgr {
    constructor(public schema: Schema) {
    }
}

// although each branch has their own log, updates are serialized into a single log.
// export class BranchMgr {
//     constructor(
//         public db: Dbms,
//         public branch: Branch,
//         public schema: SchemaMgr
//     ) { }
// }