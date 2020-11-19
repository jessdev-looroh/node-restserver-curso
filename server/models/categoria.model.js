"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La categoria es obligatoria"]
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
});
module.exports = mongoose_1.default.model('Categoria', categoriaSchema);
