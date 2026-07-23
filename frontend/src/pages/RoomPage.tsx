import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import socket from "../lib/socket";

import useChatroomStore from "../stores/chatroom.store";

const RoomPage = () => {
  console.log("ROOM PAGE RENDERED");
  const { roomId } = useParams();
  const clientId = localStorage.getItem("clientId");

  const [onlineCount, setOnlineCount] = useState(0);

  const mainRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const navigate = useNavigate();

  const { loadCurrentRoom, currentRoom, sendMessage, loadMessages } =
    useChatroomStore();

  const [message, setMessage] = useState("");

  type Message = {
    _id: string;
    message: string;
    username: string;
    userId: string;
    ownerId?: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("new-message", (data) => {
      console.log("NEW MESSAGE:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("new-message");
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;

      const oldMessages = await loadMessages(roomId);

      if (oldMessages) {
        setMessages(oldMessages);
      }
    };

    fetchMessages();
  }, [roomId]);

  // 1. Start listening first
  useEffect(() => {
    socket.on("room-online-updated", (data) => {
      console.log("RECEIVED ONLINE UPDATE:", data);

      if (data.roomId === roomId) {
        setOnlineCount(data.onlineCount);
      }
    });

    return () => {
      socket.off("room-online-updated");
    };
  }, [roomId]);

  // 2. Then join the room
  useEffect(() => {
    if (!roomId || !clientId) return;

    if (!socket.connected) {
      socket.connect();
    }

    console.log("JOINING ROOM:", roomId, clientId);

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
  }, [roomId, clientId]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      if (!clientId) return;

      await loadCurrentRoom(roomId, clientId);
    };

    fetchRoomData();
  }, []);

  const handleScroll = () => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;

    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: mainRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col relative py-3 lg:py-0">
      <header className="shrink-0 border-b border-neutral-800 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Live Chat
          </p>

          <h1 className="text-2xl font-semibold mt-1">
            Room name: {currentRoom?.name}
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
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

      <main
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 flex flex-col"
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`w-full max-w-sm mt-2 rounded-xl px-4 py-3 ${
              msg.userId === clientId
                ? "self-end bg-teal-400 text-neutral-950"
                : "self-start bg-neutral-900 border border-neutral-800"
            }`}
          >
            <p
              className={`text-xs mb-1 ${
                msg.userId === clientId ? "text-neutral-800" : "text-amber-400"
              }`}
            >
	      {msg.ownerId === msg.userId && <span className="mr-1">👑</span>}
              {msg.username}
            </p>

            <p>{msg.message}</p>
          </div>
        ))}
      </main>

      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-25 sm:bottom-30 right-6 sm:right-8 z-10 p-3 rounded-full bg-neutral-900 border border-neutral-700 text-teal-400 shadow-xl hover:bg-neutral-800 hover:border-teal-400 active:scale-95 transition cursor-pointer flex items-center justify-center"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}

      <footer className="shrink-0 border-t border-neutral-800 p-4 sm:p-5 bg-neutral-950">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage(roomId!, clientId!, message);
                setMessage("");
              }
            }}
            type="text"
            placeholder="Type a message..."
            className="
          flex-1
          min-w-0
          bg-neutral-900
          border
          border-neutral-800
          rounded-xl
          px-4
          sm:px-5
          py-3
          text-neutral-100
          placeholder:text-neutral-500
          focus:outline-none
          focus:border-teal-400
          transition
        "
          />

          <button
            onClick={async () => {
              if (!message.trim()) return;
              if (!roomId || !clientId) return;

              const sent = await sendMessage(roomId, clientId, message);

              if (sent) {
                setMessage("");
              }
            }}
            className="
          shrink-0
          px-5
          sm:px-7
          py-3
          rounded-xl
          bg-teal-400
          text-neutral-950
          font-semibold
          hover:bg-teal-300
          active:scale-95
          transition
          cursor-pointer
        "
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default RoomPage;
