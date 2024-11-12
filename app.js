const socket = io();

const roomSelection = document.getElementById("room-selection");
const chatRoom = document.getElementById("chat-room");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const joinRoomButton = document.getElementById("join-room");
const sendMessageButton = document.getElementById("send-message");

let username = "";
let room = "";

// Join a chat room
joinRoomButton.addEventListener("click", () => {
    username = usernameInput.value.trim();
    room = roomInput.value.trim();
    if (username && room) {
        socket.emit("joinRoom", { username, room });
        roomSelection.style.display = "none";
        chatRoom.style.display = "block";
    }
});

// Send a message
sendMessageButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chatMessage", message);
        messageInput.value = "";
    }
});


// Receive messages
socket.on("message", (data) => {
    const div = document.createElement("div");
    div.textContent = `${data.username} (${data.time}): ${data.message}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});
