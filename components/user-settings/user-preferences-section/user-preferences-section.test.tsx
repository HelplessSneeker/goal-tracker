import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserPreferencesSection } from "./user-preferences-section";
import { updateUserPreferencesAction } from "@/app/actions/user-preferences";
import { ActionErrorCode } from "@/lib/action-types";

// Mock the action
jest.mock("@/app/actions/user-preferences");
const mockUpdateUserPreferencesAction =
  updateUserPreferencesAction as jest.MockedFunction<
    typeof updateUserPreferencesAction
  >;

describe("UserPreferencesSection", () => {
  const mockInitialPreferences = {
    language: "en",
    theme: "system",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console methods
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders language selector with current value", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("renders theme selector with current value", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      expect(screen.getByText("System")).toBeInTheDocument();
    });

    it("displays German language preference correctly", () => {
      render(
        <UserPreferencesSection
          initialPreferences={{ language: "de", theme: "light" }}
        />
      );

      expect(screen.getByText("German")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
    });

    it("displays dark theme preference correctly", () => {
      render(
        <UserPreferencesSection
          initialPreferences={{ language: "en", theme: "dark" }}
        />
      );

      expect(screen.getByText("Dark")).toBeInTheDocument();
    });
  });

  describe("i18n", () => {
    it("displays translated labels correctly", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      expect(screen.getByText("Account Preferences")).toBeInTheDocument();
      expect(
        screen.getByText("Manage your account settings")
      ).toBeInTheDocument();
      expect(screen.getByText("Language")).toBeInTheDocument();
      expect(screen.getByText("Theme")).toBeInTheDocument();
    });

    it("displays translated preference options", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("System")).toBeInTheDocument();
    });
  });

  describe("Interactive Mode", () => {
    it("selectors are enabled by default", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      const languageSelect = screen.getByRole("combobox", {
        name: /language/i,
      });
      const themeSelect = screen.getByRole("combobox", { name: /theme/i });

      expect(languageSelect).not.toBeDisabled();
      expect(themeSelect).not.toBeDisabled();
    });

    it("does not show 'Coming soon' messages", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      expect(screen.queryByText("(Coming soon)")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Preference settings will be available soon")
      ).not.toBeInTheDocument();
    });

    it("maintains initial preference values", () => {
      render(
        <UserPreferencesSection initialPreferences={mockInitialPreferences} />
      );

      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("System")).toBeInTheDocument();
    });

    it("displays different initial preferences correctly", () => {
      render(
        <UserPreferencesSection
          initialPreferences={{ language: "de", theme: "dark" }}
        />
      );

      expect(screen.getByText("German")).toBeInTheDocument();
      expect(screen.getByText("Dark")).toBeInTheDocument();
    });
  });
});
