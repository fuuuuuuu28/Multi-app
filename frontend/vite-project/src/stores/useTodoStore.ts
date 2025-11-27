import { create } from "zustand";
import type { Todo } from "../types/type";
import { axiosInstance } from "../lib/axios";

interface TodoStore {
  isLoading: {
    add: boolean;
    tasks: boolean;
    toggle: boolean;
    delete: boolean;
  };
  error: string | null;
  tasks: Todo[];
  task: Todo | null;

  addTasks: (task: string, completed: boolean) => Promise<void>;
  getTasks: () => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  isLoading: {
    add: false,
    tasks: false,
    toggle: false,
    delete: false,
  },
  error: null,
  tasks: [],
  task: null,
  completed: false,

  addTasks: async (task, completed) => {
    set((state) => ({ isLoading: { ...state.isLoading, add: true } }));
    try {
      const res = await axiosInstance.post("/todo/add", {
        task,
        completed,
      });
      const newTask = res.data.newTask;
      console.log("first", newTask);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, add: false } }));
    }
  },

  getTasks: async () => {
    set((state) => ({ isLoading: { ...state.isLoading, tasks: true } }));
    try {
      const res = await axiosInstance.get("/todo/");

      // console.log(res.data.tasks);
      set({ tasks: res.data.tasks });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, tasks: false } }));
    }
  },

  toggleTask: async (id) => {
    set((state) => ({ isLoading: { ...state.isLoading, toggle: true } }));

    try {
      const res = await axiosInstance.patch(`/todo/toggle/${id}`);
      const updated = res.data.task;

      set((state) => ({
        tasks: state.tasks.map((t) => (t._id == updated._id ? updated : t)),
      }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, toggle: false } }));
    }
  },

  deleteTask: async (id) => {
    set((state) => ({ isLoading: { ...state.isLoading, delete: true } }));

    try {
      const res = await axiosInstance.delete(`/todo/delete/${id}`);
      const deleteTask = res.data.task;
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id != deleteTask._id),
      }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, delete: false } }));
    }
  },
}));
