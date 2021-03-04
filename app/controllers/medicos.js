var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
const bcrypt = require('bcryptjs')

const conexao = require('../../config/db').con

var controllerMedicos = {}

module.exports = function(app){

    controllerMedicos.adicionarMedico = function(req, res) {
        var erros = [];
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome do medico Inválido"})
        }
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: "CPF do medico Inválido"})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "E-mail do medico Inválido"})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: "Senha do medico Inválida"})
        }
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: "Telefone do medico Inválido"})
        }
        if(!req.body.especialidade || typeof req.body.especialidade == undefined || req.body.especialidade == null){
            erros.push({texto: "Especialidade do medico Inválida"})
        }
        if(erros.length > 0){
            res.send("Erro ao cadastrar o medico")
            console.log(erros)
            res.render('medico_novo', {erros: erros});
        }

        let nome = req.body.nome;
        let cpf = req.body.cpf;
        let email = req.body.email;
        let telefone = req.body.telefone;
        let tipo = "medico";

        bcrypt.hash(req.body.senha, 10).then((senha) => {  //crtiptografando a senha
            var novoUsuario = new Usuario(nome, cpf, email, senha, telefone, tipo)
            conexao.query("INSERT INTO usuarios SET ?", novoUsuario, (error, resposta) => {
                if(error){
                    console.error(error);
                    res.render('medico_novo', {erros: erros});
                }
                console.log("Novo usuario adicionado");
                
                novoUsuario.id = `${resposta.insertId}`;
                let especialidade = req.body.especialidade;
                
                var novoMedico = new Medico(novoUsuario.id, especialidade )

                conexao.query("INSERT INTO medicos SET ?", novoMedico, (error, resposta) => {
                    if(error){
                        console.error(error);
                        res.render('medico_novo', {erros: erros});
                    } 
                    console.log("Novo medico adicionado");
                    novoMedico.id = `${resposta.insertId}`;
                    res.json({usuario:novoUsuario,medico:novoMedico})       
                })    
            })
        }).catch((error) => {
            throw error
        })

        

    }

    controllerMedicos.buscarMedico = function(req, res) {
        var medicos = [];
        
        conexao.query(" SELECT * FROM usuarios as A INNER JOIN medicos as B on A.id = B.id_usuario WHERE tipo = 'medico'", (error, rows) => {
            if(error){
                throw error;
            }
            medicos = rows;
            res.json(medicos)                
        })
        
    }
    
    controllerMedicos.buscarMedicoIdUsuario = function(req, res) {
        
        var id_medico = req.params.id;
        var medico;
        conexao.query("SELECT id_usuario FROM medicos WHERE id = ?", id_medico, (error, rows) => {
            if(error) 
                throw error;
            var id_usuario = rows[0].id_usuario;
            conexao.query(" SELECT * FROM usuarios as A INNER JOIN medicos as B on A.id = B.id_usuario WHERE A.id = ?", id_usuario, (error, rows) => {
                if(error){
                    throw error;
                }
                medico = rows[0];
                res.json(medico)                
            })   
        })
    }

    controllerMedicos.buscarMedicoNome = function(req, res) {
        var nome = req.params.nome   
        var busca = '%' + nome + '%'
        var medicos = []
        conexao.query(" SELECT * FROM usuarios as A INNER JOIN medicos as B on A.id = B.id_usuario WHERE nome LIKE ?", busca, (error, rows) => {
            if(error){
                throw error;
            }
            medicos = rows;
            res.json(medicos);                
        })
    }


    controllerMedicos.editarMedico = function(req, res) {
        var erros = [];
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome do Medico Inválido"})
        }
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: "CPF do Medico Inválido"})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "E-mail do Medico Inválido"})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: "Senha do Medico Inválida"})
        }
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: "Telefone do Medico Inválido"})
        }
        if(!req.body.especialidade || typeof req.body.especialidade == undefined || req.body.especialidade == null){
            erros.push({texto: "Especialidade do Medico Inválida"})
        }
        if(erros.length > 0){
            console.log(erros)
        }
        const id_medico = req.params.id
        conexao.query("SELECT id_usuario FROM medicos WHERE id = ?", id_medico, (error, rows) => {
            if(error) 
                throw error;
             
            var id_usuario = rows[0].id_usuario 
            var medico = {
                especialidade: req.body.especialidade,
            }   
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
                }  
            })
            conexao.query("UPDATE medicos SET especialidade = ? WHERE id = ?", [medico.especialidade, id_medico], (error, result) => {
                if(error){
                    console.log(error);
                }else{
                    res.json({usuario: usuario, medico: medico})
                }  
            })
        })
    }

    controllerMedicos.deletarMedico = function(req, res){
        const id_medico = req.params.id
        conexao.query("SELECT id_usuario FROM medicos WHERE id = ?", id_medico, (error, rows) => {
            if(error) 
                throw error;
            
            const id_usuario = rows[0].id_usuario
                
            conexao.query("DELETE FROM medicos WHERE id = ?", id_medico, (error, result) => {
                if(error){
                    console.error(error);
                    return
                }
                console.log("Linhas deletadas da tabela medico ", `${result.affectedRows}`)           
            })
    
            conexao.query("DELETE FROM usuarios WHERE id = ? and tipo = 'medico'", id_usuario, (error, result) => {
                if(error){
                    console.error(error);
                    return
                }
                console.log("Linhas deletadas da tabela usuário ", `${result.affectedRows}`)
                res.sendStatus(200);          
            })
        })
        
    }




    return controllerMedicos;

}

