// data/usuario-dao.js

class UsuarioDAO {
  #database = null;

  constructor(database) {
    this.#database = database;
  }

  findUserByEmail(email) {
    return this.#database
      .prepare('SELECT * FROM usuarios WHERE email = ?')
      .get(email);
  }

  createUser(email, nick, password) {
    const stmt = this.#database.prepare(
      'INSERT INTO usuarios (email, nick, password) VALUES (?, ?, ?)'
    );
    const info = stmt.run(email, nick, password);
    return info.lastInsertRowid;
  }
}

module.exports = UsuarioDAO;
