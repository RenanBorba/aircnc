<div align="center">

## Rocketseat - Semana OmniStack 9.0
# Projeto - API Node Armazenamento AirCnC Spots (AirCode n'Coffee)

</div>

<br>

<div align="center">

[![Generic badge](https://img.shields.io/badge/Made%20by-Renan%20Borba-purple.svg)](https://shields.io/) [![Build Status](https://img.shields.io/github/stars/RenanBorba/aircnc.svg)](https://github.com/RenanBorba/aircnc) [![Build Status](https://img.shields.io/github/forks/RenanBorba/aircnc.svg)](https://github.com/RenanBorba/aircnc) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

<br>

<div align="center">

![logo](https://user-images.githubusercontent.com/48495838/80022434-6f070e80-84b2-11ea-9125-7c281fad84e2.png)

</div>

<br>

API REST de dados Back-end em Node.js MVC, desenvolvida para clone da aplicação AirBnB, voltada para locação de spots (locais) para devs.
<br><br>

## :rocket: Tecnologias
<ul>
  <li>Nodemon</li>
  <li>MongoDB</li>
  <li>Mongoose</li>
  <li>Express</li>
  <li>Multer</li>
  <li>Routes</li>
  <li>Path</li>
  <li>Cors</li>
  <li>socket.io WebSocket</li>
</ul>

<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run dev / npm dev</li>
</ul>

<br><br><br>

## :mega: Abaixo as principais estruturas:

<br><br><br>

## src/server.js
```js
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
```

<br><br>


## src/routes.js
```js
const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const SessionController = require('./controllers/SessionController');
const SpotController = require('./controllers/SpotController');
const DashboardController = require('./controllers/DashboardController');
const BookingController = require('./controllers/BookingController');
const ApprovalController = require('./controllers/ApprovalController');
const RejectionController = require('./controllers/RejectionController');

// REST Routes - GET, POST
const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);

routes.get('/spots', SpotController.index);
routes.post('/spots', upload.single('thumbnail'), SpotController.store);

routes.get('/dashboard', DashboardController.show);

// Rota Encadeada
routes.post('/spots/:spot_id/bookings', BookingController.store);

routes.post('/bookings/:booking_id/approvals', ApprovalController.store)
routes.post('/bookings/:booking_id/rejections', RejectionController.store)

module.exports = routes;
```


<br><br>


## src/models/Spot.js
```js
const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  thumbnail: String,
  company: String,
  price: Number,
  techs: [String],
  // ObjectId do usuário que criou o spot
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  // Anexar virtuals
  toJSON: {
    virtuals: true
  }
});

// Rota virtual
SpotSchema.virtual('thumbnail_url').get(function() {
  return `http://172.28.176.1:3333/files/${this.thumbnail}`
});

module.exports = mongoose.model('Spot', SpotSchema);
```


<br><br>


## src/controllers/BookingController.js
```js
const Booking = require('../models/Booking');

module.exports = {
  async store(req, res) {
    const { user_id } = req.headers;
    // Parâmetro da rota
    const { spot_id } = req.params;
    const { date } = req.body;

    const booking = await Booking.create({
      user: user_id,
      spot: spot_id,
      date
    });

    // Popular variáveis com os dados das classes
    await booking.populate('spot').populate('user').execPopulate();

    // Buscar conexão em tempo real
    // ownerSocket=socket proprietário do spot
    const ownerSocket = req.connectedUsers[booking.spot.user];

    // Se exister uma conexão em tempo real com o owner
    if (ownerSocket) {
      // Enviar requisição para proprietário
      req.io.to(ownerSocket).emit('booking_request', booking);
    }

    return res.json(booking);
  }
};
```


<br><br>


## src/config/upload.js
```js
const multer = require('multer');
const path = require('path');

module.exports = {
  storage: multer.diskStorage({
    // __dirname = diretório global
    destination: path.resolve(__dirname,"..", "..", "uploads"),
    // Dados file, callback
    filename: (req, file, cb) => {
      /*
        Template Strings
        Nome do file no upload+data+extensão
      */
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
};
```


<br><br>


## src/controllers/ApprovalController.js
```js
const Booking = require('../models/Booking');

module.exports = {
  async store(req, res) {
    const { booking_id } =  req.params;

    const booking = await Booking.findById(booking_id).populate('spot');

    // Aprovado
    booking.approved = true;

    booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user];

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', booking);
    }

    return res.json(booking);
  }
};
```
