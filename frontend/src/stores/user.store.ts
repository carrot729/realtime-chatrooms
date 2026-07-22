import { create } from "zustand";

import api from "../lib/api.ts";

type UserStoreType = {
  createUser: (clientId: string) => Promise<void>;
  editUsername: (clientId: string, newUsername: string) => Promise<string | null>;
};

const useUserStore = create<UserStoreType>(() => ({
  createUser: async (clientId: string) => {
    try {
      await api.post("/user/create-user", { clientId });
    } catch (error) {
      console.log(error);
    }
  },
  editUsername: async (clientId: string, newUsername: string) => {
    try {
      const response = await api.post("/user/edit-username", { clientId, newUsername });
      return response.data.existingUser.username;
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useUserStore;
