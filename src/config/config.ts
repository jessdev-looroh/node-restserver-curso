// ==========================================
// Puerto
// ==========================================

process.env.PORT = process.env.PORT || "3005";

// ==========================================
// ENTORNO
// ==========================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ==========================================
// Base de datos
// ==========================================
let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost/cafe";
} else {
  urlDB = process.env.MONGO_DB_URI;
}

process.env.URLDB = urlDB;

// ==========================================
// Vencimiento del token
// ==========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN =`48h`;
// ==========================================
// SEED de autenticacion
// ==========================================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

// ==========================================
// GOOGLE CLIENT ID
// ==========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '350714592245-dkjmldhevouvufdi2sluelvms7uue19k.apps.googleusercontent.com';