var multer = require('multer')
const { Path } = require('neo4j-driver-core')

var storage = multer.diskStorage({
    destination: '../../frontend/pp',
    filename: function(req,file,cb){
        cb(null,file.req.authkey + '- pp' + Path.extname(file.originalname))
    }
})



var upload = multer({ storage: 'profile' })