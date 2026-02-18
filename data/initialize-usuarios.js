module.exports = (db) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      nick  VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;
  db.prepare(sql).run();

<<<<<<< HEAD
  //Si no hay usuarios, creo el usuario administrador
=======
  //si no hay usuarios, crea el usuario administrador
>>>>>>> 4b3541774ce697d381b2fd2fe804f6151cc571d4
  const count = db.prepare('SELECT count(*) as total FROM usuarios').get();

  if (count.total === 0) {
    db.prepare(
      'INSERT INTO usuarios (email, nick, password) VALUES (?, ?, ?)'
    ).run('admin@example.com', 'Admin', 'admin');
  }
};
