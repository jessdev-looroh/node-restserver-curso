import express from "express";
const app = express();

import usuarioRoute from './usuario.route'
import loginRoute  from './login.route'


app.use(usuarioRoute);
app.use(loginRoute);


export =app;