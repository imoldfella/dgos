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
exports.albumSchema = exports.updateActor = exports.viewOver42b = exports.outerJoin = exports.lateralJoin = exports.viewOver = exports.adopt = exports.rebase = exports.createTag = exports.createBranch = exports.revoke = exports.grant = exports.createGroup = exports.updateBudget = exports.updateBio = void 0;
var jsx_runtime_1 = require("solid-js/jsx-runtime");
/* @jsxImportSource solid-js */
var db_1 = require("../../dgos/src/dglib/db");
// JSX is a mess https://github.com/microsoft/TypeScript/issues/41813
/* tslint:disable:7026 */
var artists = {
    name: "",
    age: 0,
    bio: db_1.emptyText,
    budget: db_1.emptySheet,
    hype: db_1.emptyPresent
};
(0, db_1.primary)(artists.name);
var album = {
    name: "",
    artist: ""
};
(0, db_1.primary)(album.name);
var sold = {
    name: "",
    count: 0
};
(0, db_1.primary)(album.name);
// we can incrementally modify arrays and use tsx. Updates automatically rebase, or disable with commit({rebase: false})
function updateBio() {
    var el = (0, jsx_runtime_1.jsx)("em", { children: "STAR!!" });
    (0, db_1.update)(function (x) {
        if (x.rowid == BigInt(0)) {
            x.data.splice(100, 1, el);
        }
    });
}
exports.updateBio = updateBio;
// a spreadsheet is 
// create table sscell (doc,col,row,value)
// create table ssdoc (doc,row[],col[],sheet[],meta1,...)
function updateBudget() {
    // inserting a sheet, row, or column will allocate a new id locally that will be converted to a global id on the server
    // normal insertion for the value, and ordered insertion for the position.
}
exports.updateBudget = updateBudget;
// tql supports row level security, and a easy to use template called concierge 
// each table by default has a groupid attribute for row level security.
// createGroup assigns the next available id.
// id 0 can access all the rows, each
function createGroup(name) {
}
exports.createGroup = createGroup;
function grant(group, priv, to) {
}
exports.grant = grant;
function revoke(group, priv, to) {
}
exports.revoke = revoke;
// tql supports branching, tagging, and adoption
// a branch is a logical copy of the database, unlike a group it can have its own modified schema and security
function createBranch(name) { }
exports.createBranch = createBranch;
function createTag(name) { }
exports.createTag = createTag;
// merge local changes on top of changes from the source
function rebase(from) { }
exports.rebase = rebase;
// like a cherry pick; makes this branch identical to the source
function adopt(from) { }
exports.adopt = adopt;
function viewOver(age) {
    var a = artists; // creates dependenciey on 
    (0, db_1.limit)(100);
    (0, db_1.where)(a.age > age);
    (0, db_1.sort)(a.name);
    return {
        name: a.name,
        age: a.age
    };
}
exports.viewOver = viewOver;
// top 3 albums for each artist
function lateralJoin() {
    artists.name == album.artist;
    var s = (0, db_1.lateral)(function () {
        sold.name == album.name;
        (0, db_1.limit)(3);
        (0, db_1.sort)(sold.count);
        return sold;
    });
    return {
        name: artists.name,
        album: album.name,
        count: sold.count
    };
}
exports.lateralJoin = lateralJoin;
// all artists and albums
function outerJoin() {
    var _a, _b;
    artists.name == ((_a = (0, db_1.outer)(album)) === null || _a === void 0 ? void 0 : _a.artist);
    return {
        name: artists.name,
        album: (_b = album === null || album === void 0 ? void 0 : album.name) !== null && _b !== void 0 ? _b : "not recorded"
    };
}
exports.outerJoin = outerJoin;
// outer
//let b = outer(artists)
function viewOver42b(n, y) {
    var a = viewOver(42); // creates dependenciey on 
    (0, db_1.limit)(n);
    (0, db_1.where)(a.age < 62);
    (0, db_1.sort)(a.name);
    return {
        name: a.name,
        age: a.age
    };
}
exports.viewOver42b = viewOver42b;
// returns object so that can be updated on successful commit
var updateActor = function (props) {
    (0, db_1.insert)(function (x) {
        x = __assign(__assign({}, x), props);
    });
    (0, db_1.update)(function (x) {
        if (x.age > 42) {
            x.name = "tim";
        }
    });
    (0, db_1.remove)(function (x) { return x.age < 32; });
    var updated = (0, db_1.merge)(function (x, y, matched) {
        if (x.name == y.name) { // on condition
            // if matched is false, x will be defaults
            if (matched) {
                x.name = y.name; // y and x
            }
            else {
                x.name = y.name; // y but no x
            }
        }
        else {
            // here we have x, but not y
            (0, db_1.drop)();
        }
    });
    return {
        updated: updated
    };
};
exports.updateActor = updateActor;
// by default resolve schema differences automatically. allow override
// default export? optional argument for manual resolution of upgrades.
exports.albumSchema = {
    artists: artists,
    viewOver: viewOver,
    viewOver42b: viewOver42b,
    updateActor: exports.updateActor,
    outerJoin: outerJoin
};
