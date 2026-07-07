import React from "react";
import "./HomePage.css";

const rooms = [
  { id: 1, name: "General Chat" },
  { id: 2, name: "Gaming" },
  { id: 3, name: "Programming" },
];

const HomePage = () => {
  return (
    <div className="home">
      <div className="container">
        <div className="header">
          <h1>Socket.IO Chat</h1>
          <button className="create-room-btn">+ Create Room</button>
        </div>

        <div className="rooms">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h2>{room.name}</h2>
              <button className="join-btn">Join Room</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
