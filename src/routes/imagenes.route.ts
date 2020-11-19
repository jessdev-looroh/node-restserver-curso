import express from "express";
import fs from "fs";
import path from "path";
import {  verificaTokenImg } from '../middlewares/autenticacion.mw';


let app = express();

app.get("/imagen/:tipo/:img",verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;
  let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    let pathDefaultImg = path.resolve(__dirname, "../../assets/no-image.jpg");
    res.sendFile(pathDefaultImg);
  }
});

export = app;
