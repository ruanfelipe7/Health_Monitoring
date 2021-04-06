var Dados = require('../models/dados')
const conexao = require('../../config/db').con
const sendEmail = require('../../config/email').sendEmail;

var valorTemperatura = 36;
var valorOximetro = 95;
var valorEcg = 0;
var valorBpm = 70;
var errosTemperatura = 0;
var errosBPM = 0;
var errosOximetro = 0;
// var countMsg = 0;
// var latenciaTotal = 0;
var tempoAlertaTemperatura = 0;
var tempoAlertaBPM = 0;
var tempoAlertaOximetro = 0;

const controllerFunction = function (app) {

    var controllerDados = {};

    controllerDados.adicionarDados = function (req, res) {

        var dadoAdicionado = saveDataPacient();
        res.json(dadoAdicionado);

    }

    controllerDados.getTemperatura = function (req, res, next) {
        var dadoTemperatura = req.body.data[0];
        valorTemperatura = dadoTemperatura.Temperatura.value;
        //console.log("TEMPERATURA: " + valorTemperatura);
        // valorTemperatura = parseInt(dadoTemperatura.Temperatura.value);
        // countMsg++;
        // var instanteAtual = new Date();

        // var atual = (instanteAtual.getSeconds()*1000)+ instanteAtual.getMilliseconds();
        // var latencia = atual - valorTemperatura;
        // if(latencia < 0) {
        //     latencia += 60000;
        // }        
        // latenciaTotal+=latencia;
        // console.log("**Temperatura**")
        // console.log("atual : "+atual);
        // console.log("recebido: " + valorTemperatura);
        // console.log("latencia: "+latencia);
        // console.log("Quantidade msgs : "+countMsg);
        // if(countMsg > 0) console.log("Latencia Media : "+latenciaTotal/countMsg);
        // console.log("\n");
        res.send("OK");
    }

    controllerDados.getOximetro = function (req, res, next) {
        var dadoOximetro = req.body.data[0];
        valorOximetro = dadoOximetro.Oximetro.value;
        //console.log("Oximetro: " + valorOximetro);
        // valorOximetro = parseInt(dadoOximetro.Oximetro.value);
        // countMsg++;
        // var instanteAtual = new Date();

        // var atual = (instanteAtual.getSeconds()*1000)+ instanteAtual.getMilliseconds();
        // var latencia = atual - valorOximetro;
        // if(latencia < 0) {
        //     latencia += 60000;
        // }        
        // latenciaTotal+=latencia;
        // console.log("**Oximetro**")
        // console.log("atual : "+atual);
        // console.log("recebido: " + valorOximetro);
        // console.log("latencia: "+latencia);
        // console.log("Quantidade msgs : "+countMsg);
        // if(countMsg > 0) console.log("Latencia Media : "+latenciaTotal/countMsg);
        // console.log("\n");
        res.send("OK");
    }

    controllerDados.getEcg = function (req, res, next) {
        var dadoEcg = req.body.data[0];
        valorEcg = dadoEcg.Ecg.value;
        //console.log("ECG2: " + valorEcg);
        // valorEcg = parseInt(dadoEcg.Ecg.value);
        // countMsg++;
        // var instanteAtual = new Date();

        // var atual = (instanteAtual.getSeconds()*1000)+ instanteAtual.getMilliseconds();
        // var latencia = atual - valorEcg;
        // if(latencia < 0) {
        //     latencia += 60000;
        // }        
        // latenciaTotal+=latencia;
        // console.log("**ECG**")
        // console.log("atual : "+atual);
        // console.log("recebido: " + valorEcg);
        // console.log("latencia: "+latencia);
        // console.log("Quantidade msgs : "+countMsg);
        // if(countMsg > 0) console.log("Latencia Media : "+latenciaTotal/countMsg);
        // console.log("\n");
        res.send("OK");
    }

    controllerDados.getBpm = function (req, res, next) {
        var dadoBpm = req.body.data[0];
        valorBpm = dadoBpm.BPM.value;
        //console.log("BPM: " + valorBpm);
        // valorEcg = parseInt(dadoEcg.Ecg.value);
        // countMsg++;
        // var instanteAtual = new Date();

        // var atual = (instanteAtual.getSeconds()*1000)+ instanteAtual.getMilliseconds();
        // var latencia = atual - valorEcg;
        // if(latencia < 0) {
        //     latencia += 60000;
        // }        
        // latenciaTotal+=latencia;
        // console.log("**ECG**")
        // console.log("atual : "+atual);
        // console.log("recebido: " + valorEcg);
        // console.log("latencia: "+latencia);
        // console.log("Quantidade msgs : "+countMsg);
        // if(countMsg > 0) console.log("Latencia Media : "+latenciaTotal/countMsg);
        // console.log("\n");
        res.send("OK");
    }

    controllerDados.buscarDados = function (req, res) {
        var dados = []
        conexao.query("SELECT * FROM dados ORDER by data DESC", (error, rows) => {
            if (error) {
                throw error;
            } else {
                dados = rows;
                res.json(dados);
            }
        })
    }

    controllerDados.buscarDadosIdPaciente = function (req, res) {
        var id_paciente = req.params.id_paciente;
        var dados = [];
        conexao.query("SELECT * FROM dados WHERE id_paciente = ? ORDER BY data DESC", id_paciente, (error, rows) => {
            if (error) {
                throw error;
            } else {
                dados = rows;
                res.json(dados);
            }
        })
    }


    controllerDados.buscarTempIdPaciente = function (req, res) {

        var id_paciente = req.params.id_paciente;
        var dados = [];
        conexao.query("SELECT temperatura FROM dados WHERE id_paciente = ? ORDER by data DESC", id_paciente, (error, rows) => {
            if (error)
                throw error;
            else {
                dados = rows;
                res.json(dados)
            }
        })
    }

    controllerDados.buscarOximetroIdPaciente = function (req, res) {

        var id_paciente = req.params.id_paciente;
        var dados = []
        conexao.query("SELECT oximetro FROM dados WHERE id_paciente = ?  ORDER BY data DESC", id_paciente, (error, rows) => {
            if (error)
                throw error;
            else {
                dados = rows;
                res.json(dados);
            }
        })
    }

    controllerDados.buscarBPMIdPaciente = function (req, res) {

        var id_paciente = req.params.id_paciente;
        var dados = [];
        conexao.query("SELECT bpm FROM dados WHERE id_paciente = ? ORDER by data DESC", id_paciente, (error, rows) => {
            if (error)
                throw error;
            else {
                dados = rows;
                res.json(dados)
            }
        })
    }

    controllerDados.buscarDadosData = function (req, res) {
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
            if (error) {
                throw error;
            }
            if (rows.length > 0) {
                dadosPesquisados = rows;
                res.json(dadosPesquisados);
            } else {
                res.send("Nenhum dado encontrado entre as datas informadas");
            }
        })

    }


    return controllerDados;

}

