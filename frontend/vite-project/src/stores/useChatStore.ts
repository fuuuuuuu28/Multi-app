import { io } from "socket.io-client";
import { create } from "zustand";
import type { Message, User } from "../types/type";
import { axiosInstance } from "../lib/axios";

interface ChatStore {
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  messages: Message[];
  users: User[];
  selectedUser: User | null;

  initialSocket: (userId: string) => Promise<void>;
  disconnected: () => void;
  fetchMessage: (userId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  setSelectedUser: (user: User) => void;
  sendMessages: (senderId: string, receiverId: string, content: string) => void;
  clearSeletedUser: () => void;
}

const socket = io(
  import.meta.env.MODE === "production"
    ? import.meta.env.SERVER_URI
    : "http://localhost:5000",
  {
    autoConnect: false, //kết nối khi muốn, thay vì tự động (tốt cho login/auth).
    withCredentials: true, //cho phép chia sẻ cookie, token (nếu có auth).
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
  }
);

export const useChatStore = create<ChatStore>((set, get) => ({
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  messages: [],
  users: [],
  selectedUser: null,

  initialSocket: async (userId) => {
    if (get().isConnected) {
      console.log("Đã kết nối rồi");
      return;
    }
    socket.auth = { userId };
    socket.connect(); //kích hoạt kết nối thủ công.
    // console.log("first", userId);

    socket.on("connect", () => {
      console.log("Client connect success", socket.id);
      //   console.log("asd", socket.id)
      socket.emit("user_connected", socket.id);

      set({ isConnected: true });
    });

    //Gửi userId cho toàn bộ người dùng thông báo rằng ta online
    if (!socket.hasListeners("user_connected")) {
      socket.on("user_connected", (userId) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });
    }

    //Gửi danh sách user đang online cho mình
    if (!socket.hasListeners("user_online")) {
      socket.on("user_online", (users) => {
        set({ onlineUsers: new Set(users) });
      });
    }

    //Xóa userId khỏi danh sách online
    if (!socket.hasListeners("user_disconnect")) {
      socket.on("user_disconnect", (userId) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });
    }

    if (!socket.hasListeners("message_sent")) {
      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
    }

    if (!socket.hasListeners("receiver_message")) {
      socket.on("receiver_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
    }

    if (!socket.hasListeners("last_message")) {
      socket.on("last_message", ({ senderId, receiverId, message }) => {
        set((state) => {
          const updated = state.users.map((user) => {
            if (user.clerkId === senderId || user.clerkId === receiverId) {
              return { ...user, lastMessage: message };
            }
            return user;
          });
          return { users: updated };
        });
      });
    }

    socket.on("connect_error", (error) =>
      console.log("Client connect error: ", error.message)
    );
  },

  disconnected: () => {
    if (get().isConnected) {
      socket.disconnect();
      console.log("disconnect");
    }
    set({ isConnected: false, onlineUsers: new Set() });
  },

  fetchMessage: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      // console.log(res)
      set({ messages: res.data.messages });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/user");
      // console.log(res.data)
      set({ users: res.data.users });
    } catch (error: any) {
      set({ error: error.respone.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedUser: (user) => {
    set(() => ({
      selectedUser: user,
    }));
  },

  clearSeletedUser: () => {
    set(() => ({
      selectedUser: null,
    }));
  },

  sendMessages: async (senderId, receiverId, content) => {
    if (!get().socket) {
      return;
    }
    socket.emit("send_messages", { senderId, receiverId, content });
  },
}));
