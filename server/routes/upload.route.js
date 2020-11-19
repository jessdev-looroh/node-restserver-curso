"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_fileupload_1.default({ useTempFiles: true }));
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
                message: "Las extensiones permitidas son " + extensionesValidas.join(", "),
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
        if (tipo === "productos")
            imagenMongo(id, res, nombreArchivo, tipo, producto_model_1.default, 'img', 'producto');
        else
            imagenMongo(id, res, nombreArchivo, tipo, usuario_model_1.default, 'img', 'usuario');
    });
});
function imagenMongo(id, res, nombre, tipo, model, campoImg, modeloName) {
    model.findById(id, (err, objetoDB) => {
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
        objetoDB.save((err, resultado) => {
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
function borraArchivo(archivoName, tipo) {
    let pathImagen = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${archivoName}`);
    if (fs_1.default.existsSync(pathImagen)) {
        fs_1.default.unlinkSync(pathImagen);
    }
}
module.exports = app;