const getApiAndEmitTemperature = socket => {
    console.log("TEMPERATURA: " + valorTemperatura);
    const temperature = JSON.parse('{ "temperature":"' + valorTemperatura + '", "horario": "' + new Date() + '"}')
    socket.emit("Temperature", temperature);
};
const getApiAndEmitOximeter = socket => {
    console.log("OXIMETRO: " + valorOximetro);
    const oximeter = JSON.parse('{ "oximeter":"' + valorOximetro + '" , "horario": "' + new Date() + '"}')
    socket.emit("Oximeter", oximeter);
};
const getApiAndEmitBpm = socket => {
    console.log("BPM: " + valorBpm);
    const BPM = JSON.parse('{ "BPM":"' + valorBpm + '", "horario": "' + new Date() + '"}')
    socket.emit("BPM", BPM);
};
const getApiAndEmitEcg = socket => {
    //console.log("ECG: " + valorEcg);
    const ECG = JSON.parse('{ "ECG":"' + valorEcg + '", "horario": "' + new Date() + '"}')
    socket.emit("ECG", ECG);
};

const verifyTemperature = function (maxAlerts, timeMin) {
    if (valorTemperatura < 35 || valorTemperatura > 37.5) {
        errosTemperatura += 1;
        console.log("Erros temperatura : " + errosTemperatura);
    } else {
        errosTemperatura = 0;
    }
    if (errosTemperatura >= maxAlerts) {
        if (tempoAlertaTemperatura == 0) {
            tempoAlertaTemperatura = new Date().getTime();

            var subject = "Saúde em risco";
            var text = "A temperatura do paciente está fora dos padrões normais de saúde - ";
            var destiny = "felipealmeida903@alu.ufc.br";
            sendEmail(subject, text, destiny);

        } else {
            var atual = new Date().getTime();
            if ((atual - tempoAlertaTemperatura) >= (timeMin * 60000)) {
                tempoAlertaTemperatura = atual;

                var subject = "Saúde em risco";
                var text = "A temperatura do paciente está fora dos padrões normais de saúde - ";
                var destiny = "felipealmeida903@alu.ufc.br";
                sendEmail(subject, text, destiny);
            }
        }

        errosTemperatura = 0;
    }
}


