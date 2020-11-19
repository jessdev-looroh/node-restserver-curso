import express from "express";
const app = express();

import usuarioRoute from './usuario.route'
import loginRoute  from './login.route'
import categoriaRoute  from './categoria.route'
import productoRoute  from './producto.route'


app.use(usuarioRoute);
app.use(loginRoute);
app.use(categoriaRoute);
app.use(productoRoute);


export =app;