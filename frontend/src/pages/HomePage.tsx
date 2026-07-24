import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { SyncLoader } from "react-spinners";

import useChatroomStore from "../stores/chatroom.store";
import useUserStore from "../stores/user.store";
import { BiCopy } from "react-icons/bi";

const HomePage = () => {
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const {
    createRoom,
    createChatroomError,
    createChatroomLoading,

    loadRooms,
    rooms,
    loadPublicRooms,
    publicRooms,
    joinRoom,
    joinRoomLoading,
    joinRoomError,
    enterRoom,
    enterRoomLoading,
    enterRoomError,
  } = useChatroomStore();

  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [username, setUsername] = useState("");
  const [editUsername, setEditUsername] = useState("");

  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchRooms = async () => {
      if (!clientId) {
        console.log("ClientId not found");
        return;
      }

      await loadRooms(clientId);
      await loadPublicRooms(clientId);
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientId) {
      console.log("ClientId not found");
      return;
    }

    const room = await createRoom(clientId, roomName, roomDescription);

    if (room) {
      setShowCreate(false);
      setRoomName("");
      setRoomDescription("");
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

    const result = await enterRoom(clientId, username, selectedRoomId);

    if (result && result !== "USERNAME_REQUIRED") {
      setUsername("");
      setShowUsername(false);
      navigate(`/room/${result._id}`);
    }
  };

  const handleEditUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientId) {
      console.log("ClientId not found");
      return;
    }

    const result = await useUserStore
      .getState()
      .editUsername(clientId, editUsername);
    if (result) {
      setEditUsername("");
      setShowEditUsername(false);
      navigate(`/`);
    }
  };

  const handleJoinPublicRoom = async (roomId: string, joinCode: string) => {
    if (!clientId) return;

    const joinedRoom = await joinRoom(joinCode, clientId);

    if (joinedRoom) {
      const result = await enterRoom(clientId, "", joinedRoom._id);

      if (result === "USERNAME_REQUIRED") {
        setSelectedRoomId(joinedRoom._id);
        setShowUsername(true);
        return;
      }

      if (result) {
        navigate(`/room/${result._id}`);
      }
    } else {
      const result = await enterRoom(clientId, "", roomId);

      if (result === "USERNAME_REQUIRED") {
        setSelectedRoomId(roomId);
        setShowUsername(true);
        return;
      }

      if (result) {
        navigate(`/room/${result._id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 md:px-10 lg:px-5 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowEditUsername(true)}
              className="px-4 py-2.5 rounded-lg border border-neutral-700 text-sm font-semibold hover:border-neutral-500 transition cursor-pointer truncate"
            >
              Edit Username
            </button>

            <button
              onClick={() => setShowJoin(true)}
              className="px-4 py-2.5 rounded-lg border border-neutral-700 text-sm font-semibold hover:border-neutral-500 transition cursor-pointer truncate"
            >
              Join by code
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="col-span-2 sm:col-span-1 px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer"
            >
              + Create room
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {" "}
          {rooms.map((r) => (
            <div
              key={r._id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-amber-400 hover:-translate-y-0.5 transition flex flex-col justify-between gap-3 sm:min-h-[220px]"
            >
              <div className="flex justify-between items-start gap-3">
                <h2 className="text-lg font-bold ">{r?.name}</h2>
              </div>

              <p
                className={`text-sm leading-relaxed line-clamp-3 ${
                  r?.description
                    ? "text-neutral-300"
                    : "text-neutral-500 italic"
                }`}
              >
                {r?.description || "--No Description--"}
              </p>

              <div className="flex justify-between items-center mt-3">
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(r?.joinCode);
                  }}
                  title="Click to copy"
                  className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-[0.12em] bg-neutral-800 border border-neutral-700 text-teal-300 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-neutral-700 transition"
                >
                  {r?.joinCode}
                  <BiCopy size={13} className="text-teal-300" />
                </div>

                <button
                  onClick={async () => {
                    if (!clientId) return;

                    const result = await enterRoom(clientId, "", r._id);

                    if (result === "USERNAME_REQUIRED") {
                      setSelectedRoomId(r._id);
                      setShowUsername(true);
                      return;
                    }

                    if (result) {
                      navigate(`/room/${result._id}`);
                    }
                  }}
                  className="px-4 py-1.5 rounded-md bg-teal-400 text-neutral-950 text-sm font-semibold hover:bg-teal-300 transition cursor-pointer"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>

        {publicRooms.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-neutral-200">
              Public Rooms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {publicRooms.map((r) => (
                <div
                  key={r._id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-teal-400 hover:-translate-y-0.5 transition flex flex-col justify-between gap-3 sm:min-h-[220px]"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h2 className="text-lg font-bold ">{r?.name}</h2>
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-teal-400/10 text-teal-400 border border-teal-400/30 px-2 py-0.5 rounded shrink-0">
                      Public
                    </span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed line-clamp-3 ${
                      r?.description
                        ? "text-neutral-300"
                        : "text-neutral-500 italic"
                    }`}
                  >
                    {r?.description || "--No Description--"}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-neutral-500">
                      {r?.members?.length ?? 0} member
                      {(r?.members?.length ?? 0) !== 1 ? "s" : ""}
                    </div>

                    <button
                      onClick={() => handleJoinPublicRoom(r._id, r.joinCode)}
                      className="px-4 py-1.5 rounded-md bg-teal-400 text-neutral-950 text-sm font-semibold hover:bg-teal-300 transition cursor-pointer"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Name</label>
              <input
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
                autoFocus
                placeholder="Room name"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-neutral-400">
                  Description{" "}
                  <span className="text-neutral-600">(Optional)</span>
                </label>
                <span className="text-[10px] text-neutral-500">
                  {roomDescription.length}/150
                </span>
              </div>

              <textarea
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                maxLength={150}
                rows={4}
                placeholder="What's this room about?"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {createChatroomError && (
              <p className="w-full text-sm text-red-400 -mt-2">
                {createChatroomError}
              </p>
            )}

            <button
              type="submit"
              disabled={createChatroomLoading}
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

            <button
              disabled={joinRoomLoading}
              className="px-5 py-2.5 rounded-lg bg-teal-400 text-neutral-950 text-sm font-semibold hover:bg-teal-300 transition cursor-pointer"
            >
              {joinRoomLoading ? <SyncLoader size={7} /> : "Join"}
            </button>
          </form>
        </div>
      )}

      {showEditUsername && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50"
          onClick={() => setShowEditUsername(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleEditUsername(e)}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 w-full max-w-sm flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold">Enter your new username</h2>

            <input
              onChange={(e) => setEditUsername(e.target.value)}
              value={editUsername}
              autoFocus
              placeholder="Username"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-amber-400"
            />

            <button
              disabled={enterRoomLoading}
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer"
            >
              {enterRoomLoading ? <SyncLoader size={7} /> : "Continue"}
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

            {enterRoomError && (
              <p className="w-full text-sm text-red-400 -mt-2">
                {enterRoomError}
              </p>
            )}

            <button
              disabled={enterRoomLoading}
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer"
            >
              {enterRoomLoading ? <SyncLoader size={7} /> : "Continue"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
