import { useState } from "react";
type ColumnType = { id: string; title: string; tasks: Task[] };
type Task = { id: string; content: string };

const useSearchFilter = (columns: ColumnType[]) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const filteredColumns = columns.map((col) => {
    // Filter tasks based on search query and selected filter
    const filteredTasks = col.tasks.filter((task) => {
      const matchesSearch = task.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === "" || col.id === selectedFilter;
      return matchesSearch && matchesFilter;
    });

    return { ...col, tasks: filteredTasks };
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    filteredColumns,
  };
};

export default useSearchFilter;
