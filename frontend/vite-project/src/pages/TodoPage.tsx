import React, { useEffect, useState } from "react";
import { useTodoStore } from "../stores/useTodoStore";
import { Loader } from "lucide-react";

type FilterType = "all" | "active" | "complete";

const TodoPage = () => {
  const { addTasks, getTasks, tasks, toggleTask, deleteTask, isLoading } =
    useTodoStore();

  const [task, setTask] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const countActive = tasks?.filter((task) => !task.completed);
  const countComplete = tasks?.filter((task) => task.completed);

  const filterTask = tasks?.filter((t) => {
    switch (filter) {
      case "active":
        return !t.completed;
      case "complete":
        return t.completed;
      default:
        return true;
    }
  });

  const handleTask = () => {
    addTasks(task, false);
    setTask("");
  };
  const handlePress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTask();
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="flex-col w-[80%] mt-5 mx-auto space-y-4">
      {/* Input Todo */}
      <div className="flex items-center justify-center gap-2 h-[100px] bg-zinc-100 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Add your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handlePress}
          className="w-[60%] h-[50px] p-4 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          className="bg-blue-500 text-white font-semibold p-4 rounded-xl"
          onClick={() => handleTask()}
        >
          {isLoading.add ? <Loader className="size-5 animate-spin" /> : "Add"}
        </button>
      </div>

      {/* Stat Todo */}
      <div className="grid grid-cols-3 h-[100px] gap-4 text-center my-2">
        <div className="bg-zinc-100 text-blue-500 font-bold text-2xl p-4 rounded-xl">
          <h1>Tất cả</h1>
          <span className="text-5xl">{tasks?.length}</span>
        </div>
        <div className="bg-zinc-100 text-orange-500 font-bold text-2xl p-4 rounded-xl">
          <h1>Chưa xong</h1>
          <span className="text-5xl">{countActive?.length}</span>
        </div>
        <div className="bg-zinc-100 text-green-500 font-bold text-2xl p-4 rounded-xl">
          <h1>Hoàn thành</h1>
          <span className="text-5xl">{countComplete?.length}</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-col min-h-[500px] bg-zinc-100 rounded-xl">
        <div className="flex items-center justify-center gap-4 p-4 my-6">
          {(["all", "active", "complete"] as FilterType[]).map((fil) => (
            <button
              key={fil}
              onClick={() => setFilter(fil)}
              className={`border-b-2 px-4 py-2 rounded-lg font-medium transition-all ${
                filter === fil
                  ? fil === "all"
                    ? "bg-blue-500 text-white shadow-md"
                    : fil === "active"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-green-500 text-white shadow-md"
                  : "bg-zinc-100"
              } hover:bg-zinc-300 `}
            >
              {fil == "all"
                ? "Tất cả"
                : fil == "active"
                ? "Chưa xong"
                : "Hoàn thành"}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto h-[380px]">
          {isLoading.tasks ? (
            <Loader className="w-full text-blue-400 mx-auto size-50 animate-spin" />
          ) : (
            filterTask?.map((task) => (
              <div
                key={task._id}
                onClick={() => {
                  toggleTask(task._id);
                }}
                className={`flex items-center justify-between
              px-6 py-3 border-b border-zinc-300 rounded-lg
              transition-all duration-200 cursor-pointer
              break-all whitespace-normal overflow-hidden gap-2
              ${task.completed ? "bg-zinc-200" : "bg-white hover:bg-zinc-100"}`}
              >
                <span
                  className={`text-xl ${
                    task.completed ? "line-through text-zinc-500" : ""
                  }`}
                >
                  {task.task}
                </span>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="shrink-0 p-2 bg-blue-500 text-white rounded-lg hover:cursor-pointer hover:opacity-80 duration-200"
                >
                  {isLoading.delete ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
