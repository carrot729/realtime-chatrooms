import { create } from "zustand";

import api from "../lib/api.ts";

type Chatroom = {
  _id: string;
  name: string;
  joinCode: string;
  members: string[];
};

type RoomStoreType = {
  rooms: Chatroom[];
  createChatroomLoading: boolean;
  createChatroomError: string | null;
  loadingLoadRooms: boolean;
  createRoom: (
    username: string,
    clientId: string,
    roomName: string,
  ) => Promise<Chatroom | null>;
  loadRooms: (clientId: string) => Promise<Chatroom[] | null>;
};

const useChatroomStore = create<RoomStoreType>((set) => ({
  rooms: [],
  createChatroomLoading: false,
  createChatroomError: null,
  loadingLoadRooms: false,

  createRoom: async (username: string, clientId: string, roomName: string) => {
    set({ createChatroomLoading: true, createChatroomError: null });

    try {
      const response = await api.post("/chatroom/create-chatroom", {
        username,
        clientId,
        roomName,
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
}));

export default useChatroomStore;
