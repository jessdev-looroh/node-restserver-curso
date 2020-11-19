import mongoose from "mongoose";
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
   descripcion : {
       type: String,
       unique: true,
       required:[true, "La categoria es obligatoria"]
   } ,
   usuario: {
       type: Schema.Types.ObjectId, ref : 'Usuario'
   }
});

export = mongoose.model('Categoria', categoriaSchema);