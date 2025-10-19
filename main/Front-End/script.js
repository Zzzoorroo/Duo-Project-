//logique js
// selection
const joinScreen = document.getElementById("join");
const chatScreen = document.getElementById("chat");
const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");

let username = "";
//join the chat
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter a username!");
    return;
  }
  joinScreen.classList.remove("active");
  chatScreen.classList.add("active");
});

//send msg
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const messageEl = document.createElement("div");
  messageEl.classList.add("message");
  messageEl.innerHTML = `<b>${username}:</b> ${text}`;
  messagesDiv.appendChild(messageEl);

  messageInput.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
