var controller = require("../controllers/dados").controllerFunction();

module.exports = function(app){

    app.post("/dados", controller.adicionarDados);

    app.post("/dados/temperatura", controller.getTemperatura);
    app.post("/dados/oximetro", controller.getOximetro);
    app.post("/dados/bpm", controller.getBpm);
    app.post("/dados/ecg", controller.getEcg);    

    app.get("/dados", controller.buscarDados);
    //ID = ID_PACIENTE
    app.get("/dados/:id_paciente", controller.buscarDadosIdPaciente);
    app.get("/dados/temperatura/:id_paciente", controller.buscarTempIdPaciente);
    app.get("/dados/oximetro/:id_paciente", controller.buscarOximetroIdPaciente);
    app.get("/dados/bpm/:id_paciente", controller.buscarBPMIdPaciente);

    app.get("/dados/busca/data", controller.buscarDadosData);
}