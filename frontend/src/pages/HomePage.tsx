import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home">
      <div className="container">
        <div className="header">
          <h1>Socket.IO Chat</h1>
          <div>
            <button className="create-room-btn">+ Create Room</button>
            <button className="create-room-btn">+ Create Room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
