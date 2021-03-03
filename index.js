// carregamento de módulos
var config = require('./config/express');
var app = config();

//Conexão com o Banco de Dados
const con = require('./config/db').con;
const connect = require('./config/db').connect;
connect(con);

// inicialização do servidor
app.listen(app.get('port'), () => {
	console.log('Servidor funcionando na porta ' + app.get('port'));
});
