var controller = require("../controllers/login")()

module.exports = function(app){
    app.post("/login", controller.realizarLogin);
    app.get("/logout", controller.realizarLogout);
}