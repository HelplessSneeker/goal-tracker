import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./task-form";
import {
  mockRouterPush,
  mockRouterRefresh,
  mockRouterBack,
} from "@/jest.setup";
import { createTaskAction, updateTaskAction } from "@/app/actions/tasks";
import { ActionErrorCode } from "@/lib/action-types";

jest.mock("@/app/actions/tasks");

const mockCreateTaskAction = createTaskAction as jest.MockedFunction<
  typeof createTaskAction
>;
const mockUpdateTaskAction = updateTaskAction as jest.MockedFunction<
  typeof updateTaskAction
>;

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

      mockCreateTaskAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: "123",
          regionId: "region-1",
          title: "New Task",
          description: "Test Description",
          deadline: new Date("2025-12-01"),
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
        expect(mockCreateTaskAction).toHaveBeenCalledWith(expect.any(FormData));
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

      mockCreateTaskAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: "1",
          title: "Test",
          regionId: "region-1",
          description: "",
          deadline: new Date(),
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      render(<TaskForm mode="create" regionId="region-1" goalId="goal-1" />);

      await user.type(screen.getByLabelText(/title/i), "Test Task");
      await user.type(screen.getByLabelText(/description/i), "Description");
      await user.type(screen.getByLabelText(/deadline/i), "2025-12-01");
      await user.click(screen.getByRole("button", { name: /create task/i }));

      await waitFor(() => {
        expect(mockCreateTaskAction).toHaveBeenCalledWith(expect.any(FormData));
      });
    });

    it("should navigate after successful create", async () => {
      const user = userEvent.setup();

      mockCreateTaskAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: "1",
          regionId: "region-1",
          title: "Task",
          description: "Desc",
          deadline: new Date(),
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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

    it("should display error when action fails", async () => {
      const user = userEvent.setup();

      mockCreateTaskAction.mockResolvedValueOnce({
        error: "Failed to create task",
        code: ActionErrorCode.DATABASE_ERROR,
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

      mockCreateTaskAction.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: {
                    id: "1",
                    regionId: "region-1",
                    title: "Task",
                    description: "Desc",
                    deadline: new Date(),
                    status: "active",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                }),
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

      mockUpdateTaskAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: initialData.id,
          regionId: initialData.regionId,
          title: "Updated Task",
          description: initialData.description,
          deadline: new Date(initialData.deadline),
          status: initialData.status,
          createdAt: new Date(initialData.createdAt),
          updatedAt: new Date(),
        },
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
        expect(mockUpdateTaskAction).toHaveBeenCalledWith("123", expect.any(FormData));
        expect(mockRouterPush).toHaveBeenCalledWith(
          "/goals/goal-1/region-1/tasks/123"
        );
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("should call correct API endpoint", async () => {
      const user = userEvent.setup();

      mockUpdateTaskAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: initialData.id,
          regionId: initialData.regionId,
          title: initialData.title,
          description: initialData.description,
          deadline: new Date(initialData.deadline),
          status: initialData.status,
          createdAt: new Date(initialData.createdAt),
          updatedAt: new Date(),
        },
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
        expect(mockUpdateTaskAction).toHaveBeenCalledWith("123", expect.any(FormData));
      });
    });

    it("should navigate after successful edit", async () => {
      const user = userEvent.setup();

      mockUpdateTaskAction.mockResolvedValueOnce({
        success: true,
        data: {
          id: initialData.id,
          regionId: initialData.regionId,
          title: initialData.title,
          description: initialData.description,
          deadline: new Date(initialData.deadline),
          status: initialData.status,
          createdAt: new Date(initialData.createdAt),
          updatedAt: new Date(),
        },
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
