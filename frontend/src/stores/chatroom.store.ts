import { create } from "zustand";
import axios from "axios";

import api from "../lib/api.ts";
import socket from "../lib/socket.ts";

type Chatroom = {
  _id: string;
  name: string;
  joinCode: string;
  members: string[];
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

  createRoom: (clientId: string, roomName: string) => Promise<Chatroom | null>;
  loadRooms: (clientId: string) => Promise<Chatroom[] | null>;
  joinRoom: (joinCode: string, clientId: string) => Promise<Chatroom | null>;
  enterRoom: (
    clientId: string,
    username: string,
    roomId: string,
  ) => Promise<Chatroom | null>;
  loadCurrentRoom: (
    roomId: string,
    clientId: string,
  ) => Promise<Chatroom | null>;
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

  createRoom: async (clientId: string, roomName: string) => {
    set({ createChatroomLoading: true, createChatroomError: null });

    try {
      const response = await api.post("/chatroom/create-chatroom", {
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

      socket.connect();
      socket.emit("join-room", response.data.room._id);

      set({ enterRoomLoading: false });

      return response.data.room;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Something went wrong. Try again";

        set({
          enterRoomLoading: false,
          enterRoomError: message,
        });

        return null;
      }
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
}));

export default useChatroomStore;
