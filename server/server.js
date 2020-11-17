"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const app = express_1.default();
mongoose_1.default.connect(`${process.env.URLDB}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    if (err)
        throw err;
    console.log(colors_1.default.green("Base de datos ONLINE"));
});
app.use(body_parser_1.urlencoded({ extended: false }));
app.use(body_parser_1.json());
//configuracion global de rutas
app.use(index_route_1.default);
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto : ", process.env.PORT);
});
