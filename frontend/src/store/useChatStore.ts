import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { Message } from "../types/Message";
import { User } from "../types/User";
import { getMessagesApi, getUsersApi, sendMessageApi } from "../api/messages";
interface MessageStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  setSelectedUser: (selectedUser: User | null) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text: string; image: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<MessageStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    const res = await getUsersApi()
    if(res.success) {
      set({ users: res.data })
    } else {
      toast.error(res.message)
    }

    set({ isUsersLoading: false })
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    const res = await getMessagesApi(userId);
    if(res.success) {
      set({ messages: res.data });
    } else {
      toast.error(res.message);
    }

    set({ isMessagesLoading: false });
  },
  sendMessage: async (messageData: { text: string; image: string }) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) return;
    const res = await sendMessageApi(selectedUser._id, messageData);
    if(res.success) {
      set({ messages: [...messages, res.data] });
    } else {
      toast.error(res.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));