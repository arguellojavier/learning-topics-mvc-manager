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
// Recibe { tema, link } en el body y llama a controller.agregarTema
router.post("/add", controller.agregarTema);

// POST /records/vote  → agrega un voto (+1)
// Recibe { tema_id } en el body y llama a controller.agregarVoto
router.post("/vote", controller.agregarVoto);

// DELETE /records/delete  → elimina un tema
// Recibe { tema_id } en el body y llama a controller.eliminarTema
router.delete("/delete", controller.eliminarTema)

// PUT /records/update  → actualiza un registro existente
// Recibe { tema_id, tema, link } en el body y llama a controller.actualizarTema
router.put("/update", controller.actualizarTema);

// Exporta el router para que server.js pueda usarlo con app.use()
module.exports = router;