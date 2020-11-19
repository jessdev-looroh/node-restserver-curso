import express, { Response } from "express";
import fileUpload from "express-fileupload";
import Producto from "../models/producto.model";
import Usuario from "../models/usuario.model";
import fs from "fs";
import path from "path";
import { Document, Model, Mongoose } from "mongoose";
const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      exito: false,
      err: {
        message: "No se ha seleccionado ningún archivo",
      },
    });
  }

  //VALIDAR TIPO
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      exito: false,
      err: {
        message: "Los tipos permitidos son " + tiposValidos.join(", "),
      },
      ext: tipo,
    });
  }

  let archivo = req.files.archivo;
  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  let nombreArchivoCortado = archivo.name.split(".");
  let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      exito: false,
      err: {
        message:
          "Las extensiones permitidas son " + extensionesValidas.join(", "),
      },
      ext: extension,
    });
  }

  //Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getTime()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        exito: false,
        err,
      });
    //IMAGEN CARGADA
    if (tipo === "productos") imagenMongo(id, res, nombreArchivo, tipo, Producto,'img','producto');
    else imagenMongo(id, res, nombreArchivo, tipo, Usuario,'img','usuario');
    
    
  });
});

function imagenMongo(
  id: string,
  res: Response,
  nombre: string,
  tipo: string,
  model: Model<Document, {}>,
  campoImg: string,
  modeloName : string
) {
  model.findById(id, (err, objetoDB: any) => {
    if (err) {
      borraArchivo(nombre, tipo);
      return res.status(500).json({
        exito: false,
        err,
      });
    }
    if (!objetoDB) {
      borraArchivo(nombre, tipo);
      return res.status(400).json({
        exito: false,
        err: {
          message: `No existe un ${modeloName} con el id : ${id} `
        },
      });
    }
    
    borraArchivo(objetoDB[`${campoImg}`], tipo);
    objetoDB[`${campoImg}`] = nombre;
    objetoDB.save((err: any, resultado: any) => {
      if (err) {
        borraArchivo(nombre, tipo);
        return res.status(500).json({
          exito: false,
          err,
        });
      }
      
      res.json({
        exito: true,
        resultado,
      });
    });
  });
}

// function imagenProducto(
//   id: string,
//   res: Response,
//   nombre: string,
//   tipo: string
// ) {
//   Producto.findById(id, (err, productoADB: any) => {
//     if (err) {
//       borraArchivo(nombre, tipo);
//       return res.status(500).json({
//         exito: false,
//         err,
//       });
//     }
//     if (!productoADB) {
//       borraArchivo(nombre, tipo);
//       return res.status(400).json({
//         exito: false,
//         err: {
//           message: "No existe un producto con el id : " + id,
//         },
//       });
//     }
//     borraArchivo(productoADB.img, tipo);
//     productoADB.img = nombre;
//     productoADB.save((err: any, productoDB: any) => {
//       if (err) {
//         borraArchivo(nombre, tipo);
//         return res.status(500).json({
//           exito: false,
//           err,
//         });
//       }
//       res.json({
//         exito: true,
//         producto: productoDB,
//       });
//     });
//   });
// }

// function imagenUsuario(
//   id: string,
//   res: Response,
//   nombreA: string,
//   tipo: string
// ) {
//   Usuario.findById(id, (err, usuarioDB: any) => {
//     if (err) {
//       borraArchivo(nombreA, tipo);
//       return res.status(500).json({
//         exito: false,
//         err,
//       });
//     }
//     if (!usuarioDB) {
//       borraArchivo(nombreA, tipo);
//       return res.status(400).json({
//         exito: false,
//         err: {
//           message: "Usuario no existe",
//         },
//       });
//     }

//     borraArchivo(usuarioDB.img, tipo);
//     usuarioDB.img = nombreA;
//     usuarioDB.save((err: any, usuarioDB: any) => {
//       if (err) {
//         return res.status(500).json({
//           exito: false,
//           err,
//         });
//       }
//       res.json({
//         exito: true,
//         usuario: usuarioDB,
//       });
//     });
//   });
// }
function borraArchivo(archivoName: string, tipo: string) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${archivoName}`
  );
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

export = app;
