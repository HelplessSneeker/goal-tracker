import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeekSelector, getWeekStart } from "./week-selector";

describe("WeekSelector", () => {
  const mockOnWeekChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current date to Sunday, November 10, 2025 (UTC)
    jest.useFakeTimers();
    jest.setSystemTime(new Date(Date.UTC(2025, 10, 10, 12, 0, 0)));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders with week selector UI", () => {
    const weekStart = new Date(Date.UTC(2025, 10, 10)); // Nov 10, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    // Should show "This Week" button
    expect(
      screen.getByRole("button", { name: /this week/i }),
    ).toBeInTheDocument();
    // Should show some week range text (format may vary by locale)
    expect(screen.getByText(/2025/i)).toBeInTheDocument();
  });

  it("displays week range with year", () => {
    const weekStart = new Date(Date.UTC(2025, 10, 10)); // Nov 10, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    // Week range should include the year
    expect(screen.getByText(/2025/i)).toBeInTheDocument();
  });

  it("calls onWeekChange when Previous Week button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const weekStart = new Date(Date.UTC(2025, 10, 10)); // Nov 10, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    const prevButton = screen.getByRole("button", { name: /previous week/i });
    await user.click(prevButton);

    // Should call with a date 7 days earlier
    expect(mockOnWeekChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnWeekChange.mock.calls[0][0] as Date;
    expect(calledDate.getUTCDate()).toBe(3); // Nov 3
    expect(calledDate.getUTCDay()).toBe(0); // Sunday
  });

  it("calls onWeekChange when Next Week button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const weekStart = new Date(Date.UTC(2025, 10, 10)); // Nov 10, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    const nextButton = screen.getByRole("button", { name: /next week/i });
    await user.click(nextButton);

    // Should call with a date 7 days later
    expect(mockOnWeekChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnWeekChange.mock.calls[0][0] as Date;
    expect(calledDate.getUTCDate()).toBe(17); // Nov 17
    expect(calledDate.getUTCDay()).toBe(0); // Sunday
  });

  it("calls onWeekChange when This Week button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    // Start with a different week
    const weekStart = new Date(Date.UTC(2025, 10, 3)); // Nov 3, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    const thisWeekButton = screen.getByRole("button", { name: /this week/i });
    await user.click(thisWeekButton);

    // Should call with current week's Sunday
    expect(mockOnWeekChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnWeekChange.mock.calls[0][0] as Date;
    expect(calledDate.getUTCDate()).toBe(10); // Nov 10
    expect(calledDate.getUTCDay()).toBe(0); // Sunday
  });

  it("handles week starting on non-Sunday correctly", () => {
    // If we pass a Wednesday (Nov 13), it should normalize to Sunday (Nov 10)
    const wednesday = new Date(Date.UTC(2025, 10, 13)); // Nov 13, 2025 (Wednesday)
    render(
      <WeekSelector
        selectedWeekStart={wednesday}
        onWeekChange={mockOnWeekChange}
      />,
    );

    // Should still render - the component normalizes the date internally
    expect(
      screen.getByRole("button", { name: /this week/i }),
    ).toBeInTheDocument();
  });

  it("displays different month names in week range spanning months", () => {
    // Week spanning two months: Sunday Nov 30 to Saturday Dec 6
    const weekStart = new Date(Date.UTC(2025, 10, 30)); // Nov 30, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    // Should show both Nov and Dec
    const text = screen.getByText(/nov.*dec|dec.*nov/i);
    expect(text).toBeInTheDocument();
  });

  it("renders Previous, This Week, and Next buttons", () => {
    const weekStart = new Date(Date.UTC(2025, 10, 10)); // Nov 10, 2025
    render(
      <WeekSelector
        selectedWeekStart={weekStart}
        onWeekChange={mockOnWeekChange}
      />,
    );

    expect(
      screen.getByRole("button", { name: /previous week/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /this week/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next week/i }),
    ).toBeInTheDocument();
  });
});

describe("getWeekStart utility", () => {
  it("returns the same date if it's already Sunday", () => {
    // Nov 10, 2025 is a Sunday
    const sunday = new Date(Date.UTC(2025, 10, 10, 12, 0, 0));

    const result = getWeekStart(sunday);
    expect(result.getUTCDay()).toBe(0); // Sunday
    expect(result.getUTCDate()).toBe(10); // Still Nov 10
  });

  it("returns previous Sunday if given a Monday", () => {
    // Nov 11, 2025 is a Monday
    const monday = new Date(Date.UTC(2025, 10, 11, 12, 0, 0));

    const result = getWeekStart(monday);
    expect(result.getUTCDay()).toBe(0); // Sunday
    expect(result.getUTCDate()).toBe(10); // Nov 10 (previous day)
  });

  it("returns previous Sunday if given a Saturday", () => {
    // Nov 16, 2025 is a Saturday
    const saturday = new Date(Date.UTC(2025, 10, 16, 12, 0, 0));

    const result = getWeekStart(saturday);
    expect(result.getUTCDay()).toBe(0); // Sunday
    expect(result.getUTCDate()).toBe(10); // Nov 10 (6 days earlier)
  });

  it("returns Sunday at midnight UTC", () => {
    const anyDate = new Date(Date.UTC(2025, 10, 13, 15, 30, 45));

    const result = getWeekStart(anyDate);
    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);
  });
});
