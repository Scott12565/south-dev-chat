# south-dev-chat

so this chat ill be learning socket.io by creating a chat app called south dev chat

# Featurs to look for
- user join global chat 
- users can join rooms for private message
- real time update when user join chat, join room and leaving chat or room

# how to use socket.io
- In the server use io.on which takes a connection event to listen for connection between connected client and server.
- use the socket.on to listen for certain events like message
when client send a message to the server
- Use io.emit to broadcast a message to connected clients (all of them)
- e the socket.emit to broadcast a message to the connect client
excluding other clients
- In the client use socket.on to listen for events like 
message from the server.
- use socket.emit to send a message to the server.

- use socket.join to join a room
- io.to().emeit to send a message to all clients that joined a certain room