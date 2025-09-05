import { useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

function App() {
  const [stompClient, setStompClient] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState(""); // ✅ New: user name

  const createRoom = async () => {
    if (!name.trim()) {
      alert("Enter your name first!");
      return;
    }
    const res = await axios.post("/api/room/create");
    setRoomCode(res.data);
    connect(res.data);
  };

  const joinRoom = async () => {
    if (!name.trim()) {
      alert("Enter your name first!");
      return;
    }
    if (!roomCode.trim()) {
      alert("Enter a room code first!");
      return;
    }
    const res = await axios.get(`/api/room/exists/${roomCode}`);
    if (res.data) {
      connect(roomCode);
    } else {
      alert("Invalid Room Code");
    }
  };

  const connect = (code) => {
    const socket = new SockJS("/api/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/${code}`, (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
        setJoined(true);
      },
    });
    client.activate();
    setStompClient(client);
  };

  const sendMessage = () => {
    if (stompClient && input.trim() !== "") {
      stompClient.publish({
        destination: "/app/send",
        body: JSON.stringify({
          roomCode,
          sender: name, // ✅ Use user’s name
          content: input,
        }),
      });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center shadow-lg">
        <h1 className="text-2xl font-bold">💬 Chat Web</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel: Room Controls */}
        <div className="bg-white shadow-md p-6 w-full md:w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Room</h2>

          {/* ✅ Username input */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border rounded-lg px-3 py-2 w-full mb-3"
          />

          <button
            onClick={createRoom}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full mb-4"
          >
            Create Room
          </button>

          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            className="border rounded-lg px-3 py-2 w-full mb-3"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Join Room
          </button>
        </div>

        {/* Right Panel: Chat Area */}
        <div className="flex-1 flex flex-col p-6">
          {joined ? (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Room Code: <span className="text-blue-600">{roomCode}</span>
              </h3>
              <div className="border rounded-lg p-3 flex-1 overflow-auto bg-gray-50 mb-3">
                {messages.map((m, i) => (
                  <p
                    key={i}
                    className={`mb-1 ${
                      m.sender === name
                        ? "text-green-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    <b>{m.sender}:</b> {m.content}
                  </p>
                ))}
              </div>
              <div className="flex">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 border rounded-l-lg px-3 py-2"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Enter your name and join a room to start chatting!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-3">
        <p>
          © {new Date().getFullYear()} Chat Web Created By Raj Singh
        </p>
      </footer>
    </div>
  );
}

export default App;
