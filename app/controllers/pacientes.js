var Usuario = require('../models/usuario')
var Paciente = require('../models/paciente')
const bcrypt = require('bcryptjs')
const conexao = require('../../config/db').con


module.exports = function(app){

    var controllerPacientes = {}

    controllerPacientes.adicionarPaciente = function(req, res) {
        var erros = [];
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome do Paciente Inválido"})
        }
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: "CPF do Paciente Inválido"})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "E-mail do Paciente Inválido"})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: "Senha do Paciente Inválida"})
        }
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: "Telefone do Paciente Inválido"})
        }
        if(erros.length > 0){
            console.log(erros)
            return;
        }

        let nome = req.body.nome;
        let cpf = req.body.cpf;
        let email = req.body.email;
        let telefone = req.body.telefone;
        let tipo = "paciente";
        
        bcrypt.hash(req.body.senha, 10).then((senha) => {  //crtiptografando a senha
            
            var novoUsuario = new Usuario(nome, cpf, email, senha, telefone, tipo)
            
            conexao.query("INSERT INTO usuarios SET ?", novoUsuario, (error, resposta) => {
                if(error){
                    console.error(error);
                }else{
                    console.log("Novo usuario adicionado");
                }
                novoUsuario.id = `${resposta.insertId}`
                var novoPaciente = new Paciente(novoUsuario.id)
        
                conexao.query("INSERT INTO pacientes SET ?", novoPaciente, (error, resposta) => {
                    if(error){
                        console.error(error);
                    }else{
                        console.log("Novo paciente adicionado");
                        novoPaciente.id = `${resposta.insertId}`
                        res.json({usuario: novoUsuario, paciente: novoPaciente})
                    }
                })
            })
        
        }).catch((error) => { //Erro ao criptografar a senha
            throw error
        })
        
    }

    controllerPacientes.buscarPaciente = function(req, res) {
        var pacientes = [];
        
        conexao.query(" SELECT * FROM usuarios as A INNER JOIN pacientes as B on A.id = B.id_usuario WHERE tipo = 'paciente'", (error, rows) => {
            if(error){
                throw error;
            }
            pacientes = rows;
            res.json(pacientes)                
        })
        
    }

    controllerPacientes.buscarPacienteIdUsuario = function(req, res) {
        
        var id_paciente = req.params.id;
        var paciente;
        conexao.query("SELECT id_usuario FROM pacientes WHERE id = ?", id_paciente, (error, rows) => {
            if(error) 
                throw error;
            var id_usuario = rows[0].id_usuario;
            conexao.query(" SELECT * FROM usuarios as A INNER JOIN pacientes as B on A.id = B.id_usuario WHERE A.id = ?", id_usuario, (error, rows) => {
                if(error){
                    throw error;
                }
                paciente = rows[0];
                res.json(paciente)                
            })   
        })
    }

    controllerPacientes.buscarPacienteNome = function(req, res) {
        var nome = req.params.nome   
        var busca = '%' + nome + '%'
        var pacientes = []
        conexao.query(" SELECT * FROM usuarios as A INNER JOIN pacientes as B on A.id = B.id_usuario WHERE nome LIKE ?", busca, (error, rows) => {
            if(error){
                throw error;
            }
            pacientes = rows;
            res.json(pacientes);                
        })
    }
    
    controllerPacientes.editarPaciente = function(req, res) {
        var erros = [];
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome do Paciente Inválido"})
        }
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: "CPF do Paciente Inválido"})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "E-mail do Paciente Inválido"})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: "Senha do Paciente Inválida"})
        }
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: "Telefone do Paciente Inválido"})
        }
        if(erros.length > 0){
            console.log(erros)
        }
        const id_paciente = req.params.id
        conexao.query("SELECT id_usuario FROM pacientes WHERE id = ?", id_paciente, (error, rows) => {
            if(error) 
                throw error;
             
            var id_usuario = rows[0].id_usuario    
            var usuario = {
                nome: req.body.nome,
                cpf: req.body.cpf,
                email: req.body.email,
                senha: req.body.senha,
                telefone: req.body.telefone, 
            }
            conexao.query("UPDATE usuarios SET nome = ?, cpf = ?, email = ?, senha = ?, telefone = ? WHERE id = ?", [usuario.nome, usuario.cpf, usuario.email, usuario.senha, usuario.telefone, id_usuario], (error, result) => {
                if(error){
                    console.log(error);
                }else{
                    res.json(usuario)
                }  
            })
        })
    }

    controllerPacientes.deletarPaciente = function(req, res){
        const id_paciente = req.params.id
        conexao.query("SELECT id_usuario FROM pacientes WHERE id = ?", id_paciente, (error, rows) => {
            if(error) 
                throw error;
            
            const id_usuario = rows[0].id_usuario
                
            conexao.query("DELETE FROM pacientes WHERE id = ?", id_paciente, (error, result) => {
                if(error){
                    console.error(error);
                    return
                }
                console.log("Linhas deletadas da tabela paciente ", `${result.affectedRows}`)           
            })
    
            conexao.query("DELETE FROM usuarios WHERE id = ? and tipo = 'paciente'", id_usuario, (error, result) => {
                if(error){
                    console.error(error);
                    return
                }
                console.log("Linhas deletadas da tabela usuário ", `${result.affectedRows}`)
                res.sendStatus(200)        
            })
        })
        
    }

    return controllerPacientes

}