const jwt = require('jsonwebtoken')

const secret = 'jfkalffjlçaçsdfjajlç341234jhk31hj234jk14kl13414';

const sign = (payload) => jwt.sign(payload, secret, {expiresIn: 86400})
const verify = (token) => jwt.verify(token, secret);

module.exports = {
    sign,
    verify
}