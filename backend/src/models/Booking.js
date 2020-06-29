const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  date: String,
  // Aprovação do criador Spot
  approved: Boolean,
  // Usuário
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
  // Spot
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spot'
  }
});

module.exports = mongoose.model('Booking', BookingSchema);