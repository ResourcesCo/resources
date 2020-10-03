import React from "react";
import { render } from "@testing-library/react";

import View from "./View";

describe("View", () => {
  it("should render successfully", () => {
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
});
