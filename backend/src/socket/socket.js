import { Server } from 'socket.io';
import { app } from '../app.js';
import { createServer } from 'node:http';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

const activeUser = {};

io.on('connection', socket => {
  console.log('User connected', socket.id);

  socket.on('edit-document', ({ documentId, changes }) => {
    console.log(`${socket.id} is editing the document`);
    socket.to(documentId).emit('document-changes', changes);
  });
  
  
});

export { server, io };
