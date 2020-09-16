import React from "react";
import { render } from "@testing-library/react";

import View from "./View";

describe("View", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
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
    expect(baseElement).toBeTruthy();
  });
});
