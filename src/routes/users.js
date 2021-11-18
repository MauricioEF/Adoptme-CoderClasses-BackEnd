import express from 'express';
import ContenedorAdopcion from '../classes/ContenedorAdopcion.js';
const router = express.Router();
const contenedor  = new ContenedorAdopcion();



router.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Petición hecha a las: '+time.toTimeString().split(" ")[0])
    next()
})
//GETS
router.get('/',(req,res)=>{
    contenedor.getAllUsers().then(result=>{
        res.send(result);
    })
})
router.get('/:uid',(req,res)=>{
    let id= parseInt(req.params.uid);
    contenedor.getUserById(id).then(result=>{
        res.send(result);
    })
})
//POSTS
router.post('/',(req,res)=>{
    let user = req.body;
    console.log(user);
    contenedor.registerUser(user).then(result=>{
        res.send(result);
    })
})
//PUTS
router.put('/:uid',(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.uid);
    contenedor.updateUser(id,body).then(result=>{
        res.send(result);
    })
})
//DELETES
router.delete('/:uid',(req,res)=>{
    let id= parseInt(req.params.uid);
    contenedor.deleteUser(id).then(result=>{
        res.send(result);
    })
})


export default router;