import { useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "./api";

function App() {
  const [stompClient, setStompClient] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");

  // ✅ Create Room
  const createRoom = async () => {
    if (!name.trim()) return alert("Enter your name first!");
    try {
      const res = await api.post("api/create"); // Updated endpoint
      setRoomCode(res.data);
      connect(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    }
  };

  // ✅ Join Room
  const joinRoom = async () => {
    if (!name.trim()) return alert("Enter your name first!");
    if (!roomCode.trim()) return alert("Enter a room code first!");
    try {
      const res = await api.get(`api/exists/${roomCode}`); // Updated endpoint
      if (res.data) connect(roomCode);
      else alert("Invalid Room Code");
    } catch (err) {
      console.error(err);
      alert("Failed to join room");
    }
  };

  // ✅ Connect WebSocket
  const connect = (code) => {
    const socket = new SockJS(
      `${
        import.meta.env.MODE === "production"
          ? "https://chatweb-production-91d6.up.railway.app"
          : ""
      }/api/chat`
    );

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

  // ✅ Send message
  const sendMessage = () => {
    if (!stompClient || !input.trim()) return;
    stompClient.publish({
      destination: "/app/send",
      body: JSON.stringify({
        roomCode,
        sender: name,
        content: input,
      }),
    });
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">💬 Chat Web</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6">
        {/* Room Controls */}
        <div className="bg-white shadow-md p-6 w-full md:w-1/3 flex flex-col items-center gap-3 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Room</h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border rounded-lg px-3 py-2 w-full"
          />

          <button
            onClick={createRoom}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
          >
            Create Room
          </button>

          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Join Room
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-4 md:p-6 rounded-lg bg-white shadow-md">
          {joined ? (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Room Code: <span className="text-blue-600">{roomCode}</span>
              </h3>

              <div className="border rounded-lg p-3 flex-1 overflow-auto bg-gray-50 mb-3 max-h-[60vh] md:max-h-[70vh]">
                {messages.map((m, i) => (
                  <p
                    key={i}
                    className={`mb-1 break-words ${
                      m.sender === name
                        ? "text-green-600 font-semibold text-right"
                        : "text-gray-800 text-left"
                    }`}
                  >
                    <b>{m.sender}:</b> {m.content}
                  </p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 border rounded-lg px-3 py-2"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
      <footer className="bg-gray-800 text-white text-center p-3 mt-auto rounded-t-lg">
        <p>© {new Date().getFullYear()} Chat Web Created By Raj Singh</p>
      </footer>
    </div>
  );
}

export default App;
