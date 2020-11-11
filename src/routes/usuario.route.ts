import bodyParser from "body-parser";
import express from "express";
const app = express();
import Usuario from "../models/usuario.model";
import bcrypt from "bcrypt";
import _ from "underscore";
import { QueryFindOneAndUpdateOptions } from "mongoose";

// interface UsuarioModel{
//     nombre:string,
//     email :string,
//     password: string,
//     img : string,
//     roles: string,
//     estado: boolean,
//     google: boolean
// }
app.get("/usuario", function (req, res) {
  let pagina = req.query.pagina || 1;
  let limite = req.query.limite || 10;
  pagina = Number(pagina);
  limite = Number(limite);
  let skip = 0;
  pagina == 1 ? (skip = 0) : (skip = pagina * limite - limite);

  Usuario.find({estado:true}, "nombre email role estado google img")
    .skip(skip)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      Usuario.count({estado:true}, (err, conteo) => {
        res.json({
          ok: true,
          pagina,
          limite,
          totalRegistros: conteo,
          usuarios,
        });
      });
    });
});

app.post("/usuario", function (req, res) {
  let data = req.body;

  let usuario = new Usuario({
    nombre: data.nombre,
    email: data.email,
    password: bcrypt.hashSync(data.password, 10),
    role: data.role,
  });

  usuario.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: userDB,
    });
  });

  //   if (data.nombre == undefined) {
  //     res.status(400).json({
  //       ok: false,
  //       mensaje: "El nombre es necesario",
  //     });
  //   } else {
  //     res.json(data);
  //   }
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "role", "estado"]);

  let options: QueryFindOneAndUpdateOptions = {
    runValidators: true,
    new: true,
  };

  Usuario.findByIdAndUpdate(id, body, options, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({ ok: true, usuario: userDB });
  });
});

app.delete("/usuario/:id", (req, res) => {
  let id = req.params.id;
  Usuario.findByIdAndUpdate(id, { estado: false },{new:true}, (err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({ ok: true, usuario });
  });
  //   Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //     if (err) {
  //       return res.status(400).json({
  //         ok: false,
  //         err,
  //       });
  //     }
  //     if(!usuarioBorrado)
  //     {
  //         return res.status(400).json({
  //             ok: false,
  //             err:{
  //                 message: "Usuario no encontrado"
  //             },
  //           });
  //     }

  // res.json({ ok: true, usuarioBorrado });
  //   });
});

export = app;
