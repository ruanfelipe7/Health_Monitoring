const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: 'root', // A senha do usuário. Ex: user123
    database: 'healthmonitoring' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

const connect = (con) => {
    con.connect((error) => {
        if (error) {
            console.log('Erro na conexão com o banco de dados ..', error)
            return
        }
        console.log('Conectado ao banco de dados com sucesso')
    });
}
const close = (con) => {
    con.end((error) => {
        if(error) {
            console.log("Erro ao finalizar a conexão ...", error)
            return 
        }
        console.log('Conexão encerrada')
    })
}


module.exports = {
    connect,
    close,
    con
}
