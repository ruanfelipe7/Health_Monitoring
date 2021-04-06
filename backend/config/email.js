const nodemailer = require('nodemailer')

const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'hmonitoring9@gmail.com',
        pass: 'qweasdzxc123@'
      }
})

const sendEmail = function(subject, text, destiny){
    var opcoesMail = {
        from: "hmonitoring9@gmail.com",
        to: destiny,
        subject: subject,
        text: text
    }
    
    transporte.sendMail(opcoesMail, (error, info) => {
        if(error){
            console.log(error)
        } else {
            console.log("Email enviado com sucesso " + info.response)
        }
    })
}

module.exports = {
    sendEmail
}