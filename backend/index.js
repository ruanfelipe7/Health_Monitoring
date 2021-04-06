// carregamento de módulos
var config = require('./config/express');
var app = config();
const http = require('http');
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
//Conexão com o Banco de Dados
const con = require('./config/db').con;
const connect = require('./config/db').connect;
connect(con);


var apiEmitTemperature = require('./app/controllers/dados').getApiAndEmitTemperature;
var apiEmitOximeter = require('./app/controllers/dados').getApiAndEmitOximeter;
var apiEmitEcg = require('./app/controllers/dados').getApiAndEmitEcg;
var apiEmitBpm = require('./app/controllers/dados').getApiAndEmitBpm;

var verifyTemperature = require('./app/controllers/dados').verifyTemperature;
var verifyBPM = require('./app/controllers/dados').verifyBPM;
var verifyOximeter = require('./app/controllers/dados').verifyOximeter;

var saveData = require('./app/controllers/dados').saveDataPacient;
var cleanData = require('./app/controllers/dados').cleanDados;

let interval;
let interval2;
let interval3;
let interval4;
let intervalSave = 0;

var maxAlertsTemperature = 3;
var maxAlertsBPM = 10;
var maxAlertsOximeter = 10;


var timeMinAlert = 30;


io.on("connection", (socket) => {
	console.log("New client connected");
	if (interval) {
		clearInterval(interval);
	}
	if (interval2) {
		clearInterval(interval2);
	}
	if (interval3) {
		clearInterval(interval3);
	}
	if (interval4) {
		clearInterval(interval4);
	}
	interval = setInterval(() => { apiEmitTemperature(socket); 
									verifyTemperature(maxAlertsTemperature, timeMinAlert); }, 2000);
	interval2 = setInterval(() => { apiEmitEcg(socket); }, 100);
	
	interval3 = setInterval(() => { apiEmitOximeter(socket);
									verifyOximeter(maxAlertsOximeter, timeMinAlert); }, 2000);
	
									interval4 = setInterval(() => { apiEmitBpm(socket); 
									verifyBPM(maxAlertsBPM, timeMinAlert); }, 2000);
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		clearInterval(interval);
		clearInterval(interval2);
		clearInterval(interval3);
		clearInterval(interval4);
	});
});



const salvarDeletarDadosBanco = async () => {
	if(intervalSave){
		clearInterval(intervalSave);
	}
	intervalSave = setInterval(() => {
		cleanData(200);
		saveData();
	}, 2000);
}

salvarDeletarDadosBanco();


// inicialização do servidor
server.listen(app.get('port'), () => {
	console.log('Servidor funcionando na porta ' + app.get('port'));
});
