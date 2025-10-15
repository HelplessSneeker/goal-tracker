import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./task-form";
import {
  mockRouterPush,
  mockRouterRefresh,
  mockRouterBack,
} from "@/jest.setup";

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create mode", () => {
    it("should render create form correctly", () => {
      render(<TaskForm mode="create" regionId="region-1" />);

      expect(screen.getByText("Create New Task")).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create task/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("should submit form with valid data", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "123",
          regionId: "region-1",
          title: "New Task",
          description: "Test Description",
          deadline: "2025-12-01",
          status: "active",
          createdAt: new Date().toISOString(),
        }),
      });

      render(<TaskForm mode="create" regionId="region-1" goalId="goal-1" />);

      await user.type(screen.getByLabelText(/title/i), "New Task");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test Description",
      );
      await user.type(screen.getByLabelText(/deadline/i), "2025-12-01");
      await user.click(screen.getByRole("button", { name: /create task/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("2025-12-01"),
        });
        expect(mockRouterPush).toHaveBeenCalledWith("/goals/goal-1/region-1");
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("should display proper title", () => {
      render(<TaskForm mode="create" regionId="region-1" />);
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
    });

    it("should show correct button text", () => {
      render(<TaskForm mode="create" regionId="region-1" />);
      expect(
        screen.getByRole("button", { name: /create task/i }),
      ).toBeInTheDocument();
    });

    it("should show cancel button", () => {
      render(<TaskForm mode="create" regionId="region-1" />);
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("should call correct API endpoint", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "1", title: "Test" }),
      });

      render(<TaskForm mode="create" regionId="region-1" goalId="goal-1" />);

      await user.type(screen.getByLabelText(/title/i), "Test Task");
      await user.type(screen.getByLabelText(/description/i), "Description");
      await user.type(screen.getByLabelText(/deadline/i), "2025-12-01");
      await user.click(screen.getByRole("button", { name: /create task/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/tasks",
          expect.any(Object),
        );
      });
    });

    it("should navigate after successful create", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "1" }),
      });

      render(<TaskForm mode="create" regionId="region-1" goalId="goal-1" />);

      await user.type(screen.getByLabelText(/title/i), "Task");
      await user.type(screen.getByLabelText(/description/i), "Desc");
      await user.type(screen.getByLabelText(/deadline/i), "2025-12-01");
      await user.click(screen.getByRole("button", { name: /create task/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/goals/goal-1/region-1");
      });
    });

    it("should display error when API fails", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      render(<TaskForm mode="create" regionId="region-1" />);

      await user.type(screen.getByLabelText(/title/i), "Task");
      await user.type(screen.getByLabelText(/description/i), "Desc");
      await user.type(screen.getByLabelText(/deadline/i), "2025-12-01");
      await user.click(screen.getByRole("button", { name: /create task/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
      });
    });

    it("should show loading state during submission", async () => {
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

      render(<TaskForm mode="create" regionId="region-1" />);

      await user.type(screen.getByLabelText(/title/i), "Task");
      await user.type(screen.getByLabelText(/description/i), "Desc");
      await user.type(screen.getByLabelText(/deadline/i), "2025-12-01");
      await user.click(screen.getByRole("button", { name: /create task/i }));

      expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();
    });

    it("should handle cancel button correctly", async () => {
      const user = userEvent.setup();

      render(<TaskForm mode="create" regionId="region-1" />);

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(mockRouterBack).toHaveBeenCalled();
    });
  });

  describe("Edit mode", () => {
    const initialData = {
      id: "123",
      regionId: "region-1",
      title: "Existing Task",
      description: "Existing Description",
      deadline: "2025-12-01T00:00:00.000Z",
      status: "active" as const,
      createdAt: "2025-10-01T00:00:00.000Z",
    };

    it("should render edit form with initial data", () => {
      render(
        <TaskForm
          mode="edit"
          regionId="region-1"
          initialData={initialData}
          taskId="123"
        />,
      );

      expect(screen.getByText("Edit Task")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Existing Description"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025-12-01")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument();
    });

    it("should display proper title", () => {
      render(
        <TaskForm
          mode="edit"
          regionId="region-1"
          initialData={initialData}
          taskId="123"
        />,
      );
      expect(screen.getByText("Edit Task")).toBeInTheDocument();
    });

    it("should show correct button text", () => {
      render(
        <TaskForm
          mode="edit"
          regionId="region-1"
          initialData={initialData}
          taskId="123"
        />,
      );
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument();
    });

    it("should submit form with valid data", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...initialData, title: "Updated Task" }),
      });

      render(
        <TaskForm
          mode="edit"
          regionId="region-1"
          goalId="goal-1"
          initialData={initialData}
          taskId="123"
        />,
      );

      await user.clear(screen.getByLabelText(/title/i));
      await user.type(screen.getByLabelText(/title/i), "Updated Task");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/tasks/123", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regionId: "region-1",
            title: "Updated Task",
            description: "Existing Description",
            deadline: "2025-12-01T00:00:00.000Z",
          }),
        });
        expect(mockRouterBack).toHaveBeenCalled();
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("should call correct API endpoint", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      render(
        <TaskForm
          mode="edit"
          regionId="region-1"
          initialData={initialData}
          taskId="123"
        />,
      );

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/tasks/123",
          expect.any(Object),
        );
      });
    });

    it("should navigate after successful edit", async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      render(
        <TaskForm
          mode="edit"
          regionId="region-1"
          goalId="goal-1"
          initialData={initialData}
          taskId="123"
        />,
      );

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith(
          "/goals/goal-1/region-1/tasks/123",
        );
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });
  });
});
