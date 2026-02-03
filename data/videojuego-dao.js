// data/videojuego-dao.js

class VideojuegoDAO {
  constructor(database) {
    this.database = database;
  }

  // Lista por usuario con filtros opcionales
  findByUserId(idUsuario, filtros = {}) {
    let sql = 'SELECT * FROM videojuegos WHERE id_usuario = ?';
    const params = [idUsuario];

    if (filtros.plataforma) {
      sql += ' AND plataforma = ?';
      params.push(filtros.plataforma);
    }
    if (filtros.genero) {
      sql += ' AND genero = ?';
      params.push(filtros.genero);
    }
    if (filtros.estado) {
      sql += ' AND estado = ?';
      params.push(filtros.estado);
    }

    sql += ' ORDER BY fecha_creacion DESC';

    return this.database.prepare(sql).all(...params);
  }

  findByIdAndUser(id, idUsuario) {
    const stmt = this.database.prepare(
      'SELECT * FROM videojuegos WHERE id = ? AND id_usuario = ?'
    );
    return stmt.get(id, idUsuario);
  }

  insert(idUsuario, titulo, plataforma, genero, estado) {
    const stmt = this.database.prepare(`
      INSERT INTO videojuegos (id_usuario, titulo, plataforma, genero, estado)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(idUsuario, titulo, plataforma, genero, estado);
    return info.lastInsertRowid;
  }

  update(id, idUsuario, titulo, plataforma, genero, estado) {
    const stmt = this.database.prepare(`
      UPDATE videojuegos
      SET titulo = ?, plataforma = ?, genero = ?, estado = ?
      WHERE id = ? AND id_usuario = ?
    `);
    return stmt.run(titulo, plataforma, genero, estado, id, idUsuario);
  }

  delete(id, idUsuario) {
    const stmt = this.database.prepare(
      'DELETE FROM videojuegos WHERE id = ? AND id_usuario = ?'
    );
    return stmt.run(id, idUsuario);
  }
}

module.exports = VideojuegoDAO;
