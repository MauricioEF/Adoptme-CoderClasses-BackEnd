import database from "../config.js";

export default class Users{
    constructor(){
        database.schema.hasTable('users').then(result=>{
            if(!result){//No existe la tabla, hay que crearla
                database.schema.createTable('users',table=>{
                    table.increments();
                    table.string('first_name').notNullable();
                    table.string('last_name').notNullable();
                    table.string('email').notNullable();
                    table.integer('age').notNullable();
                    table.boolean('hasPet').notNullable().defaultTo(false);
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log("users table created");
                })
            }
        })
    }
    getUsers = async () =>{
        try{
            let users = await database.select().table('users');
            return {status:"success",payload:users}
        }catch(error){
            return {status:"error",message:error}
        }
    }
    getUserById = async (id) =>{
        try{
            let user = await database.select().table('users').where('id',id).first();
            if(user){
                return {status:"success",payload:user}
            }else{
                return {status:"error",message:"User not found"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
    }
    registerUser = async (user) =>{
        try{
            let exists = await database.table('users').select().where('email',user.email).first();
            if(exists) return {status:"error",message:"email already exists"}
            let result = await database.table('users').insert(user)
            return {status:"success",payload:`User registered with id: ${result[0]}`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }
}