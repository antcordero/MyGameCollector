var express = require('express');
var router = express.Router();

var authMiddleware = require('../middlewares/auth');

var Database = require('../data/database');
const UsuarioDAO = require('../data/usuario-dao');
const VideojuegoDAO = require('../data/videojuego-dao');

// BD y DAOs
var db = Database.getInstance('db.sqlite');
var usuarioDAO = new UsuarioDAO(db);
var videojuegoDAO = new VideojuegoDAO(db);

/**
 * GET raiz
 */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Mi colección de videojuegos',
    user: req.session.user || null
  });
});

/**
 * GET login
 */
router.get('/login', function (req, res) {
  res.render('login', {
    title: 'Login',
    user: req.session.user || null,
    error: null
  });
});

/**
 * POST login
 */
router.post('/login', function (req, res) {
  const user = usuarioDAO.findUserByEmail(req.body.name);

  if (!user || req.body.password !== user.password) {
    return res.render('login', {
      title: 'Login',
      user: null,
      error: 'Credenciales incorrectas'
    });
  }

  //nick de ususario
  req.session.user = { email: user.email, id: user.id, nick: user.nick };
  res.redirect('/admin');
});

/**
 * GET logout
 */
router.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect('/');
});

/**
 * GET admin
 */
router.get('/admin', authMiddleware, function (req, res) {
  const filtros = {
    plataforma: req.query.plataforma || '',
    genero: req.query.genero || '',
    estado: req.query.estado || ''
  };

  const videojuegos = videojuegoDAO.findByUserId(req.session.user.id, filtros);

  res.render('videojuegos-listado', {
    title: 'Mis videojuegos',
    user: req.session.user,
    layout: 'layout-admin',
    videojuegos: videojuegos,
    filtro: filtros
  });
});

/**
 * GET /videojuegos/nuevo
 */
router.get('/videojuegos/nuevo', authMiddleware, function (req, res) {
  res.render('videojuegos-form', {
    title: 'Nuevo videojuego',
    user: req.session.user,
    layout: 'layout-admin',
    videojuego: null,
    error: null
  });
});

/**
 * POST /videojuegos
 */
router.post('/videojuegos', authMiddleware, function (req, res) {
  const { titulo, plataforma, genero, estado } = req.body;

  if (!titulo || !plataforma || !genero || !estado) {
    return res.render('videojuegos-form', {
      title: 'Nuevo videojuego',
      user: req.session.user,
      layout: 'layout-admin',
      videojuego: { titulo, plataforma, genero, estado },
      error: 'Todos los campos son obligatorios'
    });
  }

  videojuegoDAO.insert(
    req.session.user.id,
    titulo,
    plataforma,
    genero,
    estado
  );

  res.redirect('/admin');
});

/**
 * GET /videojuegos/:id/editar
 */
router.get('/videojuegos/:id/editar', authMiddleware, function (req, res) {
  const id = parseInt(req.params.id);
  const videojuego = videojuegoDAO.findByIdAndUser(id, req.session.user.id);

  if (!videojuego) {
    return res.redirect('/admin');
  }

  res.render('videojuegos-form', {
    title: 'Editar videojuego',
    user: req.session.user,
    layout: 'layout-admin',
    videojuego: videojuego,
    error: null
  });
});

/**
 * POST /videojuegos/:id/editar
 */
router.post('/videojuegos/:id/editar', authMiddleware, function (req, res) {
  const id = parseInt(req.params.id);
  const { titulo, plataforma, genero, estado } = req.body;

  if (!titulo || !plataforma || !genero || !estado) {
    return res.render('videojuegos-form', {
      title: 'Editar videojuego',
      user: req.session.user,
      layout: 'layout-admin',
      videojuego: { id, titulo, plataforma, genero, estado },
      error: 'Todos los campos son obligatorios'
    });
  }

  videojuegoDAO.update(
    id,
    req.session.user.id,
    titulo,
    plataforma,
    genero,
    estado
  );

  res.redirect('/admin');
});

/**
 * POST /videojuegos/:id/borrar
 */
router.post('/videojuegos/:id/borrar', authMiddleware, function (req, res) {
  const id = parseInt(req.params.id);
  videojuegoDAO.delete(id, req.session.user.id);
  res.redirect('/admin');
});

/**
 * GET registro
 */
router.get('/registro', function (req, res) {
  res.render('registro', {
    title: 'Registro',
    user: req.session.user || null,
    error: null,
    email: '',
    nick: ''
  });
});

/**
 * POST registro
 */
router.post('/registro', function (req, res) {
  const { email, nick, password, password2 } = req.body;

  if (!email || !nick || !password || !password2) {
    return res.render('registro', {
      title: 'Registro',
      user: null,
      error: 'Todos los campos son obligatorios',
      email,
      nick
    });
  }

  if (password !== password2) {
    return res.render('registro', {
      title: 'Registro',
      user: null,
      error: 'Las contraseñas no coinciden',
      email,
      nick
    });
  }

  const existing = usuarioDAO.findUserByEmail(email);
  if (existing) {
    return res.render('registro', {
      title: 'Registro',
      user: null,
      error: 'Ya existe un usuario con ese email',
      email,
      nick
    });
  }

  const id = usuarioDAO.createUser(email, nick, password);

  //iniciar sesión directamente tras registro
  req.session.user = { email, nick, id };
  res.redirect('/admin');
});

module.exports = router;
