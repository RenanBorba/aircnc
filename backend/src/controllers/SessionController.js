// Regra de Negócio
// CRUD - Index, show, store

// req.query = Acessar query params -> p/filtros
// req.params = Acessar route params -> p/edição, delete
// req.body = Acessar corpo requisição -> p/criação, edição

const User = require('../models/User')

module.exports = {
  async store(req, res) {
    const { email } = req.body;

    // Busca por um email
    let user = await User.findOne({ email });
    if (!user) {
      // Criar, Se não existir Usuário
      user = await User.create({ email });
    }
    // const user = await User.create({ email })

    return res.json(user);
  }
};
