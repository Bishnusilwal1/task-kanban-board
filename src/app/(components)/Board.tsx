"use client";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import { useLocalStorage } from "../utils/localStorageUtils";

type Task = { id: string; content: string };
type ColumnType = { id: string; title: string; tasks: Task[] };

const initialData: ColumnType[] = [
  { id: "backlog", title: "Backlog", tasks: [] },
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "done", title: "Done", tasks: [] },
];

const Board: React.FC = () => {
  const [columns, setColumns] = useLocalStorage<ColumnType[]>(
    "kanban-board",
    initialData
  );
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string>("backlog");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<ColumnType[][]>([]);
  const [future, setFuture] = useState<ColumnType[][]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Undo/Redo Logic
  const addState = (newState: ColumnType[]) => {
    setHistory((prevHistory) => [...prevHistory, columns]);
    setColumns(newState);
    setFuture([]);
  };

  // Undo operation: Go back to the previous state
  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setFuture((prevFuture) => [columns, ...prevFuture]);
    setColumns(previousState);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  // Redo operation: Go forward to the next state
  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[0];
    setHistory((prevHistory) => [...prevHistory, columns]);
    setColumns(nextState);
    setFuture((prevFuture) => prevFuture.slice(1));
  };

  // Handling Drag-and-Drop Logic with react-beautiful-dnd
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // Same column: Reorder tasks
    if (source.droppableId === destination.droppableId) {
      const sourceColumn = columns.find(
        (col) => col.id === source.droppableId
      )!;
      const updatedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, movedTask);

      const updatedColumns = columns.map((col) =>
        col.id === source.droppableId ? { ...col, tasks: updatedTasks } : col
      );
      addState(updatedColumns);
    } else {
      // Different columns: Move task
      const sourceColumn = columns.find(
        (col) => col.id === source.droppableId
      )!;
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      )!;

      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);

      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, movedTask);

      const updatedColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        } else if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      addState(updatedColumns);
    }
  };

  // Add task
  const addTask = () => {
    if (!newTaskContent.trim()) return;

    const newTask: Task = { id: `task-${Date.now()}`, content: newTaskContent };

    const updatedColumns = columns.map((col) => {
      if (col.id === selectedColumn) {
        return {
          ...col,
          tasks: [...col.tasks, newTask],
        };
      }
      return col;
    });

    addState(updatedColumns);
    setNewTaskContent("");
    inputRef.current?.focus();
  };

  // Task edit and delete functions
  const editTask = (columnId: string, taskId: string, newContent: string) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === taskId ? { ...task, content: newContent } : task
          ),
        };
      }
      return col;
    });

    addState(updatedColumns);
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        };
      }
      return col;
    });

    addState(updatedColumns);
  };

  // Add new column
  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: ColumnType = {
        id: `column-${Date.now()}`,
        title: newColumnTitle,
        tasks: [],
      };
      addState([...columns, newColumn]);
      setNewColumnTitle("");
    }
  };

  const deleteColumn = (columnId: string) => {
    const updatedColumns = columns.filter((col) => col.id !== columnId);
    addState(updatedColumns);
  };

  // Filtering columns based on search query
  const filteredColumns = columns.filter((col) => {
    return col.tasks.some((task) =>
      task.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const clearLocalStorageData = () => {
    localStorage.clear();
    addState(initialData);
  };

  return (
    <div>
      {/* Heading and task search */}
      <header>
        <h1 className="text-3xl font-semibold mb-6">Kanban Board</h1>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border bg-[#585f7d] rounded p-2 w-1/2 text-white"
            aria-label="Search for tasks"
          />
          {/* Clear Local Storage Button */}
          <button
            onClick={clearLocalStorageData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            aria-label="Clear all tasks and reset board"
          >
            Clear Local Storage
          </button>
          <button
            onClick={undo}
            onKeyDown={(e) => e.key === "Enter" && undo()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            aria-label="Undo last action"
          >
            Undo
          </button>
          <button
            onClick={redo}
            onKeyDown={(e) => e.key === "Enter" && redo()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            aria-label="Redo last undone action"
          >
            Redo
          </button>
        </div>
      </header>

      {/* Task Adding Form */}
      <div className="flex items-center gap-4 mb-6">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter task description..."
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="border bg-[#585f7d] rounded p-2 w-1/4 text-white"
          aria-label="Enter task description text"
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="border rounded p-2 bg-[#585f7d] text-white"
          aria-label="Select column for task"
        >
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          aria-label="Add new task"
        >
          Add Task
        </button>

        <div className="flex items-center gap-4 ">
          <input
            type="text"
            placeholder="New column title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="border bg-[#585f7d] rounded p-2  text-white "
            aria-label="Enter new column title"
          />
          <button
            onClick={addColumn}
            onKeyDown={(e) => e.key === "Enter" && addColumn()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            aria-label="Add new column"
          >
            Add Column
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 items-start">
          {filteredColumns.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              title={col.title}
              tasks={col.tasks}
              editTask={editTask}
              deleteTask={deleteTask}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
