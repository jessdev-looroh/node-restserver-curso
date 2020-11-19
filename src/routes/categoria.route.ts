import express, { Request, Response } from "express";
import {
  verificaToken,
  verificaAdminRole,
} from "../middlewares/autenticacion.mw";
import _ from "underscore";

let app = express();

import Categoria from "../models/categoria.model";
import bodyParser from "body-parser";
import { json } from "body-parser";

//obtener todas las categorias
app.get("/categoria", verificaToken, (req: any, res) => {
  Categoria.find()
    .populate("usuario",'nombre,email')
    .sort('descripcion')
    .exec((err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          exito: false,
          err,
        });
      }
      if (categoriaDB.length > 0)
        res.json({
          exito: true,
          categorias: categoriaDB,
          total: categoriaDB.length,
        });
      else
        res.json({
          exito: true,
          categorias: "No hay categorias registradas.",
        });
    });
});

//Mostrar una categoria por ID
app.get("/categoria/:id", (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      err.msg = "Puede que el id ingresado no sea un ID valido.";
      return res.status(500).json({
        exito: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        exito: false,
        err: {
          message: "No se encontro ninguna categoria con el id: " + id,
        },
      });
    }
    res.json({
      exito: true,
      categoria: categoriaDB,
    });
  });
  // Categoria.findById();
});

app.post("/categoria", verificaToken, (req: any, res) => {
  let body = req.body;
  let id = req.usuario._id;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        exito: false,
        err,
      });
    }
    res.json({
      exito: true,
      categoria: categoriaDB,
    });
  });
});

app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let descripcion = req.body.descripcion;

  Categoria.findByIdAndUpdate(
    id,
    { descripcion },
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          exito: false,
          err,
        });
      }
      res.json({
        exito: true,
        categoriaDB,
      });
    }
  );
});

app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdminRole],
  (req: Request, res: Response) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          exito: false,
          err,
        });
      }
      if (!categoriaDB) {
        return res.status(500).json({
          exito: false,
          err: {
            message: "El id no existe.",
          },
        });
      }
      res.json({
        exito: true,
        categoria: "Categoria borrada",
      });
    });
  }
);

export = app;
