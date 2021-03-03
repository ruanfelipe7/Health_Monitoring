var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var pacientesRouter = require("../app/routes/pacientes")
var medicosRouter = require("../app/routes/medicos")
var dadosRouter = require("../app/routes/dados")

module.exports = function() {
	var app = express();
	app.use(bodyParser.json());
	 
	// configurações
	app.use(cors());
	app.set('port', 8082);
	app.set('view engine', 'ejs');
	app.set('views', './app/views');

	// middleware - BodyParser
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json())

	//Public
	app.use(express.static('./public'));

	//Rotas
	pacientesRouter(app);
	medicosRouter(app);
	dadosRouter(app);

	return app;
};
