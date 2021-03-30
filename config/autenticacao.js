const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//Model de usuário
const conexao = require("./db").con

module.exports = function(passport){
    
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        conexao.query("SELECT * FROM usuarios WHERE email = ?", email, (error, rows) => {
            if(error)
                throw error
            
            if(rows.length == 0){
                return done(null, false, {message: "Esta conta não existe"})
            }
            bcrypt.compare(senha, rows[0].senha, (erro, batem) => {
                var usuario = rows[0]
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }

            })
        })
    }))

    passport.serializeUser((usuario, done)=> {

        done(null, usuario);
    })

    passport.deserializeUser((usuario, done) => {
        done(null, usuario);
    })        
 
}