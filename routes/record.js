// Importa el Router de Express
// Router es un mini-servidor que agrupa rutas relacionadas
// Todas estas rutas estaran bajo el prefijo /records (definido en server.js)
const express = require('express');
const router = express.Router();

// Importa el controlador que contiene las funciones para cada ruta
const controller = require('../controller/recordController');

// GET /records  → muestra la pagina con todos los registros
// Llama a controller.mostrarDatos que hace el SELECT y renderiza index.ejs
router.get("/", controller.mostrarDatos);

// POST /records/add  → agrega un nuevo tema
// Recibe { tema, link } en el body y llama a controller.insertarTema
router.post("/add", controller.insertarTema);

// POST /records/vote  → agrega un voto (+1) al tema
// Recibe { tema_id } en el body y llama a controller.insertarVotoTema
router.post("/vote", controller.insertarVotoTema);

// DELETE /records/delete  → elimina un tema
// Recibe { tema_id } en el body y llama a controller.borrarTema
router.delete("/delete", controller.borrarTema)

// POST /records/enlace/add  → agrega un nuevo enlace a un tema
// Recibe { tema_id, url } en el body
router.post("/enlace/add", controller.insertarEnlace);

// POST /records/enlace/vote  → agrega un voto a un enlace especifico
// Recibe { enlace_id } en el body
router.post("/enlace/vote", controller.insertarVotoEnlace);

// PUT /records/enlace/update  → actualiza un enlace existente
// Recibe { enlace_id, url } en el body
router.put("/enlace/update", controller.modificarEnlace);

// DELETE /records/enlace/delete  → elimina un enlace
// Recibe { enlace_id } en el body
router.delete("/enlace/delete", controller.borrarEnlace);

// PUT /records/update  → actualiza un registro existente
// Recibe { tema_id, tema, link } en el body y llama a controller.modificarTema
router.put("/update", controller.modificarTema);

// Exporta el router para que server.js pueda usarlo con app.use()
module.exports = router;