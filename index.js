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
var saveData = require('./app/controllers/dados').saveDataPacient;


let interval;
let intervalSave = 0;

io.on("connection", (socket) => {
	console.log("New client connected");
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => {
		apiEmitTemperature(socket);
		apiEmitOximeter(socket);
		apiEmitEcg(socket);
		}, 2000);
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		clearInterval(interval);
	});
});

const salvarDadosBanco = async () => {
	if(intervalSave){
		clearInterval(intervalSave);
	}
	intervalSave = setInterval(() => {
		saveData();
	}, 2000);
}

salvarDadosBanco();


// inicialização do servidor
server.listen(app.get('port'), () => {
	console.log('Servidor funcionando na porta ' + app.get('port'));
});
