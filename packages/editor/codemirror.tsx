
import { Extension as CmExtension, EditorState as CmEditorState } from "@codemirror/state";
import {EditorView as CmEditorView, keymap as cmkeymap, drawSelection} from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { javascript } from "@codemirror/lang-javascript";
import {defaultKeymap} from "@codemirror/commands"// import {
import { highlightSpecialChars, highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor,
  lineNumbers, highlightActiveLineGutter} from "@codemirror/view"
import {Extension} from "@codemirror/state"
import {defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
  foldGutter, foldKeymap} from "@codemirror/language"
import {history, historyKeymap} from "@codemirror/commands"
import {searchKeymap, highlightSelectionMatches} from "@codemirror/search"
import {autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap} from "@codemirror/autocomplete"
import {lintKeymap} from "@codemirror/lint"


import {exitCode} from "prosemirror-commands"
import {undo, redo} from "prosemirror-history"
import {EditorState, Selection, TextSelection} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser,Node as ProsemirrorNode} from "prosemirror-model"
import {keymap} from "prosemirror-keymap"
import { getSchema } from "./server"

import katex from 'katex'
import vegaEmbed from 'vega-embed'
import yaml from 'yaml'
import {Chart} from 'frappe-charts'
import {Map} from 'maplibre-gl'
import { v4 as uuidv4 } from 'uuid';
import JSON5 from 'json5'

  export class CodeBlockView { 
    cm: CmEditorView
    updating: boolean
    dom: HTMLElement
    nodepm: ProsemirrorNode
    view: EditorView
 
    getPos: ()=>number
    // constructor(component,
    //     opt: { editor, extension, node, view, getPos, decorations }){
    constructor(node: ProsemirrorNode,  view: EditorView,  getPos: ()=>number) {
      //super(component,opt)
      // Store for later
      
      this.nodepm = node
      this.view = view
      this.getPos = getPos
      // Create a CodeMirror instance
      this.cm = new CmEditorView({
        doc: this.nodepm.textContent,
        extensions: [
           lineNumbers(),
           highlightActiveLineGutter(),
           highlightSpecialChars(),
           history(),
           foldGutter(),
           drawSelection(),
           dropCursor(),
           CmEditorState.allowMultipleSelections.of(true),
           indentOnInput(),
          syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
           bracketMatching(),
           closeBrackets(),
          autocompletion(),
          rectangularSelection(),
           crosshairCursor(),
           highlightActiveLine(),
           highlightSelectionMatches(),

           markdown(),
          javascript(),
          oneDarkTheme,
          cmkeymap.of([
            ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
            ...this.codeMirrorKeymap(),
            ...defaultKeymap
          ]),
        ]
      })
  
      var lang = node.attrs['language']
      // The editor's outer node is our DOM representation
      this.dom = document.createElement("div")
      this.dom.className = "cm-wrapper"

      var show = document.createElement("div")
      show.id = uuidv4()
      show.classList.add("cm-show") 
      this.dom.appendChild(show)

      var vjs : string
      const render = ()=>{
        const v = this.cm.state.doc.toString()
        switch(lang) {
            case 'maplibre':
              try {
                var js = JSON5.parse(v);
                js.container = show
                new Map(js)
              } catch(e){
                console.log("map error", e)
              }

              break
            case 'katex':
                katex.render(v, show)
                break;
            case 'frappe':
                 vjs = yaml.parse(v)
                console.log("frappe", vjs)
                new Chart(show,vjs)
                break;
            case 'vega-lite':
                vjs = yaml.parse(v)
                vegaEmbed(show, vjs)
                
                break;
        }
    }
    render()
      this.cm.contentDOM.addEventListener("blur", render)
      this.dom.appendChild(show)
      var caption = document.createElement("div");
      caption.className = 'cm-lang'
      caption.innerText = lang
      this.dom.appendChild(caption)
      this.dom.appendChild(this.cm.dom)
  
      // This flag is used to avoid an update loop between the outer and
      // inner editor
      this.updating = false
      console.log(this)
    }

  // }
  // nodeview_forwardUpdate{
    forwardUpdate(update) {
      if (this.updating || !this.cm.hasFocus) return
      let offset = this.getPos() + 1, {main} = update.state.selection
      let selection = TextSelection.create(this.view.state.doc,
                                           offset + main.from, offset + main.to)
      if (update.docChanged || !this.view.state.selection.eq(selection)) {
        let tr = this.view.state.tr.setSelection(selection)
        update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
          if (text.length)
            tr.replaceWith(offset + fromA, offset + toA,
                           getSchema().text(text.toString()))
          else
            tr.delete(offset + fromA, offset + toA)
          offset += (toB - fromB) - (toA - fromA)
        })
        this.view.dispatch(tr)
      }
    }
  // }
  // nodeview_setSelection{
    setSelection(anchor, head) {
      this.cm.focus()
      this.updating = true
      this.cm.dispatch({selection: {anchor, head}})
      this.updating = false
    }
  // }
  // nodeview_keymap{
    codeMirrorKeymap() {
      let view = this.view
      return [
        {key: "ArrowUp", run: () => this.maybeEscape("line", -1)},
        {key: "ArrowLeft", run: () => this.maybeEscape("char", -1)},
        {key: "ArrowDown", run: () => this.maybeEscape("line", 1)},
        {key: "ArrowRight", run: () => this.maybeEscape("char", 1)},
        {key: "Ctrl-Enter", run: () => {
          if (!exitCode(view.state, view.dispatch)) return false
          view.focus()
          return true
        }},
        {key: "Ctrl-z", mac: "Cmd-z",
         run: () => undo(view.state, view.dispatch)},
        {key: "Shift-Ctrl-z", mac: "Shift-Cmd-z",
         run: () => redo(view.state, view.dispatch)},
        {key: "Ctrl-y", mac: "Cmd-y",
         run: () => redo(view.state, view.dispatch)}
      ]
    }
  
    maybeEscape(unit, dir) {
      let {state} = this.cm
      let {main} = state.selection
      if (!main.empty) return false
      if (unit == "line") {
        //main = state.doc.lineAt(main.head)
      }
      if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
      let targetPos = this.getPos() + (dir < 0 ? 0 : this.nodepm.nodeSize)
      let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
      let tr = this.view.state.tr.setSelection(selection).scrollIntoView()
      this.view.dispatch(tr)
      this.view.focus()
    }
  // }
  // nodeview_update{
    update(node: ProsemirrorNode) {
      if (node.type != this.nodepm.type) return false
      this.nodepm = node
      if (this.updating) return true
      let newText = node.textContent, curText = this.cm.state.doc.toString()
      if (newText != curText) {
        let start = 0, curEnd = curText.length, newEnd = newText.length
        while (start < curEnd &&
               curText.charCodeAt(start) == newText.charCodeAt(start)) {
          ++start
        }
        while (curEnd > start && newEnd > start &&
               curText.charCodeAt(curEnd - 1) == newText.charCodeAt(newEnd - 1)) {
          curEnd--
          newEnd--
        }
        this.updating = true
        this.cm.dispatch({
          changes: {
            from: start, to: curEnd,
            insert: newText.slice(start, newEnd)
          }
        })
        this.updating = false
      }
      return true
    }
  // }
  // nodeview_end{
  
    selectNode() { this.cm.focus() }
    stopEvent() { return true }
  }
  // }
  // arrowHandlers{
  
  
  function arrowHandler(dir) {
    return (state, dispatch, view) => {
      if (state.selection.empty && view.endOfTextblock(dir)) {
        let side = dir == "left" || dir == "up" ? -1 : 1
        let $head = state.selection.$head
        let nextPos = Selection.near(
          state.doc.resolve(side > 0 ? $head.after() : $head.before()), side)
        if (nextPos.$head && nextPos.$head.parent.type.name == "math_block") {
          dispatch(state.tr.setSelection(nextPos))
          return true
        }
      }
      return false
    }
  }
  
  const arrowHandlers = keymap({
    ArrowLeft: arrowHandler("left"),
    ArrowRight: arrowHandler("right"),
    ArrowUp: arrowHandler("up"),
    ArrowDown: arrowHandler("down")
  })
  
  /*
  import {EditorState, Selection, TextSelection} from "prosemirror-state"
  import {EditorView} from "prosemirror-view"
  import {DOMParser} from "prosemirror-model"
  import {exampleSetup} from "prosemirror-example-setup"
  
  window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
      plugins: exampleSetup({schema}).concat(arrowHandlers)
    }),
    nodeViews: {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}
  })
  */

 
