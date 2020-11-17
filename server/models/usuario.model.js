"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
let Schema = mongoose_1.default.Schema;
let rolesValidos = { values: ["ADMIN_ROLE", "USER_ROLE"], message: '{VALUE} no es un rol válido' };
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
    },
    email: {
        unique: true,
        type: String,
        required: [true, "El correo es necesario"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
usuarioSchema.plugin(mongoose_unique_validator_1.default, { message: "{PATH} debe de ser único." });
module.exports = mongoose_1.default.model("Usuario", usuarioSchema);
