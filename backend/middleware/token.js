require('dotenv').config()
const jwt = require("jsonwebtoken")

const createToken = async (id) => {
    try {
        const token = await jwt.sign({ id: id }, process.env.KEY)
        return token
    } catch (error) {
        console.log(error)
    }
}

// add CSRF to frontend for security or switch to session id

const verifyToken = async (req, res, next) => {
    try {
        console.log(req.body.token)
        const verifytoken = await jwt.verify(req.body.token, process.env.KEY)
        req.authkey = verifytoken.id
        next()
    } catch (error) {
        console.log(error)
    }
}

const emailtoken = async (email) => {
    try {
        const token = await jwt.sign({ email: email }, process.env.KEY)
        return token
    } catch (error) {
        console.log
    }
}


module.exports = {
    createToken,
    verifyToken,
    emailtoken
}