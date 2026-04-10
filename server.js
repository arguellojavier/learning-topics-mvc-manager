// Carga las variables del archivo .env antes de cualquier otra cosa
// libreria dotenv se encarga de acceder a env
require('dotenv').config();

// Importa Express, el framework que crea el servidor web
// Es el equivalente de Flask en Python
const express = require('express');

// Importa path para construir rutas de carpetas de forma segura
//sin errores de rutas o sistemas operativos
const path = require('path');

// Crea la aplicacion servidor
const app = express();


// Le dice a Express que use EJS para renderizar las vistas
// EJS busca archivos .ejs en la carpeta 'views' por defecto
app.set('view engine', 'ejs');

// Define la carpeta donde estan los archivos de vistas (.ejs)
// path.join asegura que la ruta funcione en cualquier sistema operativo
app.set('views', path.join(__dirname, 'views'));

// ================================================
// MIDDLEWARES
// Un middleware es una funcion que procesa el request antes de llegar a la ruta
// ================================================

// Permite que Express lea JSON en el body de las solicitudes
// Sin esto, req.body seria undefined cuando el navegador manda datos
app.use(express.json());

// Sirve archivos estaticos (JS, CSS, imagenes) desde la carpeta /js
// Cuando el navegador pide /js/form.js, Express busca en la carpeta js/
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'public')));

// ================================================
// RUTAS
// ================================================

// Importa el archivo de rutas que define los endpoints de /records
const recordRoutes = require('./routes/record');

// Registra todas las rutas del archivo record.js bajo el prefijo /records
// Ejemplo: router.get('/') se convierte en GET /records
// Ejemplo: router.post('/add') se convierte en POST /records/add
app.use('/records', recordRoutes);
//solicitud respuesta
// Ruta principal: cuando alguien entra a '/' lo redirige a /records
app.get('/', (req, res) => {
    res.redirect('/records');
});


// INICIO DEL SERVIDOR

// Lee el puerto del archivo .env, o usa 5000 si no esta definido
const PORT = process.env.PORT || 5000;

// Pone el servidor a escuchar en el puerto definido
// El callback se ejecuta una vez cuando el servidor arranca correctamente
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});