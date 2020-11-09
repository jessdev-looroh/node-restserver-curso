"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/config");
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const body_parser_1 = require("body-parser");
app.use(body_parser_1.urlencoded({ extended: false }));
app.use(body_parser_1.json());
app.get("/usuario", function (req, res) {
    res.json("get Usuario");
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
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto : ", process.env.PORT);
});
