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
    urlDB = process.env.MONGO_DB_URI;
}

process.env.URLDB = urlDB;