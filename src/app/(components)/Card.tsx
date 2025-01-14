"use client";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

type Task = { id: string; content: string };

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  editTask: (columnId: string, taskId: string, newContent: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  columnId,
  editTask,
  deleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const handleSave = () => {
    editTask(columnId, task.id, editContent);
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing) {
      if (event.key === "Enter") {
        handleSave(); // Save on Enter key
      } else if (event.key === "Escape") {
        setIsEditing(false); // Cancel editing on Escape
      }
    } else {
      if (event.key === "Enter" || event.key === " ") {
        setIsEditing(true); // Start editing on Enter or Space
      }
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot?.isDragging ?? false;

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-[#40545e] p-4 rounded shadow-md transition-transform ${
              isDragging ? "scale-95" : ""
            }`}
            tabIndex={0} // Make the task card focusable
            onKeyDown={handleKeyDown} // Handle keydown events for keyboard interaction
          >
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="border rounded p-2 w-full text-white bg-[#585f7d] border-none"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="text-blue-500 mt-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between gap-2 mt-2">
                  <p className="text-white">{task.content}</p>
                  <div className="space-x-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setIsEditing(true);
                        }
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(columnId, task.id)}
                      className="text-red-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          deleteTask(columnId, task.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskCard;
