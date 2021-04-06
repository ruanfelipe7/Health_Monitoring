const jwt = require('./jwt');
const conexao = require('./db').con

const authMedico = (req, res, next) => {
    const [hashType, token] = req.headers.authorization.split(' ')
    
    try{
        var payload = jwt.verify(token);
        var id_usuario = payload.id;
        conexao.query("SELECT * FROM usuarios WHERE id = ? AND tipo = ?", [id_usuario, "medico"], (error, rows) => {
            if(error){
                res.send(error);
            }
            if(rows.length == 0){
                res.status(401).send("Usuário não autenticado a essa página");
                return
            }
            var usuario = rows[0];
            req.auth = usuario;
            next();
        })
        
    }catch(error){
        res.status(401).send(error)
    } 
}

module.exports = authMedico;