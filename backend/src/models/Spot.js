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
