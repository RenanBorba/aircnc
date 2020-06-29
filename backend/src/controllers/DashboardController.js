const Spot = require('../models/Spot');

module.exports = {
  async show(req, res) {
    const { user_id } = req.headers;

    // Busca spots feitos pelo usuário de mesmo Id
    const spots = await Spot.find({ user: user_id });

    return res.json(spots);
  }
};