const verifyBPM = function (maxAlerts, timeMin) {
    if (valorBpm > 105 || valorBpm < 60) {
        errosBPM += 1;
        console.log("Erros BPM  : " + errosBPM);
    } else {
        errosBPM = 0;
    }
    if (errosBPM >= maxAlerts) {
        if (tempoAlertaBPM == 0) {
            tempoAlertaBPM = new Date().getTime();

            var subject = "Saúde em risco";
            var text = "Os batimentos cardíacos do paciente estão fora dos padrões normais de saúde - ";
            var destiny = "felipealmeida903@alu.ufc.br";
            sendEmail(subject, text, destiny);

        } else {
            var atual = new Date().getTime();
            if ((atual - tempoAlertaBPM) >= (timeMin * 60000)) {
                tempoAlertaBPM = atual;
                var subject = "Saúde em risco";
                var text = "Os batimentos cardíacos do paciente estão fora dos padrões normais de saúde - ";
                var destiny = "felipealmeida903@alu.ufc.br";
                sendEmail(subject, text, destiny);
            }
        }

        errosBPM = 0;

    }
}

const verifyOximeter = function (maxAlerts) {
    if (valorOximetro < 90) {
        errosOximetro += 1;
        console.log("Erros oximetro : " + errosOximetro);
    } else {
        errosOximetro = 0;
    }
    if (errosOximetro >= maxAlerts) {
        
        if (tempoAlertaOximetro == 0) {
            tempoAlertaOximetro = new Date().getTime();
            
            var subject = "Saúde em risco";
            var text = "A concentração de oxigênio do paciente está fora dos padrões normais de saúde - ";
            var destiny = "felipealmeida903@alu.ufc.br";
            sendEmail(subject, text, destiny);

        } else {
            var atual = new Date().getTime();
            if ((atual - tempoAlertaOximetro) >= (timeMin * 60000)) {
                tempoAlertaOximetro = atual;
                var subject = "Saúde em risco";
                var text = "A concentração de oxigênio do paciente está fora dos padrões normais de saúde - ";
                var destiny = "felipealmeida903@alu.ufc.br";
                sendEmail(subject, text, destiny);
            }
        }

        errosOximetro = 0;
    }
}


const saveDataPacient = function () {
    var data = new Date();
    let id_paciente = 16;
    let bpm = valorEcg;
    let oximetro = valorOximetro;
    let temperatura = valorTemperatura;

    var novoDado = new Dados(id_paciente, bpm, oximetro, temperatura, data)

    conexao.query("INSERT INTO dados SET ?", novoDado, (error, resposta) => {
        if (error) {
            throw error
        } else {
            //console.log("Novo dado adicionado");
            novoDado.id = `${resposta.insertId}`
            return novoDado;
        }
    })
}

const deletarTodosDados = function () {
    conexao.query("DELETE FROM dados", (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log("----------------------------------------");
        console.log("Linhas deletadas da tabela dados ", `${result.affectedRows}`)
        console.log("----------------------------------------");
    })
}

const cleanDados = function (qtd) {
    conexao.query("SELECT COUNT(*) AS dadosCount FROM dados", (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        if (result[0].dadosCount > qtd) {
            deletarTodosDados();
        }
    })
}

module.exports = {
    controllerFunction,
    getApiAndEmitTemperature,
    getApiAndEmitOximeter,
    getApiAndEmitBpm,
    getApiAndEmitEcg,
    verifyTemperature,
    verifyBPM,
    verifyOximeter,
    saveDataPacient,
    cleanDados
}
