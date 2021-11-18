import multer from 'multer';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname==="image"){
            cb(null,'public/images');
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