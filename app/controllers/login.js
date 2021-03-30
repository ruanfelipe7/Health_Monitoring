const passport = require('passport')
require("../../config/autenticacao")(passport)
const jwt = require('../../config/jwt')

module.exports = function(app){
    var controllerLogin = {};

    controllerLogin.realizarLogin = function(req, res, next) {
        passport.authenticate('local', /*{
            successRedirect: "/home",
            failureRedirect: "/login",
            failureFlash: true,
        },*/ 
            (error, usuario, info) => {
                if(error){
                    return next(error)
                }
                if(!usuario){
                    res.send("E-mail ou senha incorretos");
                }else{
                    const token = jwt.sign({id: usuario.id})
                    res.json({usuario: usuario, token: token});                        
                }})
        (req, res, next)
    }

    controllerLogin.realizarLogout = function(req, res){
            req.logOut();
            res.send("Logout realizado");
    }

    controllerLogin.verificarToken = function(req, res) {
        res.json(req.auth);
    }

    

    return controllerLogin;
}