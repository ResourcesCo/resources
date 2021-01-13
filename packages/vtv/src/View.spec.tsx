import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import View from "./View";

describe("View", () => {
  it("should render with dark theme", () => {
    const { container } = render(
      <View
        name="root"
        onChange={() => {}}
        onAction={() => {}}
        onPickId={() => {}}
        value={{}}
        state={{}}
        theme="dark"
      />
    );
    expect(container.querySelector('.vtv-theme-dark')).toBeTruthy();
    expect(container.querySelector('.vtv-theme-light')).toBeFalsy();
  });

  it("should render with light theme", () => {
    const { container } = render(
      <View
        name="root"
        onChange={() => {}}
        onAction={() => {}}
        onPickId={() => {}}
        value={{}}
        state={{}}
        theme="light"
      />
    );
    expect(container.querySelector('.vtv-theme-light')).toBeTruthy();
    expect(container.querySelector('.vtv-theme-dark')).toBeFalsy();
  });

  it("should contain text", () => {
    const { baseElement } = render(
      <View
        name="root"
        onChange={() => {}}
        onAction={() => {}}
        onPickId={() => {}}
        value={'hello'}
        state={{}}
        theme="dark"
      />
    );
    const el = screen.getByText('hello');
    expect(el).toBeTruthy();
  });

  function ExampleView(initialState) {
    const [viewData, setViewData] = useState(initialState)
    const {name, value, state} = viewData
    return (
      <View
        onChange={viewData => setViewData(viewData)}
        onAction={() => {}}
        onPickId={() => {}}
        name={name}
        value={value}
        state={state}
        theme="dark"
      />
    )
  }

  it("should expand a node", async () => {
    const { baseElement } = render(
      <ExampleView name="root" value={{hello: 'world'}} state={{}} />
    );
    expect(screen.queryByText('world')).toBeFalsy();
    const expandButton = screen.queryByRole('button', {name: 'expand'});
    userEvent.click(expandButton);
    const el = screen.queryByText('world');
    expect(el).toBeTruthy();
  });
});
