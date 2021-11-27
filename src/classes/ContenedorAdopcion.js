import fs from 'fs';
import __dirname from '../utils.js';

const petURL = __dirname+'/files/pets.txt';

class ContenedorAdopcion{
    async registerPet(pet){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            let id = pets[pets.length-1].id+1;
            pet.adopted=false;
            pet =Object.assign({id:id},pet);
            pets.push(pet)
            try{
                await fs.promises.writeFile(petURL,JSON.stringify(pets,null,2));
                return {status:"success",message:"Mascota registrada"}
            }catch{
                return {statis:"error",message:"No se pudo registrar a la mascota"} 
            }
        }catch{
            pet.adopted=false;
            pet = Object.assign({id:1},pet)
            try{
                await fs.promises.writeFile(petURL,JSON.stringify([pet],null,2));
                return {status:"success", message:"Mascota registrada"}
            }
            catch(error){
                console.log(error);
                return {status:"error",message:"No se pudo registrar a la mascota"}
            }
        }
    }
    async registerUser(user){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            let id = users[users.length-1].id+1;
            user.hasPet = false;
            user = Object.assign({id:id},user);
            users.push(user);
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify(users,null,2));
                return {status:"success",message:"Usuario registrado"}
            }catch{
                return {statis:"error",message:"No se pudo registrar al usuario"} 
            }
        }catch{
            user.hasPet = false;
            user = Object.assign({id:1},user)
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify([user],null,2));
                return {status:"success", message:"Usuario registrado"}
            }
            catch{
                return {status:"error",message:"No se pudo registrar al usuario"}
            }
        }
    }
    async getAllPets(){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            return {status:"success",payload:pets}
        }catch{
            return {status:"error",message:"Error al obtener las mascotas. Intente más tarde"}
        }
    }
    async getAllUsers(){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            return {status:"success",payload:users}
        }catch{
            return {status:"error",message:"Error al obtener los usuarios. Intente más tarde"}
        }
    }
    async getPetById(id){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            let pet = pets.find(v => v.id===id)
            if(pet){
                return {status:"success", payload:pet}
            }else{
                return {status:"error",message:"Mascota no encontrada"}
            }
        }catch{
            return {status:"error",message:"Error al obtener la mascota"}
        }
    }
    async getUserById(id){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            let user = users.find(v => v.id===id)
            if(user){
                return {status:"success", payload:user}
            }else{
                return {status:"error",message:"Usuario no encontrado"}
            }
        }catch{
            return {status:"error",message:"Error al obtener al usuario"}
        }
    }
    async adoptPet(uid,pid){
        try{
            let petData = await fs.promises.readFile(petURL,'utf-8');
            let userData = await fs.promises.readFile('./files/users.txt','utf-8');
            let pets = JSON.parse(petData);
            let users = JSON.parse(userData);
            let pet = pets.find(v=>v.id===pid);
            let user = users.find(v=>v.id===uid);
            if(!pet) return {status:"error", message:"No se encontró mascota"};
            if(!user) return {status:"error",message:"Usuario no encontrado"};
            if(pet.adopted) return {status:"error",message:"La mascota ya está adoptada"};
            if(user.hasPet) return {status:"error", message:"El usuario ya tiene mascota adoptada"};
            pet.adopted=true;
            user.hasPet=true;
            pet.owner=user.id;
            user.pet = pet.id;
            let userAux = users.map(us=>{
                if(us.id===user.id){
                    return user;
                }else{
                    return us
                }
            })
            let petAux = pets.map(pt=>{
                if(pt.id===pet.id){
                    return pet;
                }else{
                    return pt
                }
            })
            await fs.promises.writeFile(petURL,JSON.stringify(petAux,null,2));
            await fs.promises.writeFile('./files/users.txt',JSON.stringify(userAux,null,2));
            return {status:"success",message:"¡Mascota adoptada! Felicidades"}
        }catch(error){
            return {status:"error", message:"No se pudo completar el proceso de adopción: "+error}
        }
    }
    async updateUser(id,body){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            if(!users.some(user=>user.id===id)) return {status:"error", message:"No hay ningún usuario con el id especificado"}
            let result = users.map(user=>{
                if(user.id===id){
                    if(user.hasPet){
                        body = Object.assign(body,{hasPet:true,pet:user.pet})
                        body = Object.assign({id:user.id,...body})
                        return body
                    }
                    else{
                        body = Object.assign(body,{hasPet:false})
                        body = Object.assign({id:user.id,...body})
                        return body;
                    }
                }else{
                    return user;
                }
            })
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify(result,null,2));
                return {status:"success", message:"Usuario actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el usuario"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el usuario"}
        }
    }
    async updatePet(id,body){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            if(!pets.some(pt=>pt.id===id)) return {status:"error", message:"No hay mascotas con el id especificado"}
            let result = pets.map(pet=>{
                if(pet.id===id){
                    if(pet.adopted){
                        body = Object.assign(body,{adopted:true,owner:pet.owner})
                        body = Object.assign({id:pet.id,...body});
                        return body;
                    }
                    else{
                        body = Object.assign(body,{adopted:false})
                        body = Object.assign({id:id,...body})
                        return body;
                    }
                }else{
                    return pet;
                }
            })
            try{
                await fs.promises.writeFile(petURL,JSON.stringify(result,null,2));
                return {status:"success", message:"Mascota actualizada"}
            }catch{
                return {status:"error", message:"Error al actualizar la mascota"}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar la mascota: "+error}
        }
    }
    async deletePet(id){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            if(!pets.some(pet=>pet.id===id)) return {status:"error", message:"No hay mascota con el id especificado"}
            let pet = pets.find(v=>v.id===id);
            if(pet.adopted){
                try{
                    let userData = await fs.promises.readFile('./files/users.txt','utf-8');
                    let users = JSON.parse(userData);
                    users.forEach(user=>{
                        if(user.pet===id){
                            user.hasPet=false;
                            delete user['pet']
                        }
                    })
                    await fs.promises.writeFile('./files/users.txt',JSON.stringify(users,null,2));
                }catch(error){
                    return {status:"error", message:"Fallo al eliminar la mascota: "+error}
                }
            }
            let aux = pets.filter(pet=>pet.id!==id);
            try{
                await fs.promises.writeFile(petURL,JSON.stringify(aux,null,2));
                return {status:"success",message:"Mascota eliminada"}
            }catch{
                return {status:"error", message:"No se pudo eliminar la mascota"}
            }
        }catch{
            return {status:"error", message:"Fallo al eliminar la mascota"}
        }
    }
    async deleteUser(id){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            if(!users.some(us=>us.id===id)) return {status:"error", message:"No hay ningún usuario con el id proporcionado"}
            let user = users.find(us=>us.id===id);
            if(user.hasPet){
                try{
                    let petData = await fs.promises.readFile(petURL,'utf-8');
                    let pets = JSON.parse(petData);
                    pets.forEach(pet=>{
                        if(pet.owner===id){
                            pet.adopted=false;
                            delete pet['owner']
                        }
                    })
                    await fs.promises.writeFile(petURL,JSON.stringify(pets,null,2));
                }catch{
                    return {status:"error", message:"fallo al eliminar el usuario"}
                }
            }
            let aux = users.filter(user=>user.id!==id);
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify(aux,null,2));
                return {status:"success",message:"Usuario eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar la mascota"}
            }
        }
        catch{
            return {status:"error",message:"Fallo al eliminar el usuario"}
        }
    }
}

export default ContenedorAdopcion;