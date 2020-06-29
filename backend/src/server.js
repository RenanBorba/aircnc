const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
// WebSocket
const io = socketio(server);

const connectedUsers = {};

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@omnistack9-60cwf.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Ouvir toda conexão com usuário via socket id
io.on('connection', socket => {
  const { user_id } = socket.handshake.query;
  // Relacionar user id com socket id
  connectedUsers[user_id] = socket.id;
});

// next=Seguir fluxo
app.use((req, res, next) => {
  // Disponibilizar acesso a todas rotas
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})

// Permitir acesso de qualquer app
app.use(cors());
app.use(express.json());
// Retornar arquivos estáticos
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);

server.listen(3333);