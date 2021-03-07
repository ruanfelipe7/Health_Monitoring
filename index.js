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


module.exports = io;

// inicialização do servidor
server.listen(app.get('port'), () => {
	console.log('Servidor funcionando na porta ' + app.get('port'));
});
