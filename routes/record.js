// Importa el Router de Express
// Router es un mini-servidor que agrupa rutas relacionadas
// Todas estas rutas estaran bajo el prefijo /records (definido en server.js)
const express = require('express');
const router = express.Router();

// Importa el controlador que contiene las funciones para cada ruta
const controller = require('../controller/recordController');

// GET /records  → muestra la pagina con todos los registros
// Llama a controller.showData que hace el SELECT y renderiza index.ejs
router.get("/", controller.showData);

// POST /records/add  → agrega un nuevo tema
// Recibe { tema, link } en el body y llama a controller.addRecord
router.post("/add", controller.addRecord);

// POST /records/vote  → agrega un voto (+1)
// Recibe { record_id } en el body y llama a controller.addVote
router.post("/vote", controller.addVote);

// DELETE /records/unVote  → quita un voto (-1)
// Recibe { record_id } en el body y llama a controller.removeVote
router.delete("/unVote", controller.removeVote);

// PUT /records/update  → actualiza un registro existente
// Recibe { record_id, tema, link } en el body y llama a controller.updateRecord
router.put("/update", controller.updateRecord);

// Exporta el router para que server.js pueda usarlo con app.use()
module.exports = router;