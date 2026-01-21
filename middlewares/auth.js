// Middleware para gestinar las páginas protegidas.
// Esta función se ejecuta en cada solicitud HTTP recibida por el servidor.
module.exports = (req, res, next) => {
    if(req.session.user){
      next()
    }else{
      res.redirect('/login')
    }
}  