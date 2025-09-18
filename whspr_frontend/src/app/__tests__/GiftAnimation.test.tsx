// GiftAnimation.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import GiftAnimation from "../components/GiftAnimation";

jest.useFakeTimers();

describe("GiftAnimation component", () => {
  it("renders gift emoji", () => {
    render(<GiftAnimation />);
    expect(screen.getByText("🎁")).toBeInTheDocument();
  });

  it("shows animation text when clicked", () => {
    render(<GiftAnimation />);
    fireEvent.click(screen.getByText("🎁"));
    expect(screen.getByText("✨ Gift opened! ✨")).toBeInTheDocument();
    jest.runAllTimers();
  });
});
