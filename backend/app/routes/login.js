var controller = require("../controllers/login")()
const authMiddleware = require('../../config/middleware')

module.exports = function(app){
    app.post("/login", controller.realizarLogin);
    app.get("/logout", controller.realizarLogout);
    app.get("/me", authMiddleware, controller.verificarToken);
}