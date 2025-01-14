import { useState } from "react";

type ColumnType = { id: string; title: string; tasks: Task[] };
type Task = { id: string; content: string };

const useUndoRedo = (initialState: ColumnType[]) => {
  const [columns, setColumns] = useState<ColumnType[]>(initialState);
  const [history, setHistory] = useState<ColumnType[][]>([]);
  const [future, setFuture] = useState<ColumnType[][]>([]);

  const addState = (newState: ColumnType[]) => {
    setHistory((prevHistory) => [...prevHistory, columns]);
    setColumns(newState);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setFuture((prevFuture) => [columns, ...prevFuture]);
    setColumns(previousState);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[0];
    setHistory((prevHistory) => [...prevHistory, columns]);
    setColumns(nextState);
    setFuture((prevFuture) => prevFuture.slice(1));
  };

  return {
    columns,
    addState,
    undo,
    redo,
  };
};

export default useUndoRedo;
