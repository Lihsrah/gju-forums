require('dotenv').config()
const express = require("express")
const port = process.env.PORT || 8000
const app = express()
const cors = require('cors')
app.use(express.json())
const routes = require('./routes')
app.use(cors())
app.use(routes)



app.listen(port, '192.168.1.38' ,() => { console.log(`server is running on port ${port}-------------------------------`) })