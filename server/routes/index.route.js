"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const usuario_route_1 = __importDefault(require("./usuario.route"));
const login_route_1 = __importDefault(require("./login.route"));
const categoria_route_1 = __importDefault(require("./categoria.route"));
const producto_route_1 = __importDefault(require("./producto.route"));
app.use(usuario_route_1.default);
app.use(login_route_1.default);
app.use(categoria_route_1.default);
app.use(producto_route_1.default);
module.exports = app;
