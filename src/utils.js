import {fileURLToPath} from 'url';
import {dirname} from 'path';

const filename= fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export const authMiddleware = (req,res,next)=>{
    if(!req.auth) res.status(403).send({error:-2,message:"NO AUTORIZADO"})
    else next();
}
export default __dirname;