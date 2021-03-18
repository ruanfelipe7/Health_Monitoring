var Usuario = require('../models/usuario')
var Paciente = require('../models/paciente')
var RelacionamentoMedicoPaciente = require('../models/rel_medico_paciente');
const bcrypt = require('bcryptjs')
const conexao = require('../../config/db').con
const { transformAuthInfo } = require('passport')
const jwt = require('../../config/jwt')


module.exports = function(app){

    var controllerPacientes = {}

    controllerPacientes.adicionarPaciente = function(req, res) {
        const validarDados = function(){
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
                res.json({erros: erros});
                return false;
            }else{
                return true;
            }
        }
        const verificarCPF = function(){

            conexao.query(" SELECT id FROM usuarios WHERE cpf = ?", req.body.cpf, (error, rows) => {
                if(error){
                    throw error;
                }
                if(rows.length > 0){
                    res.json({erro : "CPF já cadastrado"});
                }else{
                    verificarEmail();
                }
                                
            })
        }

        const verificarEmail = function(){
            conexao.query(" SELECT id FROM usuarios WHERE email = ?", req.body.email, (error, rows) => {
            
                if(error){
                    throw error;
                }
                if(rows.length > 0){
                    res.json({erro: "Email já cadastrado"});
                }else{
                    cadastrarPaciente();
                }
                               
            })
        } 
        
        const cadastrarPaciente = function(){
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
                        res.send("Falha ao inserir o usuário no banco de dados");
                    }else{
                        console.log("Novo usuario adicionado");
                    }
                    novoUsuario.id = `${resposta.insertId}`
                    let historico_doencas = req.body.historico_doencas;

                    var novoPaciente = new Paciente(novoUsuario.id, historico_doencas);
                    
                    const token = jwt.sign({usuario: novoUsuario.id});
                            
                    conexao.query("INSERT INTO pacientes SET ?", novoPaciente, (error, resposta) => {
                        
                        if(error){
                            console.error(error);
                            res.send("Falha ao inserir o paciente no banco de dados");
                        }else{
                            console.log("Novo paciente adicionado");
                            novoPaciente.id = `${resposta.insertId}`
                
                            res.json({usuario: novoUsuario, paciente: novoPaciente, token: token})
                        }
                    })
                })
            
            }).catch((error) => { //Erro ao criptografar a senha
                throw error
            })
        }
        if(validarDados()){
            verificarCPF();
        }
        
        
        
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
            if(error){
                throw error;
            }
            
            if(rows.length > 0){
                var id_usuario = rows[0].id_usuario;
                buscarPaciente(id_usuario);  
            }else{
                res.send("Paciente não encontrado");
            }
        })

        const buscarPaciente = (id_usuario) => {
            conexao.query(" SELECT * FROM usuarios as A INNER JOIN pacientes as B on A.id = B.id_usuario WHERE A.id = ?", id_usuario, (error, rows) => {
                if(error){
                    throw error;
                }
                paciente = rows[0];
                res.json(paciente);                
            })
        }
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
        const validarCampos = function(){
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
                res.json({erros: erros});
                return false;
            }else{
                return true;
            }
        }
        //Chegando se existe algum email igual no bacno
        const validarEmail = function(id_usuario){
            conexao.query(" SELECT id FROM usuarios WHERE email = ? AND id != ?", [req.body.email, id_usuario], (error, rows) => {
                if(error){
                    throw error;
                }
                if(rows.length > 0){
                    res.json({erro : "Email já cadastrado"});
                }else{
                    validarCPF(id_usuario);
                }                
            })
        }    
        //Chegando se existe algum cpf igual no banco
        const validarCPF = function(id_usuario){
            conexao.query(" SELECT id FROM usuarios WHERE cpf = ? AND id != ?", [req.body.cpf, id_usuario], (error, rows) => {
                if(error){
                    throw error;
                }
                if(rows.length > 0){
                    res.json({erro : "CPF já cadastrado"});
                }else{
                    atualizarPaciente(id_usuario);
                }               
            })
        } 

        const atualizarPaciente = function(id_usuario){
            var usuario = {
                nome: req.body.nome,
                cpf: req.body.cpf,
                email: req.body.email,
                senha: req.body.senha,
                telefone: req.body.telefone, 
            }
            var paciente = {
                historico_doencas: req.body.historico_doencas
            }
            conexao.query("UPDATE usuarios SET nome = ?, cpf = ?, email = ?, senha = ?, telefone = ? WHERE id = ?", [usuario.nome, usuario.cpf, usuario.email, usuario.senha, usuario.telefone, id_usuario], (error, result) => {
                if(error){
                    console.log(error);
                    res.send("Erro ao atualizar o paciente")
                }else{
                    conexao.query("UPDATE pacientes SET historico_doencas = ? WHERE id = ?", [paciente.historico_doencas, id_paciente], (error, result) => {
                        if(error){
                            console.log(error);
                            res.send("Erro ao atualizar o historico do paciente")
                        }else{
                            res.json({usuario: usuario, paciente: paciente});
                        }
                    }) 
                    
                }  
            })
        }
        
        const id_paciente = req.params.id

        const buscarIdUsuario = function(){
            conexao.query("SELECT id_usuario FROM pacientes WHERE id = ?", id_paciente, (error, rows) => {
                if(error) 
                    throw error;
                if(rows.length > 0){
                    var id_usuario = rows[0].id_usuario    
                    validarEmail(id_usuario);
                }else{
                    res.send("Paciente não encontrado");
                }
                 
            })
        }

        if(validarCampos()){
            buscarIdUsuario()
        }
        
    }

    controllerPacientes.deletarPaciente = function(req, res){
        
        const id_paciente = req.params.id
        
        const deletarPaciente = function(id_paciente){
            conexao.query("DELETE FROM pacientes WHERE id = ?", id_paciente, (error, result) => {
                if(error){
                    console.error(error);
                }
                console.log("Linhas deletadas da tabela paciente ", `${result.affectedRows}`)           
            })
        }

        const deletarUsuario = function(id_usuario){
            conexao.query("DELETE FROM usuarios WHERE id = ? and tipo = 'paciente'", id_usuario, (error, result) => {
                if(error){
                    console.error(error);
                    return
                }
                console.log("Linhas deletadas da tabela usuário ", `${result.affectedRows}`)
                res.sendStatus(200)        
            })
        }
        
        const buscarIdUsuario = function(){
            conexao.query("SELECT id_usuario FROM pacientes WHERE id = ?", id_paciente, (error, rows) => {
                if(error){
                    console.log(error);
                    res.send("Erro na conexão com o banco de dados")
                } 
                    
                if(rows.length > 0){
                    const id_usuario = rows[0].id_usuario
                    deletarPaciente(id_paciente);
                    deletarUsuario(id_usuario);
                }else{
                    res.send("Paciente não encontrado no banco de dados");
                }   
            })
        }

        buscarIdUsuario();
        
    }

    controllerPacientes.adicionarMedicoParaoPaciente = function(req, res) {
        
        const buscarIdPaciente = function(id_usuario, id_medico){
            conexao.query("SELECT id FROM pacientes WHERE id_usuario = ?", id_usuario, (error, rows) => {
                if(error){
                    throw error
                }
                if(rows.length > 0){
                    let id_paciente = rows[0].id;
                    inserirRelacionamentoMedicoPaciente(id_paciente, id_medico);
                }
            })
        }
        
        const inserirRelacionamentoMedicoPaciente = function(id_paciente, id_medico){
            var novoRelacionamentoPacMed = new RelacionamentoMedicoPaciente(id_paciente, id_medico);
            conexao.query("INSERT INTO rel_medico_paciente SET ?", novoRelacionamentoPacMed, (error, resposta) => {
                if(error){
                    console.log(error);
                    res.send(error);
                }
                res.json({relcionamentoMedPac: novoRelacionamentoPacMed});
            })
        }
        let id_usuario = req.auth.id;
        let id_medico = parseInt(req.body.id_medico)    ;
        buscarIdPaciente(id_usuario, id_medico);

    }

    return controllerPacientes

}