// Importa el pool de conexion creado en db.js
// Todas las funciones de este archivo usan este pool para hablar con Postgres
const pool = require('./db');

// ================================================
// FUNCION: agregarTema
// Inserta un nuevo tema con su enlace en la tabla tema
// Parametros: tema (string), enlace (string)
// Retorna: true si se inserto correctamente, false si fallo
async function agregarTema(tema, enlace) {

    // Ejecuta el INSERT en la tabla tema
    // $1 y $2 son parametros seguros que evitan SQL injection
    // En MySQL se usan '?' pero en PostgreSQL se usan '$1', '$2', etc.
    const result = await pool.query(
        'INSERT INTO tema (tema, enlace) VALUES ($1, $2)',
        [tema, enlace]
    );

    // rowCount es el numero de filas afectadas por el INSERT
    // Si es mayor a 0 significa que se inserto correctamente
    return result.rowCount > 0;
}

// ================================================
// FUNCION: actualizarTema
// Actualiza el tema y enlace de un registro existente
// Parametros: tema_id (number), tema (string), enlace (string)
// Retorna: true si se actualizo correctamente, false si fallo
// ================================================
async function actualizarTema(tema_id, tema, enlace) {

    // Ejecuta el UPDATE usando el id como condicion WHERE
    // $1 = tema nuevo, $2 = enlace nuevo, $3 = id del registro a actualizar
    const result = await pool.query(
        'UPDATE tema SET tema=$1, enlace=$2 WHERE id=$3',
        [tema, enlace, tema_id]
    );

    // Verifica si se actualizo al menos una fila
    return result.rowCount > 0;
}

// ================================================
// FUNCION: agregarVoto
// Inserta una nueva fila en votos para el registro indicado
// Cada fila en votos = 1 voto. Los votos se cuentan con COUNT()
// Parametros: tema_id (number)
// Retorna: true si se voto correctamente, false si fallo
// ================================================
async function agregarVoto(tema_id) {

    // Inserta una fila nueva en votos apuntando al tema_id
    const result = await pool.query(
        'INSERT INTO votos (tema_id) VALUES ($1)',
        [tema_id]
    );

    return result.rowCount > 0;
}

// FUNCION: eliminarTema
// Elimina un tema del registro indicado
// Parametros: tema_id (number)
// Retorna: true si se elimino correctamente, false si fallo
async function eliminarTema(tema_id) {
    const result = await pool.query(
        'DELETE FROM tema WHERE id=$1',
        [tema_id]
    );
    return result.rowCount > 0;
}

// ================================================
// FUNCION: agregarEnlace
// Inserta un nuevo enlace para un tema existente
// Parametros: tema_id (number), url (string)
// Retorna: true si se inserto correctamente, false si fallo
// ================================================
async function agregarEnlace(tema_id, url) {
    const result = await pool.query(
        'INSERT INTO enlace (tema_id, url) VALUES ($1, $2)',
        [tema_id, url]
    );
    return result.rowCount > 0;
}

// ================================================
// FUNCION: agregarVotoEnlace
// Inserta un voto para un enlace especifico
// Parametros: enlace_id (number)
// Retorna: true si se voto correctamente, false si fallo
// ================================================
async function agregarVotoEnlace(enlace_id) {
    const result = await pool.query(
        'INSERT INTO votos_enlace (enlace_id) VALUES ($1)',
        [enlace_id]
    );
    return result.rowCount > 0;
}

// ================================================
// FUNCION: actualizarEnlace
// Actualiza la URL de un enlace existente
// Parametros: enlace_id (number), url (string)
// Retorna: true si se actualizo correctamente, false si fallo
// ================================================
async function actualizarEnlace(enlace_id, url) {
    const result = await pool.query(
        'UPDATE enlace SET url=$1 WHERE id=$2',
        [url, enlace_id]
    );
    return result.rowCount > 0;
}

// ================================================
// FUNCION: eliminarEnlace
// Elimina un enlace especifico
// Parametros: enlace_id (number)
// Retorna: true si se elimino correctamente, false si fallo
// ================================================
async function eliminarEnlace(enlace_id) {
    const result = await pool.query(
        'DELETE FROM enlace WHERE id=$1',
        [enlace_id]
    );
    return result.rowCount > 0;
}

// ================================================
// FUNCION: obtenerDatos
// Trae todos los temas con sus enlaces y votos ordenados
// Los enlaces dentro de cada tema se ordenan por votos (mayor a menor)
// Retorna: array de temas con array de enlaces
// ================================================
async function obtenerDatos() {

    // Primero obtiene todos los temas
    const temas = await pool.query(`
        SELECT id, tema
        FROM tema
        ORDER BY id DESC
    `);

    // Para cada tema, obtiene sus enlaces con el conteo de votos
    const temasConEnlaces = await Promise.all(
        temas.rows.map(async (tema) => {
            const enlacesResult = await pool.query(`
                SELECT
                    e.id,
                    e.url,
                    COUNT(ve.id) AS votos
                FROM enlace e
                LEFT JOIN votos_enlace ve ON ve.enlace_id = e.id
                WHERE e.tema_id = $1
                GROUP BY e.id, e.url
                ORDER BY votos DESC, e.id ASC
            `, [tema.id]);

            return {
                ...tema,
                enlaces: enlacesResult.rows
            };
        })
    );

    return temasConEnlaces;
}

// Exporta todas las funciones para que el controlador pueda usarlas con require()
module.exports = {
    agregarTema,
    obtenerDatos,
    actualizarTema,
    agregarVoto,
    eliminarTema,
    agregarEnlace,
    actualizarEnlace,
    agregarVotoEnlace,
    eliminarEnlace
};