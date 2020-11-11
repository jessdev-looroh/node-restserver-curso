"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const underscore_1 = __importDefault(require("underscore"));
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
    usuario_model_1.default.find({ estado: true }, "nombre email role estado google img")
        .skip(skip)
        .limit(limite)
        .exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        usuario_model_1.default.count({ estado: true }, (err, conteo) => {
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
    let usuario = new usuario_model_1.default({
        nombre: data.nombre,
        email: data.email,
        password: bcrypt_1.default.hashSync(data.password, 10),
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
    let body = underscore_1.default.pick(req.body, ["nombre", "email", "role", "estado"]);
    let options = {
        runValidators: true,
        new: true,
    };
    usuario_model_1.default.findByIdAndUpdate(id, body, options, (err, userDB) => {
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
    usuario_model_1.default.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuario) => {
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
module.exports = app;
