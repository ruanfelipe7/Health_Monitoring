var Dados = require('../models/dados')
const conexao = require('../../config/db').con
const io = require('../../index');

//console.log(io);

module.exports = function(app){
    var controllerDados = {};

    var valorTemperatura = 0;
    var valorOximetro = 0;
    var valorEcg = 0;

    controllerDados.adicionarDados = function(req, res, next) {
  
        var data = new Date();
        let id_paciente = 16;
        let bpm = valorEcg;
        let oximetro = valorOximetro;
        let temperatura = valorTemperatura;

        var novoDado = new Dados(id_paciente, bpm, oximetro, temperatura, data)
        
        conexao.query("INSERT INTO dados SET ?", novoDado, (error, resposta) => {
            if(error){ 
                throw error
            } else {
                novoDado.id = `${resposta.insertId}`
                res.json(novoDado)
                console.log("Novo dado adicionado");
            }    
        })
        
        
    }

    controllerDados.getTemperatura = function(req, res, next){
        var dadoTemperatura = req.body.data[0];
        valorTemperatura = dadoTemperatura.Temperatura.value;
        console.log("AQUI NA TEMP: " + valorTemperatura);
        
        io.on("connection", (socket) => {
            console.log("New client connected");
            if (interval) {
              clearInterval(interval);
            }
            interval = setInterval(() => getApiAndEmit(socket), 500);
            socket.on("disconnect", () => {
              console.log("Client disconnected");
              clearInterval(interval);
            });
          });
          
          const getApiAndEmit = socket => {
            const response = new Date();
            console.log("Chamou aqui");
            const temperature = JSON.parse('{ "temperature":"'+valorTemperatura+'"}')
            socket.emit("Temperature", temperature);
          };
        
        res.send("OK");
    }

    controllerDados.getOximetro = function(req, res, next){
        var dadoOximetro = req.body.data[0];
        valorOximetro = dadoOximetro.Oximetro.value;
        console.log("AQUI NA OX: " + valorOximetro);
        res.send("OK");
    }

    controllerDados.getEcg = function(req, res, next){
        var dadoEcg = req.body.data[0];
        valorEcg = dadoEcg.Ecg.value;
        console.log("AQUI NO ECG: " + valorEcg);
        res.send("OK");
    }

    controllerDados.buscarDados = function(req, res) {
        var dados = []
        conexao.query("SELECT * FROM dados ORDER by data DESC", (error, rows) => {
            if(error){ 
                throw error;
            }else{
                dados = rows;
                res.json(dados);
            }     
        })
    }

    controllerDados.buscarDadosIdPaciente = function(req, res) {
        var id_paciente = req.params.id_paciente;
        var dados = [];
        conexao.query("SELECT * FROM dados WHERE id_paciente = ? ORDER BY data DESC", id_paciente, (error, rows) => {
            if(error){
                throw error;
            }else {
                dados = rows;
                res.json(dados);
            }
        })
    }


    controllerDados.buscarTempIdPaciente = function(req, res) {
        
        var id_paciente = req.params.id_paciente;
        var dados = [];
        conexao.query("SELECT temperatura FROM dados WHERE id_paciente = ? ORDER by data DESC", id_paciente, (error, rows) => {
            if(error) 
                throw error;
            else{
                dados = rows;
                res.json(dados)
            }                
        })
    }

    controllerDados.buscarOximetroIdPaciente = function(req, res) {
        
        var id_paciente = req.params.id_paciente;
        var dados = []
        conexao.query("SELECT oximetro FROM dados WHERE id_paciente = ?  ORDER BY data DESC", id_paciente, (error, rows) => {
            if(error) 
                throw error;
            else{
                dados = rows;
                res.json(dados);
            }                
        })   
    }

    controllerDados.buscarBPMIdPaciente = function(req, res) {
        
        var id_paciente = req.params.id_paciente;
        var dados = [];
        conexao.query("SELECT bpm FROM dados WHERE id_paciente = ? ORDER by data DESC", id_paciente, (error, rows) => {
            if(error) 
                throw error;
            else{
                dados = rows;
                res.json(dados)
            }                
        })
    }
    

    return controllerDados;

}

