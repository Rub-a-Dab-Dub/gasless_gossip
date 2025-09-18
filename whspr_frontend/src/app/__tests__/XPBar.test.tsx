// XPBar.test.tsx
import { render, screen } from "@testing-library/react";
import XPBar from "../components/XPBar";

describe("XPBar component", () => {
  it("renders level and XP correctly", () => {
    render(<XPBar currentXP={50} maxXP={100} level={3} />);
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.getByText("50/100 XP")).toBeInTheDocument();
  });
});
