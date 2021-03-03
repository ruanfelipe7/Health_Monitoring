var controller = require("../controllers/dados")();

module.exports = function(app){

    app.post("/dados", controller.adicionarDados);

    app.get("/dados", controller.buscarDados);
    //ID = ID_PACIENTE
    app.get("/dados/:id_paciente", controller.buscarDadosIdPaciente);
    app.get("/dados/temperatura/:id_paciente", controller.buscarTempIdPaciente);
    app.get("/dados/oximetro/:id_paciente", controller.buscarOximetroIdPaciente);
    app.get("/dados/bpm/:id_paciente", controller.buscarBPMIdPaciente);
}