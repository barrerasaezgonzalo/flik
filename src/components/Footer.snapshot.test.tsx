import { render } from "@testing-library/react";
import Footer from "./Footer";
import React from "react";

describe("Footer snapshots", () => {
  it("match snapshot render", () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
