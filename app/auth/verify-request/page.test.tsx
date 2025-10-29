import { render, screen } from "@testing-library/react";
import VerifyRequestPage from "./page";

describe("VerifyRequestPage", () => {
  it("should render the verify request message", async () => {
    const component = await VerifyRequestPage();
    const { container } = render(component);

    expect(screen.getByText("Check your email")).toBeInTheDocument();
    expect(
      screen.getByText("A sign in link has been sent to your email address")
    ).toBeInTheDocument();
  });

  it("should display email icon", async () => {
    const component = await VerifyRequestPage();
    render(component);

    // Check for Mail icon (lucide-react renders as SVG)
    const mailIcon = document.querySelector('svg');
    expect(mailIcon).toBeInTheDocument();
  });

  it("should show instructions to check email", async () => {
    const component = await VerifyRequestPage();
    render(component);

    expect(
      screen.getByText("Click the link in the email to sign in to your account.")
    ).toBeInTheDocument();
  });

  it("should tell user they can close the window", async () => {
    const component = await VerifyRequestPage();
    render(component);

    expect(
      screen.getByText("You can close this window and check your email inbox.")
    ).toBeInTheDocument();
  });

  it("should render within a card component", async () => {
    const component = await VerifyRequestPage();
    const { container } = render(component);

    // Check for card structure
    expect(container.querySelector('.flex.min-h-screen')).toBeInTheDocument();
  });

  it("should center the card on the page", async () => {
    const component = await VerifyRequestPage();
    const { container } = render(component);

    const wrapper = container.querySelector('.flex.min-h-screen');
    expect(wrapper).toHaveClass('items-center', 'justify-center');
  });

  it("should have proper styling for the card", async () => {
    const component = await VerifyRequestPage();
    const { container } = render(component);

    expect(container.querySelector('.bg-gray-50')).toBeInTheDocument();
  });
});
