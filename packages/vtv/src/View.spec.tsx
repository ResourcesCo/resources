import React from "react";
import { render, screen } from "@testing-library/react";

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
});
