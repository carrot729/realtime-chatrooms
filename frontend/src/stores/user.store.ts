import { create } from "zustand";

import api from "../lib/api.ts";

type UserStoreType = {
  createNewUser: (clientId: string) => Promise<void>;
};

const useUserStore = create(() => ({
  createUser: async (clientId: string) => {
    try {
      await api.post("/user/create-user", { clientId });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useUserStore;
