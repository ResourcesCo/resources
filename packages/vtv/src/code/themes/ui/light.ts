import {EditorView} from "@codemirror/view"

// Based on https://github.com/codemirror/theme-one-dark
// Copyright (C) 2018-2021 by Marijn Haverbeke <marijnh@gmail.com> and others
// MIT License: https://github.com/codemirror/theme-one-dark/blob/main/LICENSE

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const foreground = "#403f53",
  background = "#e0e0e0",
  darkBackground = "#bbb",
  highlightBackground = "#339cec44",
  selection = "#339cec33",
  cursor = "#528bff"

export const lightTheme = EditorView.theme({
  "&": {
    color: foreground,
    backgroundColor: background
  },

  "&.cm-editor.cm-focused": {outline: 'none'},

  ".cm-content": {
    caretColor: cursor
  },

  ".cm-cursor, .cm-dropCursor": {borderLeftColor: cursor},
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {backgroundColor: selection},

  ".cm-panels": {backgroundColor: background, color: foreground},
  ".cm-panels.cm-panels-top": {borderBottom: "2px solid black"},
  ".cm-panels.cm-panels-bottom": {borderTop: "2px solid black"},

  ".cm-searchMatch": {
    backgroundColor: "#339cec33",
    outline: "1px solid #d9d9d9"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#339cec33"
  },

  ".cm-activeLine": {backgroundColor: "#ddd"},
  ".cm-selectionMatch": {backgroundColor: "#aafe661a"},

  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #515a6b"
  },

  ".cm-gutters": {
    backgroundColor: background,
    color: "#545868",
    border: "none"
  },
  "$gutterElement.lineNumber": {color: "inherit"},

  ".cm-activeLineGutter": {
    backgroundColor: highlightBackground
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "1px solid #181a1f",
    backgroundColor: darkBackground
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: darkBackground,
    borderBottomColor: darkBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: highlightBackground,
      color: foreground
    }
  }
}, {dark: false})

export default lightTheme
