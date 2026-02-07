module.exports = function (db) {
  //crear la tabla si no existe. 
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS videojuegos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      genero TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente',
      imagen TEXT, 
      fecha_creacion TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )
  `);

  stmt.run();
};