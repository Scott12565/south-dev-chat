//join chat DOM
const userNameInput = document.querySelector('#username');
const joinChatBtn = document.querySelector('.join-chat');
const roomInput = document.querySelector('#room-name');
const joinRoomBtn = document.querySelector('#join-room');
const activeUsers = document.querySelector('.user-list > .users > ul');

//chat box DOM
const userInput = document.querySelector('.user-input');
const msgInput = document.querySelector('.message-input');
const sendBtn = document.querySelector('.send-btn');
const chatBox = document.querySelector('.chat-box');

// using the same url as the server
const socket = io('https://southdevchat.onrender.com');

let currentRoom = ''
let user = ''

// join chat
joinChatBtn.addEventListener('click', () => {
    let newUser = userNameInput.value.trim(); 
    if (newUser) {
        user = newUser;
        socket.emit('newUser', newUser);
        userNameInput.value = '';
    }
});

// Join a room
joinRoomBtn.addEventListener('click', () => {
    let roomName = roomInput.value.trim();
    if (roomName) {
        if (currentRoom) {
            socket.emit('leaveRoom', { user, room: currentRoom });
        }
        
        currentRoom = roomName;
        socket.emit('joinRoom', { user, room: currentRoom });

        chatBox.innerHTML += `<p class="system-message">You joined room: ${currentRoom}</p>`;
        roomInput.value = '';
    }
});

// Listen for 'newUser' event and update the active users list
socket.on('newUser', (newUser) => {

    //user is not the sender then add them to active users
    if (newUser !== user) {
        const p = document.createElement('p');
        p.classList.add('join-chatp')
        p.innerText = `${newUser} has joined the chat...`;

        chatBox.appendChild(p)
        const li = document.createElement('li');
        li.innerText = `${newUser}`;
        activeUsers.appendChild(li);
    }
});

// Send a message
sendBtn.addEventListener('click', () => {
    const msg = msgInput.value.trim();
    if (msg) {
        if (currentRoom) {
            socket.emit('chatMessage', { user, msg, room: currentRoom });
        } else {
            socket.emit('chatMessage', { user, msg });
        }
        msgInput.value = '';
    }
});

// Receive messages
socket.on('chatMessage', (data) => {
    if (!data.room || data.room === currentRoom) {
        const msgDiv = document.createElement('div');

        if (data.user === user) { 
            msgDiv.classList.add('message', 'me');
            msgDiv.innerHTML = `<div><span>Me</span><p>${data.msg}</p></div>`;
        } else {
            msgDiv.classList.add('message', 'other-user');
            msgDiv.innerHTML = `<div><span>${data.user}</span><p>${data.msg}</p></div>`;
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

// Handle user leaving rooms
socket.on('userLeft', (data) => {
    const p = document.createElement('p');
    p.classList.add('system-message');
    p.innerText = `${data.user} has left ${data.room}...`;
    chatBox.appendChild(p);
});