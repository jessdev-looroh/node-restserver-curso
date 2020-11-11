// ==========================================
// Puerto 
// ==========================================

process.env.PORT = process.env.PORT || "3005";

// ==========================================
// ENTORNO 
// ==========================================
process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

// ==========================================
// Base de datos
// ==========================================
let urlDB;

if(process.env.NODE_ENV==='dev'){
    urlDB = "mongodb://localhost/cafe";
}else{
    urlDB = "mongodb+srv://savlman:Savlman666@cluster0.fqfov.mongodb.net/cafe";
}

process.env.URLDB = urlDB;