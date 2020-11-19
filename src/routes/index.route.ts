import express from "express";
const app = express();

import usuarioRoute from './usuario.route'
import loginRoute  from './login.route'
import categoriaRoute  from './categoria.route'
import productoRoute  from './producto.route'
import uploadRoute  from './upload.route'
import imagenesRoute  from './imagenes.route'



app.use(usuarioRoute);
app.use(loginRoute);
app.use(categoriaRoute);
app.use(productoRoute);
app.use(uploadRoute);
app.use(imagenesRoute);


export =app;