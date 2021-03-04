const passport = require('passport')
require("../../config/autenticacao")(passport)

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
                    res.send("Login efetuado com sucesso");    
                }})
        (req, res, next)
    }

    controllerLogin.realizarLogout = function(req, res){
            req.logOut();
            res.send("Logout realizado");
    }


    return controllerLogin;
}