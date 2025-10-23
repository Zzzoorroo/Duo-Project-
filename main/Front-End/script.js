// --- 1. Variable Selections ---
const joinScreen = document.getElementById("join");
const chatScreen = document.getElementById("chat");
const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password"); // New: Password input
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");
const usersParagraph = document.getElementById("users");
const themeToggleBtn = document.getElementById("themeToggle"); // New: Theme toggle button

let username = "";
let password = "";
let socket; // Socket.IO variable

// --- 2. Helper Functions ---

/**
 * Formats the timestamp for display.
 */
function formatTimestamp(isoTimestamp) {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Renders a new message into the chat.
 */
function displayMessage(msg, isMine = false) {
    const messageEl = document.createElement("div");
    messageEl.classList.add("message");
    
    if (isMine) {
        messageEl.classList.add("mine");
    } else {
        messageEl.classList.add("other");
    }

    // Basic sanitization
    const sanitizedText = msg.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const time = formatTimestamp(msg.timestamp);

    messageEl.innerHTML = `
        <b>${msg.username}</b> ${sanitizedText}
        <span class="timestamp">${time}</span>
    `;
    
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}

function displaySystemMessage(text) {
    const messageEl = document.createElement("div");
    messageEl.classList.add("message", "system");
    messageEl.textContent = text;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

 // Load message history 
 
function loadMessageHistory(messages) {
    messages.forEach(msg => {
        displayMessage(msg, msg.username === username);
    });
}

// --- 3. Socket Listener Setup Function ---

function setupSocketListeners() {
    socket.on('message', (msg) => {
        if (msg.username !== username) {
            displayMessage(msg, false);
        }
    });

    socket.on('history', (messages) => {
        // Clear previous history and load new messages
        messagesDiv.innerHTML = '';
        loadMessageHistory(messages); 
    });
    
    // System messages (user joined/left)
    socket.on('user-joined', (data) => {
        displaySystemMessage(`${data.username} has joined the chat.`);
        // --- Update user count ---
    socket.on('updateUserCount', (count) => {
    const usersParagraph = document.getElementById('users-count');
    if (usersParagraph) {
        usersParagraph.textContent = `👥 Users online: ${count}`;
    }
   });

  
    });
    
    socket.on('user-left', (data) => {
        displaySystemMessage(`${data.username} has left the chat.`);
        // --- Update user count ---
     socket.on('updateUserCount', (count) => {
    const usersParagraph = document.getElementById('users-count');
    if (usersParagraph) {
        usersParagraph.textContent = `👥 Users online: ${count}`;
    }
});

    });
    socket.on('userTyping', (data)=>{
    showTypingIndicator(`${data.username} is typing...`);
    });
    socket.on('usernotTyping',(data)=>{
    hideTypingIndicator();
    });

    // Connection feedback and errors
    socket.on('connect', () => {
        console.log('Socket connected successfully!');
        displaySystemMessage('Connection established. Welcome!');
    });
    
    socket.on('disconnect', () => {
        displaySystemMessage('You have been disconnected. Reconnecting...');
    });

    socket.on('auth-error', (message) => {
        alert("Authentication Error: " + message);
        socket.disconnect(true);
        // Optionally, reset the UI back to the join screen
        chatScreen.classList.remove("active");
        joinScreen.classList.add("active");
    });
}

// --- 4. Main Event Handlers (Join, Send, Emoji) ---

// Join the chat (Username/Password)
joinBtn.addEventListener("click", () => {
    username = usernameInput.value.trim();
    password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Username and password are required!");
        return;
    }
    
    // ESTABLISH SOCKET CONNECTION
    socket = io('http://localhost:3000'); // localhost to be changed to backend URL for deployement  
    
    setupSocketListeners();
    
    // Hide join screen, show chat screen
    joinScreen.classList.remove("active");
    chatScreen.classList.add("active");
    
    //emit join event
    socket.emit('join', { username, password }); 
    
    displaySystemMessage("Attempting to connect and authenticate...");
});

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !socket) return;

    // Display the message locally immediately
    const msgPayload = {
        username: username,
        text: text,
        timestamp: new Date().toISOString()
    };
    displayMessage(msgPayload, true);
    socket.emit('message', { text: text });
    messageInput.value = "";

}

// Bind send message to button and Enter key
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Emoji Button (Placeholder)
emojiBtn.addEventListener("click", () => {
    alert("Placeholder: Emoji picker feature coming soon! Inserting a 🌟.");
    messageInput.value += " 🌟";
    messageInput.focus();
});

// --- 5. THEME TOGGLE LOGIC ---

/**
 * Toggles the 'light-theme' class on the body.
 */
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    // Change the button icon and store the preference
    themeToggleBtn.textContent = isLight ? '🌙' : '💡';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

/**
 * Checks for a saved theme preference on load and applies it.
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark if no preference is saved
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.textContent = '🌙';
    } else {
        themeToggleBtn.textContent = '💡';
    }
}

// --- 6. INITIALIZATION CALLS ---

// Apply the saved theme preference immediately when the script runs
applySavedTheme();

// Add event listener to the toggle button
themeToggleBtn.addEventListener('click', toggleTheme);