const { hashPassword,
    verifyHash }
    = require('../middleware/hash')
const { createToken,
    verifyToken,
    emailtoken }
    = require('../middleware/token')
// const session = ('../connections/connect.js')

require('dotenv').config()
const neo4j = require('neo4j-driver')
// 
const driver = neo4j.driver(process.env.URI, neo4j.auth.basic('neo4j', process.env.KEY), { disableLosslessIntegers: true }
)
const session = driver.session()


const createuser = async (req, res) => {
    try {
        const temptoken = await emailtoken(req.body.email)
        const createuser = await session.run('CREATE (n:tempstudent {id:apoc.create.uuid(), name:$name , email:$email , rollno:$rollno , sex:$sex , temptoken:$temptoken , password:$password , pid:apoc.create.uuid()})', {
            name: req.body.name,
            rollno: req.body.rollno,
            email: req.body.email,
            sex: req.body.sex,
            temptoken: temptoken,
            password: await hashPassword(req.body.password)
        })
        res.send({ status: true, data: { token: temptoken } })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const verifyuser = async (req, res) => {
    try {
        const verifyuser = await session.run('MATCH (n:tempstudent {temptoken:$temptoken}) SET n:Student REMOVE n:tempstudnet', {
            temptoken: req.body.token
        })
        res.send({ status: true })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const loginuser = async (req, res) => {
    try {
        const loginuser = await session.run('MATCH (n:Student {rollno:$rollno}) RETURN n{.password,.id}', {
            rollno: req.body.rollno
        })
        const checkpassword = await verifyHash(req.body.password, loginuser.records[0]._fields[0].password)
        if (checkpassword) {
            const cookie = await createToken(loginuser.records[0]._fields[0].id)
            res.send({ status: true, data: { cookie: cookie } })
        } else {
            res.send('password incorrect')
        }
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}


const createpost = async (req, res) => {
    try {
        const createpost = await session.run('MATCH (n:Student {id:$id}) CREATE (n)-[r:Asked]->(q:Question {id:apoc.create.uuid(), question:$question})', {
            id: req.authkey,
            question: req.body.question
        })
        res.send({ status: true })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const getquestion = async (req, res) => {
    try {
        const getquestion = await session.run('MATCH (n:Question) RETURN n{.id,.question}')
        var finaldata = []
        for (let i = 0; i < getquestion.records.length; i++) {
            let obj = {
                id: getquestion.records[i]._fields[0].id,
                question: getquestion.records[i]._fields[0].question
            }
            finaldata.push(obj)
        }
        res.send({ status: true, data: { data: finaldata } })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const ansquestion = async (req, res) => {
    try {
        const ansquestion = await session.run('MATCH (n:Student {id:$id}) , (q:Question {id:$qid}) CREATE (n)-[a:Answer {id:apoc.create.uuid(), answer:$answer}]->(q)', {
            id: req.authkey,
            qid: req.body.id,
            answer: req.body.answer
        })
        res.send({ status: true })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const deletequestion = async (req, res) => {
    try {
        const deletequestion = await session.run('MATCH (n:Student {id:$id})-[r:Asked]->(q:Question {id:$qid}) DETACH DELETE q', {
            id: req.authkey,
            qid: req.body.id
        })
        res.send({ status: true })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const deleteanswer = async (req, res) => {
    try {
        const deleteanswer = await session.run('MATCH (s:Student {id:$id})-[r:Answer {id:$aid}]-(q:Question) DELETE r',{
            id: req.authkey,
            aid: req.body.id
        })
        res.send({ status: true })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const getyourquestion = async (req, res) => {
    try {
        const getyourquestion = await session.run('MATCH (s:Student {id:$id})-[r:Asked]->(q:Question) RETURN q{.question,.id}', {
            id: req.authkey
        })
        var finaldata = []
        for (let i = 0; i < getyourquestion.records.length; i++) {
            let obj = {
                id: getyourquestion.records[i]._fields[0].id,
                question: getyourquestion.records[i]._fields[0].question
            }
            finaldata.push(obj)
        }
        res.send({ status: true, data: { data: finaldata } })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const getyouranswer = async (req, res) => {
    try {
        const getyouranswer = await session.run('MATCH (s:Student {id:$id})-[r:Answer]->(q:Question) RETURN r{.answer,.id}', {
            id: req.authkey
        })

        res.send({ status: true, data: {} })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const getquestionans = async (req, res) => {
    try {
        const getquestionans = await session.run('MATCH (q:Question {id:$qid})<-[r:Answer]-(s:Student) RETURN r{.answer,.id},s{.name,.rollno,.pid}', {
            qid: req.body.id
        })
        var j = 0
        var finaldata = []
        for (let i = 0; i < getquestionans.records.length; i++) {
            var obj = {
                id: getquestionans.records[i]._fields[j].id,
                answer: getquestionans.records[i]._fields[j].answer,

            }
            for (; j < getquestionans.records[i]._fields.length; j++) {
                obj.name = getquestionans.records[i]._fields[j].name
                obj.pid = getquestionans.records[i]._fields[j].pid
                obj.rollno = getquestionans.records[i]._fields[j].rollno
            }
            j = 0;
            finaldata.push(obj)
        }
        res.send({ status: true, data: { data: finaldata } })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

const logout = async (req, res) => {
    try {
        const logoutall = await session.run('MATCH (s:Student {id:$id}) REMOVE s.id SET s.id = apoc.create.uuid()', {
            id: req.authkey
        })
        res.send({ status: true })
    } catch (error) {
        console.log(error)
        res.send({ status: false })
    }
}

module.exports = {
    createuser,
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
    logout
}
