"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaAdminRole = exports.verificaToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verificaToken = (req, res, next) => {
    let token = req.get('token');
    let SEED = process.env.SEED;
    jsonwebtoken_1.default.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
//==========================================
//Verificar Admin Roll
//==========================================
exports.verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    let userRol = usuario.role;
    console.log(usuario);
    if (userRol != 'ADMIN_ROLE') {
        return res.json({ ok: false, err: { message: 'Acceso denegado: se necesita el rol de administrador para poder realizar esta operación' } });
    }
    next();
};
