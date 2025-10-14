import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionForm } from "./region-form";
import {
  mockRouterPush,
  mockRouterRefresh,
  mockRouterBack,
} from "@/jest.setup";

describe("RegionForm", () => {
  const goalId = "goal-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Mode", () => {
    it("renders create mode correctly", () => {
      render(<RegionForm mode="create" goalId={goalId} />);

      expect(screen.getByText("Create New Region")).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it("submits form with valid data including goalId", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "region-1",
          goalId: "goal-123",
          title: "New Region",
          description: "New Description",
        }),
      });

      render(<RegionForm mode="create" goalId={goalId} />);

      await user.type(screen.getByLabelText(/title/i), "New Region");
      await user.type(screen.getByLabelText(/description/i), "New Description");
      await user.click(screen.getByRole("button", { name: /create region/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/regions",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              title: "New Region",
              description: "New Description",
              goalId: "goal-123",
            }),
          }),
        );
      });
    });

    it("redirects to goal detail page after successful creation", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "region-1",
          goalId,
          title: "Region",
          description: "Desc",
        }),
      });

      render(<RegionForm mode="create" goalId={goalId} />);

      await user.type(screen.getByLabelText(/title/i), "Region");
      await user.type(screen.getByLabelText(/description/i), "Desc");
      await user.click(screen.getByRole("button", { name: /create region/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith(`/goals/${goalId}`);
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("handles cancel button click", async () => {
      const user = userEvent.setup();

      render(<RegionForm mode="create" goalId={goalId} />);

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(mockRouterBack).toHaveBeenCalled();
    });
  });

  describe("Edit Mode", () => {
    const regionId = "region-456";
    const initialData = {
      title: "Existing Region",
      description: "Existing Description",
    };

    it("renders edit mode correctly", () => {
      render(
        <RegionForm
          mode="edit"
          goalId={goalId}
          initialData={initialData}
          regionId={regionId}
        />,
      );

      expect(screen.getByText("Edit Region")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Existing Region")).toBeInTheDocument();
    });

    it("submits update request with correct data and goalId", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: regionId,
          goalId,
          title: "Updated Region",
          description: "Updated Description",
        }),
      });

      render(
        <RegionForm
          mode="edit"
          goalId={goalId}
          initialData={initialData}
          regionId={regionId}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.clear(titleInput);
      await user.type(titleInput, "Updated Region");
      await user.clear(descriptionInput);
      await user.type(descriptionInput, "Updated Description");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/regions/${regionId}`,
          expect.objectContaining({
            method: "PUT",
            body: JSON.stringify({
              title: "Updated Region",
              description: "Updated Description",
              goalId: "goal-123",
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
          id: regionId,
          goalId,
          title: "Updated",
          description: "Desc",
        }),
      });

      render(
        <RegionForm
          mode="edit"
          goalId={goalId}
          initialData={initialData}
          regionId={regionId}
        />,
      );

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith(`/goals/${goalId}`);
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });
  });
});
