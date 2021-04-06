var controller = require("../controllers/pacientes.js")();
const authMiddleware = require('../../config/middleware');

module.exports = function(app){

    app.post("/pacientes", controller.adicionarPaciente);

    app.get("/pacientes", controller.buscarPaciente);
    app.get("/pacientes/:id", controller.buscarPacienteIdUsuario);
    app.get("/pacientes/nome/:nome", controller.buscarPacienteNome);
    
    app.put("/pacientes/:id", controller.editarPaciente);

    app.delete("/pacientes/:id", controller.deletarPaciente);

    app.post("/pacientes/adicionarMedico", authMiddleware, controller.adicionarMedicoParaoPaciente);
}