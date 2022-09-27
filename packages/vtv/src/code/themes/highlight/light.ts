// Based on https://github.com/codemirror/highlight
// Copyright (C) 2018-2021 by Marijn Haverbeke <marijnh@gmail.com> and others
// MIT License: https://github.com/codemirror/highlight/blob/main/LICENSE

import {HighlightStyle} from "@codemirror/language"
import {tags as t} from "@lezer/highlight"

export default HighlightStyle.define([
  {tag: t.link,
   textDecoration: "underline"},
  {tag: t.heading,
   textDecoration: "underline",
   fontWeight: "bold"},
  {tag: t.emphasis,
   fontStyle: "italic"},
  {tag: t.strong,
   fontWeight: "bold"},
  {tag: t.keyword,
   color: "#708"},
  {tag: [t.atom, t.bool, t.url, t.contentSeparator, t.labelName],
   color: "#219"},
  {tag: [t.literal, t.inserted],
   color: "#164"},
  {tag: [t.string, t.deleted],
   color: "#a11"},
  {tag: [t.regexp, t.escape, t.special(t.string)],
   color: "#e40"},
  {tag: t.definition(t.variableName),
   color: "#00f"},
  {tag: t.local(t.variableName),
   color: "#30a"},
  {tag: [t.typeName, t.namespace],
   color: "#085"},
  {tag: t.className,
   color: "#167"},
  {tag: [t.special(t.variableName), t.macroName, t.local(t.variableName)],
   color: "#256"},
  {tag: t.definition(t.propertyName),
   color: "#00c"},
  {tag: t.comment,
   color: "#940"},
  {tag: t.meta,
   color: "#7a757a"},
  {tag: t.invalid,
   color: "#f00"}
])