// Dummy user credentials
const validUsername = "user";
const validPassword = "password123";

// Select elements
const loginSection = document.getElementById('login-section');
const chatSection = document.getElementById('chat-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');
const logoutBtn = document.getElementById('logout-btn');

// Event listener for login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === validUsername && password === validPassword) {
        // Hide login and show chat section
        loginSection.style.display = 'none';
        chatSection.style.display = 'flex';
    } else {
        loginError.textContent = "Invalid username or password!";
    }
});

// Event listener for sending message
sendBtn.addEventListener('click', function() {
    const message = messageInput.value;
    if (message.trim() !== "") {
        // Create new message element
        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'user');
        newMessage.textContent = message;
        
        // Append the new message to the chat box
        chatBox.appendChild(newMessage);

        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear the input field
        messageInput.value = '';
    }
});

// Event listener for logout
logoutBtn.addEventListener('click', function() {
    // Show login section and hide chat section
    loginSection.style.display = 'block';
    chatSection.style.display = 'none';
});
