import './config/config';
import express from "express";
import {urlencoded,json} from "body-parser";
import mongoose from 'mongoose';
import colors from 'colors';
import indexRoutes from './routes/index.route';
import path from "path";
const app = express();


mongoose.connect(`${process.env.URLDB}`,{ useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true },(err)=>{ 
    if(err) throw err; 
    console.log(colors.green("Base de datos ONLINE"));
}); 
app.use(urlencoded({extended:false}));
app.use(json());

//


//habilitar la carpeta public
app.use(express.static(path.resolve( __dirname,'../public')) );



//configuracion global de rutas
app.use(indexRoutes);



app.listen(process.env.PORT,()=>{
    console.log("Escuchando puerto : ", process.env.PORT);
}); 