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

const verifyToken = async (req, res, next) => {
    try {
        const verifytoken = await jwt.verify(req.body.cookie, process.env.KEY)
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