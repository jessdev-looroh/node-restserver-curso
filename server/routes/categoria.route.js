"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const autenticacion_mw_1 = require("../middlewares/autenticacion.mw");
let app = express_1.default();
const categoria_model_1 = __importDefault(require("../models/categoria.model"));
//obtener todas las categorias
app.get("/categoria", autenticacion_mw_1.verificaToken, (req, res) => {
    categoria_model_1.default.find()
        .populate("usuario", 'nombre,email')
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
    categoria_model_1.default.findById(id, (err, categoriaDB) => {
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
app.post("/categoria", autenticacion_mw_1.verificaToken, (req, res) => {
    let body = req.body;
    let id = req.usuario._id;
    let categoria = new categoria_model_1.default({
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
app.put("/categoria/:id", autenticacion_mw_1.verificaToken, (req, res) => {
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    categoria_model_1.default.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {
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
    });
});
app.delete("/categoria/:id", [autenticacion_mw_1.verificaToken, autenticacion_mw_1.verificaAdminRole], (req, res) => {
    let id = req.params.id;
    categoria_model_1.default.findByIdAndRemove(id, (err, categoriaDB) => {
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
});
module.exports = app;
