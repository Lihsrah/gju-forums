const { hashPassword,
    verifyHash }
    = require('../middleware/hash')
const {createToken,
    verifyToken,
    emailtoken}
    = require('../middleware/token')
const session = ('../connections/connect')

const createuser = async(req,res)=>{
    try {
        const createuser = await session.run('CREATE (n:tempstudent {id:apoc.create.uuid(), name:$name , email:$email , rollno:$rollno , sex:$sex , temptoken:$temptoken , pid:apoc.create.uudi()}',{
            name: req.body.name,
            rollno: req.body.rollno,
            email:req.body.email,
            sex:req.body.sex,
            temptoken : await emailtoken(req.body.email)
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyuser = async(req,res)=>{
    try {
        const verifyuser = await session.run('MATCH (n:tempstudent {temptoken:$temptoken}) SET n:Student REMOVE n:tempstudnet',{
            temptoken: req.body.token
        })
    } catch (error) {
        console.log(error)
    }
}

const createpost = async(req,res)=>{
    try {
        const createpost = await session.run('MATCH (n:Student {id:$id}) CREATE (n)-[r:Asked]->(q:Question {id:apoc.create.uuid() question:$question})',{
            id: req.authkey,
            question: req.body.question
        })
    } catch (error) {
        console.log(error)
    }
}

const getquestion = async(req,res) =>{
    try {
        const getquestion = await session.run('MATCH (n:Question) RETURN n.question')
    } catch (error) {
        console.log(error)
    }
}

const ansquestion = async(req,res)=>{
    try {
        const ansquestion = await session.run('MATCH (n:Student {id:$id}) , (q:Question {id:$qid}) CREATE (n)-[a:Answer {id:apoc.create.uuid(), answer:$answer}]-(q)',{
            id: req.authkey,
            answer: req.body.answer
        })
    } catch (error) {
        console.log(error)
    }
}

const deletequestion = async(req,res)=>{
    try {
        const deletequestion = await session.run('MATCH (n:Student {id:$id})-[r:Asked]->(q:Question {id:$qid}) DELETE DETACH q') 
    } catch (error) {
        console.log(error)
    }
}

const deleteanswer = async(req,res)=>{
    try {
        const deleteanswer = await session.run('MATCH (s:Student {id:$id})-[r:Answer {id:$aid}]-(q:Question) DELETE DETACH r')
    } catch (error) {
        console.log(error)
    }
}

const getyourquestion = async(req,res)=>{
    try {
        const getyourquestion = await session.run('MATCH (s:Student {id:$id})-[r:Asked]->(q:Question) RETURN q',{
            id: req.authkey
        })
    } catch (error) {
        console.log(error)
    }
}

const getyouranswer = async(req,res)=>{
    try {
        const getyouranswer = await session.run('MATCH (s:Student {id:$id})-[r:Answer]->(q:Question) DELETE DETACH r',{
            id: req.authkey
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    createuser,
    verifyuser,
    createpost,
    getquestion,
    ansquestion,
    deletequestion,
    deleteanswer,
    getyourquestion,
    getyouranswer
}
