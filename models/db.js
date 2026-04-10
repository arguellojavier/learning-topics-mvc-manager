// Carga las variables del archivo .env (DB_HOST, DB_PASSWORD, etc.)
// Debe llamarse antes de usar process.env
require('dotenv').config();

// Importa el driver de PostgreSQL
const { Pool } = require('pg');

// Crea un pool de conexiones a PostgreSQL
// Un pool maneja multiples conexiones simultaneas automaticamente
// Lee los datos de conexion desde el archivo .env
const pool = new Pool({
    host:     process.env.DB_HOST,      // servidor donde esta Postgres (ej: localhost)
    port:     process.env.DB_PORT,      // puerto de Postgres (por defecto 5432)
    user:     process.env.DB_USER,      // usuario de Postgres
    password: process.env.DB_PASSWORD,  // contrasena de Postgres
    database: process.env.DB_NAME,      // nombre de la base de datos
});

// Exporta el pool para que otros archivos puedan usarlo con require()
// Es como hacer 'export' en Python para compartir entre modulos
module.exports = pool;