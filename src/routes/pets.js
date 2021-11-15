const express = require('express');
const router = express.Router();
const ContenedorAdopcion = require('../classes/ContenedorAdopcion');
const upload = require('../services/uploader');
const contenedor  = new ContenedorAdopcion();
const server = require('../app');
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
    console.log(server);
    pet.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/resources'+file.filename;
    contenedor.registerPet(pet).then(result=>{
        res.send(result);
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
module.exports = router;