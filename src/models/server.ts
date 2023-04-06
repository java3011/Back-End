import express from 'express';

import cors from 'cors';

import sequelize from '../db/connection';
import routesUser from '../routes/user';

import { User } from './user';

class Server{
    private app: express.Application;
    private port: string;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        })
    }

    routes(){
        this.app.use('/api/users', routesUser);
    }

    midlewares(){
        this.app.use(express.json());
    }
    
    async dbConnect(){
        try{
            await User.sync();
        } catch(error){
            console.error('Unable to connect to the database: ', error);
        }
    }
}

export default Server;