var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth');
var Database = require('../data/database');
const UsuarioDAO = require("../data/usuario-dao");
const TareaDAO = require('../data/tarea-dao');

// Inicio la base de datos y los daos necesarios

var db = Database.getInstance("db.sqlite");
var dao = new UsuarioDAO(db);
var datoTareas = new TareaDAO(db);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET admin page */
router.get('/admin', authMiddleware, function(req, res, next) {
  /* hacer una consulta a la base de datos */
  let db = new Database("db.sqlite");
  res.render('admin', { title: 'Express', user: req.session.user, layout: 'layout-admin'})
});

module.exports = router;
