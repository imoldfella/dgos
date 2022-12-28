"use strict";
exports.__esModule = true;
exports.Foo = void 0;
var jsx_runtime_1 = require("solid-js/jsx-runtime");
function Foo() {
    var x = 2;
    var y = x + 3;
    var s = "hello";
    return (0, jsx_runtime_1.jsxs)("div", { children: [s, y] });
}
exports.Foo = Foo;
