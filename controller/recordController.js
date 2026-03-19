// Importa las funciones SQL definidas en models/queries.js
// db.add_subject(), db.display_data(), etc.
const db = require('../models/queries');

// ================================================
// CONTROLADOR: showData
// Maneja GET /records
// Pide todos los registros al modelo y los manda a la vista index.ejs
// ================================================
exports.showData = async (req, res) => {

    // Llama a la funcion del modelo que hace el SELECT con JOIN
    // 'await' espera a que la consulta termine antes de continuar
    const data = await db.display_data();

    // res.render busca el archivo views/index.ejs
    // Le pasa el objeto { records: data } que EJS usa como {{ records }}
    // En Handlebars era igual: res.render('index', { records: data })
    res.render('index', { records: data });
};

// ================================================
// CONTROLADOR: addRecord
// Maneja POST /records/add
// Recibe tema y link del body y los inserta en la BD
// ================================================
exports.addRecord = async (req, res) => {

    // req.body contiene los datos enviados desde el formulario en form.js
    // El navegador mando: { tema: '...', link: '...' }
    const { tema, link } = req.body;

    // Llama al modelo para insertar el nuevo registro
    const ok = await db.add_subject(tema, link);

    // Responde con JSON indicando si fue exitoso o no
    // El navegador (form.js) recibe este JSON y recarga la pagina
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: updateRecord
// Maneja PUT /records/update
// Recibe el id del registro y los nuevos valores para actualizarlos
// ================================================
exports.updateRecord = async (req, res) => {

    // Desestructura los tres campos que mando el navegador en el body
    const { record_id, tema, link } = req.body;

    // Llama al modelo para ejecutar el UPDATE en la BD
    const ok = await db.update_subject(record_id, tema, link);

    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: addVote
// Maneja POST /records/vote
// Agrega una fila en la tabla votes para el registro indicado
// ================================================
exports.addVote = async (req, res) => {

    // record_id viene del boton que clickeo el usuario en el navegador
    const { record_id } = req.body;

    // Llama al modelo para insertar un voto
    const ok = await db.add_vote(record_id);

    res.json({ success: ok });
};

// CONTROLADOR: removeVote
// Maneja DELETE /records/unVote
// Elimina un voto del registro indicado
exports.deleteRecord = async (req, res) => {
    const { record_id } = req.body;
    const ok = await db.delete_record(record_id);
    res.json({ success: ok });
};