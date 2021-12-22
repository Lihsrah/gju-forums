const express = require("express")
const router = express.Router()
const {createToken,
    verifyToken,
    emailtoken}
    = require('./middleware/token')
const {createuser,
    verifyuser,
    loginuser,
    createpost,
    getquestion,
    ansquestion,
    deletequestion,
    deleteanswer,
    getyourquestion,
    getyouranswer,
    getquestionans,
    logout}
    = require('./students/student')







router.post('/signup', createuser)
router.post('/verify', verifyuser)
router.post('/login', loginuser)
router.post('/ask', verifyToken , createpost)
router.post('/question', verifyToken, getquestion)
router.post('/answer', verifyToken , ansquestion)
router.post('/deletequestion', verifyToken , deletequestion)
router.post('/deleteanswer', verifyToken , deleteanswer)
router.post('/yourquestions', verifyToken , getyourquestion)
router.post('/youranswers', verifyToken , getyouranswer)
router.post('/answers', verifyToken , getquestionans)
router.post('/logout', verifyToken , logout)


module.exports = router