"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = express_1.default();
app.post('/login', (req, res) => {
    let body = req.body;
    usuario_model_1.default.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, `${process.env.SEED}`, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});
module.exports = app;
