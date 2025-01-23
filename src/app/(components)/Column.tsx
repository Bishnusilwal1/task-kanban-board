"use client";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./Card";

type Task = { id: string; content: string };

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  editTask: (columnId: string, taskId: string, newContent: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  columnId,
  title,
  tasks,
  editTask,
  deleteTask,
  // Destructure the deleteColumn prop
}) => {
  return (
    <div className="from-bg-[#384951] bg-gradient-to-r from-[#384951] to-[#1d292d] rounded-lg shadow-md p-4 w-1/4">
      <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="droppable-column space-y-4 p-4 border-2 border-gray-300 rounded-md min-h-[300px] overflow-y-auto flex flex-col"
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()} // Ensure the task id is a string
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="task-card mb-4 p-4 border bg-white rounded-lg shadow-md transition-all duration-200 ease-in-out"
                  >
                    <TaskCard
                      task={task}
                      index={index}
                      columnId={columnId}
                      editTask={editTask}
                      deleteTask={deleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}{" "}
            {/* Ensures space is reserved when dragging */}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
