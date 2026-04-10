// Importa las funciones SQL definidas en models/queries.js
// db.agregarTema(), db.obtenerDatos(), etc.
const db = require('../models/queries');

// ================================================
// CONTROLADOR: mostrarDatos
// Maneja GET /records
// Pide todos los registros al modelo y los manda a la vista index.ejs
// solicitud respuesta
exports.mostrarDatos = async (req, res) => {

    // Llama a la funcion del modelo que hace el SELECT con JOIN
    // 'await' espera a que la consulta termine antes de continuar
    const data = await db.obtenerDatos();

    // res.render busca el archivo views/index.ejs
    // Le pasa el objeto { records: data } que EJS usa como {{ records }}
    // En Handlebars era igual: res.render('index', { records: data })
    res.render('index', { records: data });
};

// ================================================
// CONTROLADOR: agregarTema
// Maneja POST /records/add
// Recibe tema y link del body y los inserta en la BD
//solicitud respuesta
exports.agregarTema = async (req, res) => {

    // req.body contiene los datos enviados desde el formulario en form.js
    // El navegador mando: { tema: '...', link: '...' }
    const { tema, link } = req.body;

    // Llama al modelo para insertar el nuevo registro
    const ok = await db.agregarTema(tema, link);

    // Responde con JSON indicando si fue exitoso o no
    // El navegador (form.js) recibe este JSON y recarga la pagina
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: actualizarTema
// Maneja PUT /records/update
// Recibe el id del registro y los nuevos valores para actualizarlos
// ================================================
exports.actualizarTema = async (req, res) => {

    // Desestructura los tres campos que mando el navegador en el body
    const { tema_id, tema, link } = req.body;

    // Llama al modelo para ejecutar el UPDATE en la BD
    const ok = await db.actualizarTema(tema_id, tema, link);

    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: agregarVoto
// Maneja POST /records/vote
// Agrega una fila en la tabla votos para el registro indicado
// ================================================
exports.agregarVoto = async (req, res) => {

    // tema_id viene del boton que clickeo el usuario en el navegador
    const { tema_id } = req.body;

    // Llama al modelo para insertar un voto
    const ok = await db.agregarVoto(tema_id);

    res.json({ success: ok });
};

// CONTROLADOR: eliminarTema
// Maneja DELETE /records/delete
// Elimina un tema del registro indicado
exports.eliminarTema = async (req, res) => {
    const { tema_id } = req.body;
    const ok = await db.eliminarTema(tema_id);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: agregarEnlace
// Maneja POST /records/enlace/add
// Agrega un nuevo enlace a un tema existente
// ================================================
exports.agregarEnlace = async (req, res) => {
    const { tema_id, url } = req.body;
    const ok = await db.agregarEnlace(tema_id, url);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: agregarVotoEnlace
// Maneja POST /records/enlace/vote
// Agrega un voto para un enlace especifico
// ================================================
exports.agregarVotoEnlace = async (req, res) => {
    const { enlace_id } = req.body;
    const ok = await db.agregarVotoEnlace(enlace_id);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: eliminarEnlace
// Maneja DELETE /records/enlace/delete
// Elimina un enlace especifico
// ================================================
exports.eliminarEnlace = async (req, res) => {
    const { enlace_id } = req.body;
    const ok = await db.eliminarEnlace(enlace_id);
    res.json({ success: ok });
};