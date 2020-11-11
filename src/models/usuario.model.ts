import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// interface UsuarioModel{
//     nombre:string,
//     email :string,
//     password: string,
//     img : string,
//     roles: string,
//     estado: boolean,
//     google: boolean
// }
let Schema = mongoose.Schema;
let rolesValidos = { values: ["ADMIN_ROLE", "USER_ROLE"],message: '{VALUE} no es un rol válido' };

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
  }, // no es obligatorio
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos,
  }, //default : "USER_ROLE"
  estado: {
    type: Boolean,
    default: true,
  }, //
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único." });

export = mongoose.model("Usuario", usuarioSchema);
