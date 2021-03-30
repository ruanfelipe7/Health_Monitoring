var Dados = require('../models/dados')
const conexao = require('../../config/db').con

var valorTemperatura = 0;
var valorOximetro = 0;
var valorEcg = 0;
var valorTemperaturaOld = 0;

const controllerFunction = function(app){
    
    var controllerDados = {};

    controllerDados.adicionarDados = function(req, res) {
        
        var dadoAdicionado = saveDataPacient();
        res.json(dadoAdicionado);
        
    }

    controllerDados.getTemperatura = function(req, res, next){
        var dadoTemperatura = req.body.data[0];
        valorTemperatura = dadoTemperatura.Temperatura.value;
        console.log("AQUI NA TEMP: " + valorTemperatura);
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
        controllerDados.valorEcg = dadoEcg.Ecg.value;
        console.log("AQUI NO ECG: " + controllerDados.valorEcg);
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

    controllerDados.buscarDadosData = function(req, res) {
        let id_paciente = req.query.id_paciente;    
        var dataInicio = new Date(req.query.dataInicial);
        var dataFinal = new Date(req.query.dataFinal);
        
        dataFinal.setDate(dataFinal.getDate() + 1);
        dataFinal.setHours(20);
        dataFinal.setMinutes(59);
        dataFinal.setSeconds(59);
        
        console.log(dataFinal);
        conexao.query("SELECT * FROM dados WHERE id_paciente = ? AND data BETWEEN ? AND ? ", [id_paciente, dataInicio, dataFinal], (error, rows) => {
            var dadosPesquisados = [];
            if(error){
                throw error;
            }
            if(rows.length > 0){
                dadosPesquisados = rows;
                res.json(dadosPesquisados);
            }else{
                res.send("Nenhum dado encontrado entre as datas informadas");
            }
        })

    }
    

    return controllerDados;

}

const getApiAndEmitTemperature = socket => {
	    const temperature = JSON.parse('{ "temperature":"'+valorTemperatura+'", "horario": "'+new Date()+'"}')
	    socket.emit("Temperature", temperature);   
};
const getApiAndEmitOximeter = socket => {
    const oximeter = JSON.parse('{ "oximeter":"'+valorOximetro+'" , "horario": "'+new Date()+'"}')
    socket.emit("Oximeter", oximeter);   
};
const getApiAndEmitEcg = socket => {
    const ecg = JSON.parse('{ "Ecg":"'+valorEcg+'", "horario": "'+new Date()+'"}')
    socket.emit("Ecg", ecg);   
};

const saveDataPacient = function(){
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
                console.log("Novo dado adicionado");
                novoDado.id = `${resposta.insertId}`
                return novoDado;
            }    
        })
}

const deletarTodosDados = function(){
	conexao.query("DELETE FROM dados", (error, result) => {
		if(error){
			console.error(error);
			return;
		}
		console.log("Linhas deletadas da tabela dados ", `${result.affectedRows}`)          
	})
}

const cleanDados = function(qtd){
    conexao.query("SELECT COUNT(*) AS dadosCount FROM dados", (error, result) => {
        if(error){
            console.error(error);
            return;
        }
        if(result[0].dadosCount > qtd){
            deletarTodosDados();
        }
    })
}

module.exports = {
    controllerFunction,
    getApiAndEmitTemperature,
    getApiAndEmitOximeter,
    getApiAndEmitEcg,
    saveDataPacient,
    cleanDados
}
