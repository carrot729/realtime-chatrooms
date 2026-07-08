import { create } from "zustand";

import api from "../lib/api.ts";

type Chatroom = {
  _id: string;
  name: string;
  joinCode: string;
  members: string[];
};

type RoomStoreType = {
  chatroom: Chatroom | null;
  createChatroomLoading: boolean;
  createRoom: (
    username: string,
    clientId: string,
    roomName: string,
  ) => Promise<Chatroom | null>;
};

const useChatroomStore = create<RoomStoreType>((set) => ({
  chatroom: null,
  createChatroomLoading: false,

  createRoom: async (username: string, clientId: string, roomName: string) => {
    set({ createChatroomLoading: true });

    try {
      const response = await api.post("/chatroom/create-chatroom", {
        username,
        clientId,
        roomName,
      });

      const chatroom = response.data.data as Chatroom;
      set({ chatroom, createChatroomLoading: false });

      return chatroom;
    } catch (error) {
      console.log(error);
      set({ createChatroomLoading: false });
      return null;
    }
  },
}));

export default useChatroomStore;
