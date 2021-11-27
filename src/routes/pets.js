import express from 'express';
import ContenedorAdopcion from '../classes/ContenedorAdopcion.js';
import upload from '../services/uploader.js';
import {io} from '../app.js';

const router = express.Router();
const contenedor  = new ContenedorAdopcion();
//GETS
router.get('/',(req,res)=>{
    contenedor.getAllPets().then(result=>{
        res.send(result);
    })
})
router.get('/:pid',(req,res)=>{
    let id = parseInt(req.params.pid);
    contenedor.getPetById(id).then(result=>{
        res.send(result);
    })
})
//POSTS
router.post('/',upload.single('image'),(req,res)=>{
    let file = req.file;
    let pet = req.body;
    pet.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename;
    contenedor.registerPet(pet).then(result=>{
        res.send(result);
        if(result.status==="success"){
            contenedor.getAllPets().then(result=>{
                console.log(result);
                io.emit('deliverPets',result);
            })
        }
    })
})
//PUTS
router.put('/:pid',(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.pid);
    contenedor.updatePet(id,body).then(result=>{
        res.send(result);
    })
})
//DELETES
router.delete('/:pid',(req,res)=>{
    let id= parseInt(req.params.pid);
    contenedor.deletePet(id).then(result=>{
        res.send(result)
    })
})
export default router;