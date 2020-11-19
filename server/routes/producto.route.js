"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const autenticacion_mw_1 = require("../middlewares/autenticacion.mw");
const producto_model_1 = __importDefault(require("../models/producto.model"));
let app = express_1.default();
//==========================================
// OBTENER TODOS LOS PRODUCTOS
//==========================================
app.get("/producto", (req, res) => {
    let pagina = req.query.pagina || 1;
    let limite = req.query.limite || 10;
    pagina = Number(pagina);
    limite = Number(limite);
    let skip = 0;
    pagina == 1 ? (skip = 0) : (skip = pagina * limite - limite);
    producto_model_1.default.find()
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .sort("nombre")
        .skip(skip)
        .limit(limite)
        .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                exito: false,
                err: {
                    message: "No hay producto registrados",
                },
            });
        }
        producto_model_1.default.countDocuments((err, total) => {
            res.json({
                exito: true,
                producto: productoDB,
                pagina,
                limite,
                total,
            });
        });
    });
});
//==========================================
// BUSCAR PRODUCTOS
//==========================================
app.get("/producto/buscar/:termino", autenticacion_mw_1.verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regexp = new RegExp(termino, "i");
    producto_model_1.default.find({ nombre: regexp })
        .populate("categoria", "nombree")
        .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                err,
            });
        }
        res.json({
            exito: true,
            producto: productoDB,
        });
    });
});
//==========================================
// OBTENER PRODUCTO POR ID
//==========================================
app.get("/producto/:id", (req, res) => {
    let id = req.params.id;
    producto_model_1.default.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                exito: false,
                err: {
                    message: "No hay producto registrado con el id: " + id,
                },
            });
        }
        res.json({
            exito: true,
            producto: productoDB,
        });
    })
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion");
    //populate : usuario categoria,
    //paginado
});
//==========================================
// Crear un nuevo producto
//==========================================
app.post("/producto", autenticacion_mw_1.verificaToken, (req, res) => {
    let body = req.body;
    let id = req.usuario._id;
    let producto = new producto_model_1.default({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: id,
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                err,
            });
        }
        res.status(201).json({
            exito: true,
            producto: productoDB,
        });
    });
    //grabar el usuario
    //grabar una categoria del listado
});
//==========================================
// Actualizar un producto
//==========================================
app.put("/producto/:id", autenticacion_mw_1.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = {
        nombre: req.body.nombre,
        categoria: req.body.categoria,
    };
    producto_model_1.default.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                exito: false,
                err: {
                    message: "No hay producto registrado con el id: " + id,
                },
            });
        }
        res.json({
            exito: true,
            producto: productoDB,
        });
    });
    //grabar el usuario
    //grabar una categoria del listado
});
//==========================================
// BORRAR UN PRODUCTO
//==========================================
app.delete("/producto/:id", autenticacion_mw_1.verificaToken, (req, res) => {
    let id = req.params.id;
    producto_model_1.default.findByIdAndUpdate(id, { disponible: false }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                exito: false,
                err: {
                    message: "No hay producto registrado con el id: " + id,
                },
            });
        }
        res.json({
            exito: true,
            message: "El producto fue eliminado con exito",
        });
    });
    //eliminacion logica
    //grabar una categoria del listado
});
module.exports = app;
