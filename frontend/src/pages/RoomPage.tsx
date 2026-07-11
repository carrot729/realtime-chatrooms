import React, { useEffect } from "react";
import { useParams } from "react-router";
import socket from "../lib/socket";

const RoomPage = () => {
  const { roomId } = useParams();

  useEffect(() => {
    socket.emit("join-room", roomId);

    return () => {
      socket.emit("leave-room", roomId);
    };
  }, [roomId]);

  return <div></div>;
};

export default RoomPage;
