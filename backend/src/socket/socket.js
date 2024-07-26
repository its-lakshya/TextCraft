import { Server } from 'socket.io';
import { app } from '../app.js';
import { createServer } from 'node:http';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

const activeUser = {};

io.on('connection', socket => {
  console.log('User connected', socket.id);

  socket.on('edit-document', ({ documentId, changes }) => {
    console.log(`${socket.id} is editing the document`);
    socket.to(documentId).emit('document-changes', {socketId:socket.id, changes});
  });

  socket.on('join-document', ({ documentId, userDetails }) => {
    console.log(`User joind the room ${userDetails.userName}`);
    socket.join(documentId);
    activeUser[socket.id] = {userDetails, documentId};
    socket.to(documentId).emit('joined-user', userDetails);
    io.to(documentId).emit('update-active-users', Object.values(activeUser));
  });

  socket.on('disconnect', () => {
    const data = activeUser[socket.id];
    
    if (data && data?.userDetails) {
      socket.to(data.documentId).emit('disconnected-user', data.userDetails);
      delete activeUser[socket.id];
      io.to(data.documentId).emit('update-active-users', Object.values(activeUser));
    }
  });

  socket.on('error', error => {
    console.error(`Socket error: ${error.message}`);
  });
});

export { server, io };
