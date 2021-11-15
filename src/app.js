const express = require('express');
const hbs = require('express-handlebars');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const ContenedorAdopcion = require ('./classes/ContenedorAdopcion');
const contenedor = new ContenedorAdopcion();
const petsRouter = require('./routes/pets');
const usersRouter = require('./routes/users');
const upload = require('./services/uploader');
const server = app.listen(PORT,()=>{
    console.log("Listening on port: ",PORT)
})

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
app.use('/resources',express.static('public'));
app.use('/api/pets',petsRouter);
app.use('/api/users',usersRouter);


app.post('/api/adoption',(req,res)=>{
    let userId = parseInt(req.body.uid);
    let petId = parseInt(req.body.pid);
    contenedor.adoptPet(userId,petId).then(result=>{
        res.send(result);
    })
})
app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})
