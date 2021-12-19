require('dotenv').config()
const bcrypt = require("bcryptjs")

const hashPassword = async(password) => {
    try {
        const hash = await bcrypt.hash(password, 10)
        console.log(hash)
        return hash
    } catch (error) {
        console.log(error)
    }
}

const verifyHash = async (password, savedpassword) => {
    try {
        console.log('here')
        const check = await bcrypt.compare(password, savedpassword);
        return check
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    hashPassword,
    verifyHash
}