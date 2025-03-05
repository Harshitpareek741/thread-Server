import initStart from './app'
import main from './clientdb';
const Port = process.env.port;
import cors from 'cors';

async function ServerStart(){
    const app = await initStart();
    app.use(cors());
    app.listen(Port , ()=>{
        console.log(`Server Started on Port ${Port}`);
    })
}
ServerStart();
