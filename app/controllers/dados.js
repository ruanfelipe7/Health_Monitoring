var Paciente = require('../models/paciente')
var Dados = require('../models/dados')
const conexao = require('../../config/db').con

module.exports = function(app){
    var controllerDados = {};
    
    controllerDados.adicionarDados = function(req, res) {
        var data = new Date();
        let id_paciente = 16;
        let bpm = data.getUTCSeconds();
        let oximetro = data.getHours();
        let temperatura = data.getMinutes();

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

