import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoalForm } from "./goal-form";
import {
  mockRouterPush,
  mockRouterRefresh,
  mockRouterBack,
} from "@/jest.setup";

describe("GoalForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Mode", () => {
    it("renders create mode correctly", () => {
      render(<GoalForm mode="create" />);

      expect(screen.getByText("Create New Goal")).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create goal/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("has empty form fields initially", () => {
      render(<GoalForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(
        /description/i,
      ) as HTMLTextAreaElement;

      expect(titleInput.value).toBe("");
      expect(descriptionInput.value).toBe("");
    });

    it("submits form with valid data", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "123",
          title: "New Goal",
          description: "New Description",
        }),
      });

      render(<GoalForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), "New Goal");
      await user.type(screen.getByLabelText(/description/i), "New Description");
      await user.click(screen.getByRole("button", { name: /create goal/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/goals",
          expect.objectContaining({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "New Goal",
              description: "New Description",
            }),
          }),
        );
      });
    });

    it("redirects to goals page after successful creation", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "123",
          title: "New Goal",
          description: "Desc",
        }),
      });

      render(<GoalForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), "New Goal");
      await user.type(screen.getByLabelText(/description/i), "Desc");
      await user.click(screen.getByRole("button", { name: /create goal/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/goals");
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("displays error message on API failure", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      render(<GoalForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), "New Goal");
      await user.type(screen.getByLabelText(/description/i), "New Description");
      await user.click(screen.getByRole("button", { name: /create goal/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to create goal/i)).toBeInTheDocument();
      });
    });

    it("disables form during submission", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => ({}) }),
              100,
            ),
          ),
      );

      render(<GoalForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole("button", {
        name: /create goal/i,
      });
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      await user.type(titleInput, "New Goal");
      await user.type(descriptionInput, "New Description");
      await user.click(submitButton);

      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(screen.getByText(/creating/i)).toBeInTheDocument();
    });

    it("calls onSuccess callback if provided", async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "123",
          title: "Goal",
          description: "Desc",
        }),
      });

      render(<GoalForm mode="create" onSuccess={onSuccess} />);

      await user.type(screen.getByLabelText(/title/i), "Goal");
      await user.type(screen.getByLabelText(/description/i), "Desc");
      await user.click(screen.getByRole("button", { name: /create goal/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it("handles cancel button click", async () => {
      const user = userEvent.setup();

      render(<GoalForm mode="create" />);

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(mockRouterBack).toHaveBeenCalled();
    });
  });

  describe("Edit Mode", () => {
    const initialData = {
      title: "Existing Goal",
      description: "Existing Description",
    };

    it("renders edit mode correctly", () => {
      render(<GoalForm mode="edit" initialData={initialData} goalId="123" />);

      expect(screen.getByText("Edit Goal")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Existing Goal")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Existing Description"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument();
    });

    it("populates form fields with initial data", () => {
      render(<GoalForm mode="edit" initialData={initialData} goalId="123" />);

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(
        /description/i,
      ) as HTMLTextAreaElement;

      expect(titleInput.value).toBe("Existing Goal");
      expect(descriptionInput.value).toBe("Existing Description");
    });

    it("submits update request with correct data", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "123",
          title: "Updated Goal",
          description: "Updated Description",
        }),
      });

      render(<GoalForm mode="edit" initialData={initialData} goalId="123" />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.clear(titleInput);
      await user.type(titleInput, "Updated Goal");
      await user.clear(descriptionInput);
      await user.type(descriptionInput, "Updated Description");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/goals/123",
          expect.objectContaining({
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "Updated Goal",
              description: "Updated Description",
            }),
          }),
        );
      });
    });

    it("redirects to goal detail page after successful update", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "123",
          title: "Updated",
          description: "Desc",
        }),
      });

      render(<GoalForm mode="edit" initialData={initialData} goalId="123" />);

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/goals/123");
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("displays error message on update failure", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      render(<GoalForm mode="edit" initialData={initialData} goalId="123" />);

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to update goal/i)).toBeInTheDocument();
      });
    });

    it("shows saving state during update", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => ({}) }),
              100,
            ),
          ),
      );

      render(<GoalForm mode="edit" initialData={initialData} goalId="123" />);

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      expect(screen.getByText(/saving/i)).toBeInTheDocument();
    });
  });
});
