"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.slidePart = exports.presentPart = exports.textPart = exports.sscell = exports.sspart = exports.dir = exports.doc = exports.txhistory = exports.snapshot = exports.tupleHistory = exports.sys = exports.duid = exports.emptySheet = exports.emptyPresent = exports.emptyText = exports.z64 = exports.emptyArray64 = exports.Markdown = exports.schema = exports.emptyCell = exports.emptyRichText = exports.lateral = exports.outer = exports.useDb = exports.createDb = exports.$in = exports.group = exports.sort = exports.where = exports.limit = exports.all = exports.count = exports.createView = exports.defineSchema = exports.drop = exports.merge = exports.remove = exports.update = exports.insert = exports.index = exports.dictionary = exports.primary = exports.defineTable = exports.defineTable2 = exports.Table2 = exports.useQuery = void 0;
function useQuery(a) {
    // when executing the query we can record the parameters it uses.
    return a(1);
}
exports.useQuery = useQuery;
var Table2 = /** @class */ (function () {
    function Table2() {
    }
    return Table2;
}());
exports.Table2 = Table2;
function defineTable2(opt) {
    return [{}, {}, {}];
}
exports.defineTable2 = defineTable2;
function defineTable(fn) {
    return {};
}
exports.defineTable = defineTable;
function primary() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
}
exports.primary = primary;
function dictionary() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
}
exports.dictionary = dictionary;
function index() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
}
exports.index = index;
// one advantage of keeping this a function is that it can be reactive; if the database changes its schema, the local database can know to recompile
// how would we write an app that can read a general database though? this might not be possible on the web, but seems useful. could just use empty schema which is compatible with everything. 
function insert(fn) {
}
exports.insert = insert;
function update(fn) {
}
exports.update = update;
function remove(fn) {
}
exports.remove = remove;
function merge(fn) {
}
exports.merge = merge;
function drop() { }
exports.drop = drop;
function defineSchema(a, opt) {
    return function () { return a; };
}
exports.defineSchema = defineSchema;
function createView(fn) {
    return fn;
}
exports.createView = createView;
function count() { return {}; }
exports.count = count;
function all() { return {}; }
exports.all = all;
function limit(x) { }
exports.limit = limit;
function where(x) { }
exports.where = where;
function sort(x) { }
exports.sort = sort;
function group(x) { }
exports.group = group;
function $in(x, y) { return true; }
exports.$in = $in;
function createDb(d) {
}
exports.createDb = createDb;
function useDb(worker, dbs) {
}
exports.useDb = useDb;
// const artists = defineTable<{
//     name: string,
//     age: number
// }>((t) => {
//     primary(t.name)
// })
function outer(x) {
    return x;
}
exports.outer = outer;
function lateral(fn) {
}
exports.lateral = lateral;
exports.emptyRichText = [];
exports.emptyCell = [];
function schema(a, b) { }
exports.schema = schema;
exports.Markdown = "";
exports.emptyArray64 = new BigInt64Array(0);
exports.z64 = BigInt(0);
// these are references to 
exports.emptyText = BigInt(0);
exports.emptyPresent = BigInt(0);
exports.emptySheet = BigInt(0);
exports.duid = exports.z64;
// we support an extensible concept of documents in the database including an overall file system per group that holds all the files that group can read. Each user can view this as a single file system where the top level folders are the groups the user belongs to.
exports.sys = {
    gid: exports.z64,
    rowid: exports.z64
};
// redundant with tuple history, but arguably pulling the history of a value is more useful than pulling the history of entire group.
exports.tupleHistory = {
    modifiesRowid: exports.z64,
    txid: exports.z64,
    proc: "",
    props: Uint8Array
};
dictionary(exports.tupleHistory.proc);
primary(exports.tupleHistory.modifiesRowid, exports.tupleHistory.txid);
primary(exports.z64);
exports.snapshot = {
    txid: exports.z64 // time associated with snapshot.
};
exports.txhistory = {
    txid: exports.z64,
    recorded: exports.z64,
    device: exports.z64,
    modifiedRowid: exports.emptyArray64
};
// uses the rowid for a primary key.
exports.doc = {
    createdTx: 0,
    name: "untitled",
    main: exports.z64,
    type: ""
};
// 
exports.dir = __assign(__assign({}, exports.sys), { npath: 0, path: "", doc: exports.z64, modified: exports.z64 });
primary(exports.dir.gid, exports.dir.rowid);
index(exports.dir.gid, exports.dir.npath, exports.dir.path);
exports.sspart = __assign(__assign({}, exports.sys), { row: exports.emptyArray64, col: exports.emptyArray64, sheet: exports.emptyArray64 });
// maybe we should use a single hilbert numbering system here?
exports.sscell = {
    sheet: 0, col: 0, row: 0, cellType: 0, cellValue: exports.emptyCell
};
exports.textPart = __assign(__assign({}, exports.sys), { data: [] });
exports.presentPart = __assign(__assign({}, exports.sys), { slide: exports.emptyArray64 });
exports.slidePart = {
    partOf: exports.z64,
    present: []
};
