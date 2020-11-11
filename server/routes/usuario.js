"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get("/usuario", function (req, res) {
    res.json("get Usuario local");
});
app.post('/usuario', function (req, res) {
    let data = req.body;
    if (data.nombre == undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    }
    else {
        res.json(data);
    }
});
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id });
});
app.delete('/usuario/:id', (req, res) => {
    // console.log(req.body);
    res.json("delete");
});
module.exports = app;
