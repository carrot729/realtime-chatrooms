import { Routes, Route } from "react-router";

import HomePage from "./pages/HomePage";

import useUserStore from "./stores/user.store";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const initUser = async () => {
      let clientId = localStorage.getItem("clientId");

      if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("clientId", clientId);
      }

      await useUserStore.getState().createUser(clientId);
    };

    initUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
