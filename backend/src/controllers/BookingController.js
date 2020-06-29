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