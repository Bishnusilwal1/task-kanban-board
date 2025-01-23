import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import jest-dom to use the matchers like toBeInTheDocument
import TaskCard from "../../Card";

// Mock the Draggable component to ensure snapshot is defined
jest.mock("react-beautiful-dnd", () => ({
  Draggable: ({
    children,
  }: {
    children: (args: {
      draggableProps: Record<string, unknown>;
      dragHandleProps: Record<string, unknown>;
      innerRef: () => void;
      snapshot: { isDragging: boolean };
    }) => React.ReactNode;
  }) =>
    children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: jest.fn(),
      snapshot: { isDragging: false },
    }),
}));

describe("TaskCard Component", () => {
  const task = { id: "1", content: "Test task" };
  const editTask = jest.fn();
  const deleteTask = jest.fn();
  const columnId = "column-1";
  const index = 0;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Unit Test: Render TaskCard and check initial content
  it("renders the task content correctly", () => {
    render(
      <TaskCard
        task={task}
        index={index}
        columnId={columnId}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    );

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  // Unit Test: Test Edit functionality (without dragging-related style)
  it("allows task editing", () => {
    render(
      <TaskCard
        task={task}
        index={index}
        columnId={columnId}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    );

    // Click edit button
    fireEvent.click(screen.getByText("Edit"));

    // Check if input field is displayed
    expect(screen.getByDisplayValue("Test task")).toBeInTheDocument();

    // Change the content
    fireEvent.change(screen.getByDisplayValue("Test task"), {
      target: { value: "Updated task" },
    });

    // Click save button
    fireEvent.click(screen.getByText("Save"));

    // Check if editTask function is called
    expect(editTask).toHaveBeenCalledWith(columnId, "1", "Updated task");
  });

  // Unit Test: Test Delete functionality
  it("allows task deletion", () => {
    render(
      <TaskCard
        task={task}
        index={index}
        columnId={columnId}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    );

    // Click delete button
    fireEvent.click(screen.getByText("Delete"));

    // Check if deleteTask function is called
    expect(deleteTask).toHaveBeenCalledWith(columnId, "1");
  });
});
