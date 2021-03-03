var controller = require("../controllers/medicos")();

module.exports = function(app){

    app.post("/medicos", controller.adicionarMedico);

    app.get("/medicos", controller.buscarMedico);
    app.get("/medicos/:id", controller.buscarMedicoIdUsuario);
    app.get("/medicos/nome/:nome", controller.buscarMedicoNome);
    
    app.put("/medicos/:id", controller.editarMedico);

    app.delete("/medicos/:id", controller.deletarMedico);

}