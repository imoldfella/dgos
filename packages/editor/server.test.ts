import { parser } from "./server"
import { test, expect } from "vitest"

test("renders an empty doc", () => {
  const ast = parser.parse("");

  expect(ast.toJSON()).toEqual({
    content: [{ type: "paragraph" }],
    type: "doc",
  });



});
