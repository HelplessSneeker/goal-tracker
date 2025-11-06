import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionForm } from "./region-form";
import {
  mockRouterPush,
  mockRouterRefresh,
  mockRouterBack,
} from "@/jest.setup";
import { createRegionAction, updateRegionAction } from "@/app/actions/regions";

jest.mock("@/app/actions/regions");

const mockCreateRegionAction = createRegionAction as jest.MockedFunction<
  typeof createRegionAction
>;
const mockUpdateRegionAction = updateRegionAction as jest.MockedFunction<
  typeof updateRegionAction
>;

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

      mockCreateRegionAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: "region-1",
          goalId: "goal-123",
          title: "New Region",
          description: "New Description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      render(<RegionForm mode="create" goalId={goalId} />);

      await user.type(screen.getByLabelText(/title/i), "New Region");
      await user.type(screen.getByLabelText(/description/i), "New Description");
      await user.click(screen.getByRole("button", { name: /create region/i }));

      await waitFor(() => {
        expect(mockCreateRegionAction).toHaveBeenCalledWith(
          expect.any(FormData),
        );
      });
    });

    it("redirects to goal detail page after successful creation", async () => {
      const user = userEvent.setup();

      mockCreateRegionAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: "region-1",
          goalId,
          title: "Region",
          description: "Desc",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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

    it("submits update request with correct data", async () => {
      const user = userEvent.setup();

      mockUpdateRegionAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: regionId,
          goalId,
          title: "Updated Region",
          description: "Updated Description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
        expect(mockUpdateRegionAction).toHaveBeenCalledWith(
          regionId,
          expect.any(FormData),
        );
      });
    });

    it("redirects to goal detail page after successful update", async () => {
      const user = userEvent.setup();

      mockUpdateRegionAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: regionId,
          goalId,
          title: "Updated",
          description: "Desc",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
