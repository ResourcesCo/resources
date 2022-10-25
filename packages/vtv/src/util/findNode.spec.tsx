import { describe, expect, it, beforeEach } from 'vitest'
import React, { useState } from "react"
import { render, screen, cleanup, prettyDOM } from "@testing-library/react"

import View from '../View'
import findNode from './findNode'

import { NODE_NAME_CLASS, ROOT_CLASS } from './constants'

function innerText(node: Element | undefined | null) {
  return node instanceof HTMLElement ? node.innerText : ''
}

describe("View", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should find a node", () => {
    const { container } = render(
      <View
        name="root"
        onChange={() => {}}
        onAction={() => {}}
        onPickId={() => {}}
        value={{
          "a": {
            "b": "c",
            "d": "e",
          }
        }}
        state={{
          _expanded: true,
          a: {
            _expanded: true
          }
        }}
        theme="dark"
      />
    )
    const nodes = [...container.querySelectorAll(`.${NODE_NAME_CLASS}`)]
    const rootEl = container.querySelector(`.${ROOT_CLASS}`) as HTMLElement
    const aEl = nodes.find(node => innerText(node) == 'a')
    const bEl = nodes.find(node => innerText(node) == 'b')
    const aDownResult = findNode(rootEl, aEl, 'ArrowDown')
    expect(innerText(aDownResult.querySelector(`.${NODE_NAME_CLASS}`))).toEqual('b')
  })
})