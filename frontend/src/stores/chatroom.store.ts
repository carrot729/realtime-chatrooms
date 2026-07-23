import { create } from "zustand";
import axios from "axios";

import api from "../lib/api.ts";

type Chatroom = {
  _id: string;
  name: string;
  description?: string;
  joinCode: string;
  members: string[];
};

type Message = {
  _id: string;
  message: string;
  username: string;
  userId: string;
  ownerId: string;
};

type RoomStoreType = {
  currentRoom: Chatroom | null;
  rooms: Chatroom[];
  createChatroomLoading: boolean;
  createChatroomError: string | null;
  loadingLoadRooms: boolean;
  joinRoomLoading: boolean;
  enterRoomLoading: boolean;
  joinRoomError: string | null;
  enterRoomError: string | null;

  createRoom: (
    clientId: string,
    roomName: string,
    roomDescriptoin: string,
  ) => Promise<Chatroom | null>;
  loadRooms: (clientId: string) => Promise<Chatroom[] | null>;
  joinRoom: (joinCode: string, clientId: string) => Promise<Chatroom | null>;
  enterRoom: (
    clientId: string,
    username: string,
    roomId: string,
  ) => Promise<Chatroom | "USERNAME_REQUIRED" | null>;
  loadCurrentRoom: (
    roomId: string,
    clientId: string,
  ) => Promise<Chatroom | null>;
  sendMessage: (
    roomId: string,
    clientId: string,
    message: string,
  ) => Promise<boolean>;
  loadMessages: (roomId: string) => Promise<Message[] | null>;
};

const useChatroomStore = create<RoomStoreType>((set) => ({
  currentRoom: null,
  rooms: [],
  createChatroomLoading: false,
  createChatroomError: null,
  loadingLoadRooms: false,

  joinRoomLoading: false,
  joinRoomError: null,

  enterRoomLoading: false,
  enterRoomError: null,

  createRoom: async (
    clientId: string,
    roomName: string,
    roomDescription: string,
  ) => {
    set({ createChatroomLoading: true, createChatroomError: null });

    try {
      const response = await api.post("/chatroom/create-chatroom", {
        clientId,
        roomName,
        roomDescription,
      });

      const chatroom = response.data.chatroom as Chatroom;

      set({ createChatroomLoading: false });

      return chatroom;
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "Something went wrong. Try again";

      set({ createChatroomLoading: false, createChatroomError: message });

      setTimeout(() => {
        set({ createChatroomError: null });
      }, 2000);

      return null;
    }
  },

  loadRooms: async (clientId: string) => {
    set({ loadingLoadRooms: true });

    try {
      const response = await api.get("/chatroom/load-rooms", {
        params: { clientId },
      });

      const rooms = response.data.rooms as Chatroom[];

      set({ rooms, loadingLoadRooms: false });

      return rooms;
    } catch (error) {
      console.log(error);
      set({ loadingLoadRooms: false });
      return null;
    }
  },

  joinRoom: async (joinCode: string, clientId: string) => {
    set({ joinRoomLoading: true, joinRoomError: null });

    try {
      const response = await api.post("/chatroom/join-room", {
        joinCode,
        clientId,
      });

      const chatroom = response.data.chatroom as Chatroom;

      set({ joinRoomLoading: false });

      return chatroom;
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "Something went wrong. Try again";

      set({ joinRoomLoading: false, joinRoomError: message });

      setTimeout(() => {
        set({ joinRoomError: null });
      }, 2000);

      return null;
    }
  },

  enterRoom: async (clientId: string, username: string, roomId: string) => {
    set({ enterRoomLoading: true });

    try {
      const response = await api.post("/chatroom/enter-room", {
        clientId,
        username,
        roomId,
      });

      set({ enterRoomLoading: false });

      return response.data.room;
    } catch (error) {
      set({ enterRoomLoading: false });

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.code === "USERNAME_REQUIRED") {
          return "USERNAME_REQUIRED";
        }

        set({
          enterRoomError:
            error.response?.data?.message ?? "Something went wrong",
        });
      }

      return null;
    }
  },

  loadCurrentRoom: async (roomId: string, clientId: string) => {
    try {
      const response = await api.post("/chatroom/load-current-room", {
        roomId,
        clientId,
      });

      const room = response.data.room as Chatroom;

      set({ currentRoom: room });

      return room as Chatroom;
    } catch (error) {
      set({ currentRoom: null });
      console.log(error);

      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }

      return null;
    }
  },

  sendMessage: async (roomId: string, clientId: string, message: string) => {
    try {
      await api.post("/chatroom/send-message", {
        roomId,
        clientId,
        message,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  loadMessages: async (roomId) => {
    try {
      const response = await api.post("/chatroom/load-messages", {
        roomId,
      });

      return response.data.messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
}));

export default useChatroomStore;
