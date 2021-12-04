import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import ContenedorAdopcion from './classes/ContenedorAdopcion.js';
import petsRouter from './routes/pets.js';
import usersRouter from './routes/users.js';
import upload from './services/uploader.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';
import { authMiddleware } from './utils.js';
const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new ContenedorAdopcion();

const server = app.listen(PORT,()=>{
    console.log("Listening on port: ",PORT)
})
export const io = new Server(server);

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

const admin = true;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})
app.use(express.static(__dirname+'/public'));
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
app.get('/view/pets',authMiddleware,(req,res)=>{
    contenedor.getAllPets().then(result=>{
        let info = result.payload;
        let preparedObject ={
            pets : info
        }
        res.render('pets',preparedObject)
    })
})

//socket
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let pets = await contenedor.getAllPets();
    socket.emit('deliverPets',pets);

})