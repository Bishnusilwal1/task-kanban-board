import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Column from "../../Column";

// Mock the TaskCard component
jest.mock("../../Card", () => {
  return jest.fn(({ task }: any) => (
    <div data-testid="task-card">{task.content}</div>
  ));
});

// Mock react-beautiful-dnd
jest.mock("react-beautiful-dnd", () => ({
  Droppable: ({ children }: any) => {
    return children({
      droppableProps: {},
      innerRef: jest.fn(),
      placeholder: null,
    });
  },
  Draggable: ({ children }: any) => {
    return children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: jest.fn(),
      snapshot: { isDragging: false }, // Mock snapshot with isDragging: false
    });
  },
}));

describe("Column Component", () => {
  it("renders the column with title and tasks", () => {
    const mockTasks = [
      { id: "1", content: "Task 1" },
      { id: "2", content: "Task 2" },
    ];

    // Render the Column component
    render(
      <Column
        columnId="column-1"
        title="To Do"
        tasks={mockTasks}
        editTask={jest.fn()}
        deleteTask={jest.fn()}
        deleteColumn={jest.fn()} // Add this line to pass deleteColumn prop
      />
    );

    // Check if the column title is rendered correctly
    expect(screen.getByText("To Do")).toBeInTheDocument();

    // Check if mocked TaskCard components are rendered
    const taskCards = screen.getAllByTestId("task-card");
    expect(taskCards).toHaveLength(mockTasks.length);

    // Verify that the task content is displayed in the mock TaskCard
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });
});
