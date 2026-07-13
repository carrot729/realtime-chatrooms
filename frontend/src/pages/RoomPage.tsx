import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import socket from "../lib/socket";

import useChatroomStore from "../stores/chatroom.store";

const RoomPage = () => {
  const { roomId } = useParams();
  const clientId = localStorage.getItem("clientId");

  const [onlineCount, setOnlineCount] = useState(0);

  const navigate = useNavigate();

  const { loadCurrentRoom, currentRoom } = useChatroomStore();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", {
      roomId,
      clientId,
    });

    return () => {
      socket.emit("leave-room", {
        roomId,
        clientId,
      });
    };
  }, [roomId]);

  useEffect(() => {
    socket.on("room-online-updated", (data) => {
      if (data.roomId === roomId) {
        setOnlineCount(data.onlineCount);
      }
    });

    return () => {
      socket.off("room-online-updated");
    };
  }, [roomId]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      if (!clientId) return;

      await loadCurrentRoom(roomId, clientId);
    };

    fetchRoomData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Live Chat
          </p>

          <h1 className="text-2xl font-semibold mt-1">
            Room name: {currentRoom?.name}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            {onlineCount} Online
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="self-start max-w-xs rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3">
            <p className="text-xs text-amber-400 mb-1">Alice</p>
            <p>Hello everyone 👋</p>
          </div>

          <div className="self-end max-w-xs rounded-xl bg-teal-400 text-neutral-950 px-4 py-3">
            <p className="text-xs font-semibold mb-1">You</p>
            <p>Hi!</p>
          </div>
        </div>
      </main>

      {/* Message Input */}
      <footer className="border-t border-neutral-800 p-5">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-400"
          />

          <button className="px-6 py-3 rounded-xl bg-teal-400 text-neutral-950 font-semibold hover:bg-teal-300 transition cursor-pointer">
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default RoomPage;