import {HighlightStyle} from "@codemirror/language"
import {tags as t} from "@lezer/highlight"

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#FFFFFF", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd",
  darkBackground = "#21252b",
  highlightBackground = "#2c313a",
  background = "#282c34",
  tooltipBackground = "#353a42",
  selection = "#3E4451",
  cursor = "#528bff"

/// The colors used in the theme, as CSS color strings.
export const color = {
  chalky,
  coral,
  cyan,
  invalid,
  ivory,
  stone,
  malibu,
  sage,
  whiskey,
  violet,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor
}

/// The editor theme styles for One Dark.
export const oneDarkTheme = CmEditorView.theme({
  "&": {
    color: ivory,
    backgroundColor: background
  },

  ".cm-content": {
    caretColor: cursor
  },

  ".cm-cursor, .cm-dropCursor": {borderLeftColor: cursor},
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {backgroundColor: selection},

  ".cm-panels": {backgroundColor: darkBackground, color: ivory},
  ".cm-panels.cm-panels-top": {borderBottom: "2px solid black"},
  ".cm-panels.cm-panels-bottom": {borderTop: "2px solid black"},

  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },

  ".cm-activeLine": {backgroundColor: "#6699ff0b"},
  ".cm-selectionMatch": {backgroundColor: "#aafe661a"},

  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #515a6b"
  },

  ".cm-gutters": {
    backgroundColor: background,
    color: stone,
    border: "none"
  },

  ".cm-activeLineGutter": {
    backgroundColor: highlightBackground
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "none",
    backgroundColor: tooltipBackground
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: tooltipBackground,
    borderBottomColor: tooltipBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: highlightBackground,
      color: ivory
    }
  }
}, {dark: true})

/// The highlighting style for code in the One Dark theme.
export const oneDarkHighlightStyle = HighlightStyle.define([
  {tag: t.keyword,
   color: violet},
  {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
   color: coral},
  {tag: [t.function(t.variableName), t.labelName],
   color: malibu},
  {tag: [t.color, t.constant(t.name), t.standard(t.name)],
   color: whiskey},
  {tag: [t.definition(t.name), t.separator],
   color: ivory},
  {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
   color: chalky},
  {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
   color: cyan},
  {tag: [t.meta, t.comment],
   color: stone},
  {tag: t.strong,
   fontWeight: "bold"},
  {tag: t.emphasis,
   fontStyle: "italic"},
  {tag: t.strikethrough,
   textDecoration: "line-through"},
  {tag: t.link,
   color: stone,
   textDecoration: "underline"},
  {tag: t.heading,
   fontWeight: "bold",
   color: coral},
  {tag: [t.atom, t.bool, t.special(t.variableName)],
   color: whiskey },
  {tag: [t.processingInstruction, t.string, t.inserted],
   color: sage},
  {tag: t.invalid,
   color: invalid},
])

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
