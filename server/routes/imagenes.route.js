"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const autenticacion_mw_1 = require("../middlewares/autenticacion.mw");
let app = express_1.default();
app.get("/imagen/:tipo/:img", autenticacion_mw_1.verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs_1.default.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }
    else {
        let pathDefaultImg = path_1.default.resolve(__dirname, "../../assets/no-image.jpg");
        res.sendFile(pathDefaultImg);
    }
});
module.exports = app;
