import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInPage from "./page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignInPage", () => {
  const mockPush = jest.fn();
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
  const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);
  });

  it("should render sign in form", () => {
    render(<SignInPage />);

    expect(screen.getByText("Sign In / Sign Up")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Enter your email to receive a magic link. Works for both new and existing accounts./
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Magic Link/i })).toBeInTheDocument();
  });

  it("should redirect authenticated users to /goals", () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: "test@test.com" } },
      status: "authenticated",
    } as any);

    render(<SignInPage />);

    expect(mockPush).toHaveBeenCalledWith("/goals");
  });

  it("should handle email input", () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });

    expect(emailInput.value).toBe("test@test.com");
  });

  it("should submit form and call signIn", async () => {
    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("email", {
        email: "test@test.com",
        redirect: false,
        callbackUrl: "/goals",
      });
    });
  });

  it("should redirect to verify-request page after successful email send", async () => {
    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/verify-request");
    });
  });

  it("should show error message on signIn failure", async () => {
    mockSignIn.mockResolvedValue({ error: "EmailSignin", ok: false } as any);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to send email. Please try again.")).toBeInTheDocument();
    });
  });

  it("should show loading state during submission", async () => {
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: null, ok: true } as any), 100))
    );

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("Sending...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });

  it("should handle unexpected errors", async () => {
    mockSignIn.mockRejectedValue(new Error("Network error"));

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred. Please try again.")).toBeInTheDocument();
    });
  });

  it("should require email input", () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("type", "email");
  });
});
