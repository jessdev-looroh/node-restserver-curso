import  jwt from "jsonwebtoken";
//==========================================
//Verificar Token
//==========================================

import { NextFunction, Request, Response } from "express";

export let verificaToken = (req:any,res:Response,next:NextFunction)=>{
    let token:any = req.get('token');
    let SEED : any =process.env.SEED;
    jwt.verify(token,SEED,(err:any,decoded:any)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    });

};
//==========================================
//Verificar Admin Roll
//==========================================

export let verificaAdminRole = (req:any,res:Response,next:NextFunction)=>{
     
    let usuario:any = req.usuario;
    let userRol : any = usuario.role;
    console.log(usuario);
    if(userRol!='ADMIN_ROLE'){
      return  res.json({ok:false,err:{message:'Acceso denegado: se necesita el rol de administrador para poder realizar esta operación'}});
    }
    next();

};

