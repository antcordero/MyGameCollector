class Database {
  static db = null;

  constructor() {
    throw new Error('No se puede instanciar. Usa .getInstance para inicializarla');
  }

  static getInstance(dbPath) {
    if (Database.db === null) {
      if (!dbPath) {
        throw new Error('dbPath es requerido para la primera inicialización');
      } else {
        const BetterSqlite3 = require('better-sqlite3');
        Database.db = new BetterSqlite3(dbPath);

        // Inicializar tablas
        require('./initialize-usuarios')(Database.db);
        require('./initialize-videojuegos')(Database.db);
      }
    }
    return Database.db;
  }

  static prepare(sql) {
    return Database.db.prepare(sql);
  }
}

module.exports = Database;
