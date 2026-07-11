import { useEffect, useState } from "react";

import { SyncLoader } from "react-spinners";

import useChatroomStore from "../stores/chatroom.store";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const {
    createRoom,
    createChatroomError,
    createChatroomLoading,
    loadingLoadRooms,
    loadRooms,
    rooms,
    joinRoom,
    joinRoomLoading,
    joinRoomError,
    enterRoom,
    enterRoomLoading,
  } = useChatroomStore();

  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [username, setUsername] = useState("");

  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchRooms = async () => {
      if (!clientId) {
        console.log("ClientId not found");
        return;
      }

      await loadRooms(clientId);
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientId) {
      console.log("ClientId not found");
      return;
    }

    const room = await createRoom(clientId, roomName);

    if (room) {
      setShowCreate(false);
      setRoomName("");
      await loadRooms(clientId);
    }
  };

  const handleJoinCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientId) {
      console.log("ClientId not found");
      return;
    }

    const room = await joinRoom(joinCode, clientId);

    if (room) {
      setShowJoin(false);
      setJoinCode("");
      await loadRooms(clientId);
    }

    setJoinCode("");
  };

  const handleEnterRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientId) {
      console.log("ClientId not found");
      return;
    }

    if (!selectedRoomId) {
      console.log("Room Id not found");
      return;
    }

    const room = await enterRoom(clientId, username, selectedRoomId);

    if (room) {
      navigate(`/room/${room?._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 mb-10 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />

            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                Live · Socket.IO
              </p>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide">
                Chat rooms
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowJoin(true)}
              className="px-5 py-2.5 rounded-lg border border-neutral-700 text-sm font-semibold hover:border-neutral-500 transition cursor-pointer"
            >
              Join by code
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer"
            >
              + Create room
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {rooms.map((r) => (
            <div
              key={r._id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-amber-400 hover:-translate-y-0.5 transition"
            >
              <div className="flex justify-between items-start gap-3">
                <h2 className="text-lg font-semibold">{r?.name}</h2>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="font-mono text-xs font-semibold tracking-[0.12em] bg-neutral-800 border border-neutral-700 text-teal-300 px-2.5 py-1.5 rounded-md">
                  {r?.joinCode}
                </span>

                <button
                  onClick={() => {
                    setShowUsername(true);
                    setSelectedRoomId(r?._id);
                  }}
                  className="px-4 py-1.5 rounded-md bg-teal-400 text-neutral-950 text-sm font-semibold hover:bg-teal-300 transition cursor-pointer"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50"
          onClick={() => setShowCreate(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleCreateRoom(e)}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 w-full max-w-sm flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold">Create a new room</h2>

            <input
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
              autoFocus
              placeholder="Room name"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-amber-400"
            />

            {createChatroomError && (
              <p className="w-full text-sm text-red-400 -mt-2">
                {createChatroomError}
              </p>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer"
            >
              {createChatroomLoading ? <SyncLoader size={7} /> : "Create"}
            </button>
          </form>
        </div>
      )}

      {showJoin && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50"
          onClick={() => setShowJoin(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleJoinCode(e)}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 w-full max-w-sm flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold">Join a room</h2>

            <input
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              value={joinCode}
              autoFocus
              maxLength={6}
              placeholder="Enter code"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-3 font-mono text-lg tracking-[0.2em] text-center uppercase focus:outline-none focus:border-teal-300"
            />

            {joinRoomError && (
              <p className="w-full text-sm text-red-400 -mt-2">
                {joinRoomError}
              </p>
            )}

            <button className="px-5 py-2.5 rounded-lg bg-teal-400 text-neutral-950 text-sm font-semibold hover:bg-teal-300 transition cursor-pointer">
              {joinRoomLoading ? <SyncLoader size={7} /> : "Join"}
            </button>
          </form>
        </div>
      )}

      {showUsername && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50"
          onClick={() => setShowUsername(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleEnterRoom(e)}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 w-full max-w-sm flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold">Enter a username</h2>

            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              autoFocus
              placeholder="Username"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-amber-400"
            />

            <button className="px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer">
              Continue
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
