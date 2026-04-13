// Importa las funciones SQL definidas en models/queries.js
// db.insertarTema(), db.obtenerTodosLosDatos(), etc.
const db = require('../models/queries');

// ================================================
// CONTROLADOR: mostrarDatos
// Maneja GET /records
// Pide todos los registros al modelo y los manda a la vista index.ejs
// solicitud respuesta
exports.mostrarDatos = async (req, res) => {

    // Llama a la funcion del modelo que hace el SELECT con JOIN
    // 'await' espera a que la consulta termine antes de continuar
    const datos = await db.obtenerTodosLosDatos();

    // res.render busca el archivo views/index.ejs
    // Le pasa el objeto { records: datos } que EJS usa como {{ records }}
    // En Handlebars era igual: res.render('index', { records: datos })
    res.render('index', { records: datos });
};

// ================================================
// CONTROLADOR: insertarTema
// Maneja POST /records/add
// Recibe tema y link del body y los inserta en la BD
//solicitud respuesta
exports.insertarTema = async (req, res) => {

    // req.body contiene los datos enviados desde el formulario en form.js
    // El navegador mando: { tema: '...', link: '...' }
    const { tema, link } = req.body;

    // Llama al modelo para insertar el nuevo registro
    const ok = await db.insertarTema(tema, link);

    // Responde con JSON indicando si fue exitoso o no
    // El navegador (form.js) recibe este JSON y recarga la pagina
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: modificarTema
// Maneja PUT /records/update
// Recibe el id del registro y los nuevos valores para actualizarlos
// ================================================
exports.modificarTema = async (req, res) => {

    // Desestructura los tres campos que mando el navegador en el body
    const { tema_id, tema, link } = req.body;

    // Llama al modelo para ejecutar el UPDATE en la BD
    const ok = await db.modificarTema(tema_id, tema, link);

    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: insertarVotoTema
// Maneja POST /records/vote
// Agrega una fila en la tabla votos para el tema indicado
// ================================================
exports.insertarVotoTema = async (req, res) => {

    // tema_id viene del boton que clickeo el usuario en el navegador
    const { tema_id } = req.body;

    // Llama al modelo para insertar un voto
    const ok = await db.insertarVotoTema(tema_id);

    res.json({ success: ok });
};

// CONTROLADOR: borrarTema
// Maneja DELETE /records/delete
// Elimina un tema del registro indicado
exports.borrarTema = async (req, res) => {
    const { tema_id } = req.body;
    const ok = await db.borrarTema(tema_id);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: insertarEnlace
// Maneja POST /records/enlace/add
// Agrega un nuevo enlace a un tema existente
// ================================================
exports.insertarEnlace = async (req, res) => {
    const { tema_id, url } = req.body;
    const ok = await db.insertarEnlace(tema_id, url);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: insertarVotoEnlace
// Maneja POST /records/enlace/vote
// Agrega un voto para un enlace especifico
// ================================================
exports.insertarVotoEnlace = async (req, res) => {
    const { enlace_id } = req.body;
    const ok = await db.insertarVotoEnlace(enlace_id);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: modificarEnlace
// Maneja PUT /records/enlace/update
// Actualiza la URL de un enlace existente
// ================================================
exports.modificarEnlace = async (req, res) => {
    const { enlace_id, url } = req.body;
    const ok = await db.modificarEnlace(enlace_id, url);
    res.json({ success: ok });
};

// ================================================
// CONTROLADOR: borrarEnlace
// Maneja DELETE /records/enlace/delete
// Elimina un enlace especifico
// ================================================
exports.borrarEnlace = async (req, res) => {
    const { enlace_id } = req.body;
    const ok = await db.borrarEnlace(enlace_id);
    res.json({ success: ok });
};