"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express_1.default();
//CONFIGURACIONES DE GOOGLE
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            nombre: payload.name,
            email: payload.email,
            img: payload.picture,
            google: true,
        };
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    });
}
app.post("/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.body.idtoken;
    let googleUser = yield verify(token).catch((err) => {
        return res.status(403).json({ ok: false, err });
    });
    usuario_model_1.default.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario ya registro sin google, usar autenticación normal",
                    },
                });
            }
            else {
                let token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, `${process.env.SEED}`, {
                    expiresIn: process.env.CADUCIDAD_TOKEN,
                });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        }
        else {
            // Si el usuario no existe / nuevo usuario
            let usuario = new usuario_model_1.default({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: "lmL (*w*) lmL",
            });
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                let token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, `${process.env.SEED}`, {
                    expiresIn: process.env.CADUCIDAD_TOKEN,
                });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }
    });
    //   res.json({ usuario : googleUser });
}));
app.post("/login", (req, res) => {
    let body = req.body;
    usuario_model_1.default.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos",
                },
            });
        }
        if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos",
                },
            });
        }
        let token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, `${process.env.SEED}`, {
            expiresIn: process.env.CADUCIDAD_TOKEN,
        });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        });
    });
});
module.exports = app;
