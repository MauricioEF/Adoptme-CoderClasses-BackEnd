import multer from 'multer';
import __dirname from '../utils.js';
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname==="image"){
            cb(null,__dirname+'/public/images');
        }else if(file.fieldname==="documents"){
            cb(null,'documents');
        }
        else{
            cb(null,'uploads');
        }
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname);
    }
})
const upload = multer({storage:storage});

export default upload;