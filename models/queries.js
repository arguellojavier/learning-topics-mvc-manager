// Importa el pool de conexion creado en db.js
// Todas las funciones de este archivo usan este pool para hablar con Postgres
const pool = require('./db');

// ================================================
// FUNCION: agregarTema
// Inserta un nuevo tema con su enlace en la tabla tema
// Parametros: tema (string), enlace (string)
// Retorna: true si se inserto correctamente, false si fallo
async function insertarTema(nombreTema, enlace) {

    // Ejecuta el INSERT en la tabla tema
    // $1 y $2 son parametros seguros que evitan SQL injection
    // En MySQL se usan '?' pero en PostgreSQL se usan '$1', '$2', etc.
    const resultadoInsert = await pool.query(
        'INSERT INTO tema (tema, enlace) VALUES ($1, $2)',
        [nombreTema, enlace]
    );

    // rowCount es el numero de filas afectadas por el INSERT
    // Si es mayor a 0 significa que se inserto correctamente
    return resultadoInsert.rowCount > 0;
}

// ================================================
// FUNCION: actualizarTema
// Actualiza el tema y enlace de un registro existente
// Parametros: tema_id (number), tema (string), enlace (string)
// Retorna: true si se actualizo correctamente, false si fallo
// ================================================
async function modificarTema(idTema, nombreTema, enlace) {

    // Ejecuta el UPDATE usando el id como condicion WHERE
    // $1 = nombreTema nuevo, $2 = enlace nuevo, $3 = id del registro a actualizar
    const resultadoActual = await pool.query(
        'UPDATE tema SET tema=$1, enlace=$2 WHERE id=$3',
        [nombreTema, enlace, idTema]
    );

    // Verifica si se actualizo al menos una fila
    return resultadoActual.rowCount > 0;
}

// ================================================
// FUNCION: agregarVoto
// Inserta una nueva fila en votos para el registro indicado
// Cada fila en votos = 1 voto. Los votos se cuentan con COUNT()
// Parametros: tema_id (number)
// Retorna: true si se voto correctamente, false si fallo
// ================================================
async function insertarVotoTema(idTema) {

    // Inserta una fila nueva en votos apuntando al idTema
    const resultadoVoto = await pool.query(
        'INSERT INTO votos (tema_id) VALUES ($1)',
        [idTema]
    );

    return resultadoVoto.rowCount > 0;
}

// FUNCION: borrarTema
// Elimina un tema del registro indicado
// Parametros: idTema (number)
// Retorna: true si se elimino correctamente, false si fallo
async function borrarTema(idTema) {
    const resultadoElim = await pool.query(
        'DELETE FROM tema WHERE id=$1',
        [idTema]
    );
    return resultadoElim.rowCount > 0;
}

// ================================================
// FUNCION: agregarEnlace
// Inserta un nuevo enlace para un tema existente
// Parametros: tema_id (number), url (string)
// Retorna: true si se inserto correctamente, false si fallo
// ================================================
async function insertarEnlace(idTema, urlEnlace) {
    const resultadoInsertEnl = await pool.query(
        'INSERT INTO enlace (tema_id, url) VALUES ($1, $2)',
        [idTema, urlEnlace]
    );
    return resultadoInsertEnl.rowCount > 0;
}

// ================================================
// FUNCION: agregarVotoEnlace
// Inserta un voto para un enlace especifico
// Parametros: enlace_id (number)
// Retorna: true si se voto correctamente, false si fallo
// ================================================
async function insertarVotoEnlace(idEnlace) {
    const resultadoVotoEnl = await pool.query(
        'INSERT INTO votos_enlace (enlace_id) VALUES ($1)',
        [idEnlace]
    );
    return resultadoVotoEnl.rowCount > 0;
}

// ================================================
// FUNCION: actualizarEnlace
// Actualiza la URL de un enlace existente
// Parametros: enlace_id (number), url (string)
// Retorna: true si se actualizo correctamente, false si fallo
// ================================================
async function modificarEnlace(idEnlace, urlEnlace) {
    const resultadoModEnl = await pool.query(
        'UPDATE enlace SET url=$1 WHERE id=$2',
        [urlEnlace, idEnlace]
    );
    return resultadoModEnl.rowCount > 0;
}

// ================================================
// FUNCION: eliminarEnlace
// Elimina un enlace especifico
// Parametros: enlace_id (number)
// Retorna: true si se elimino correctamente, false si fallo
// ================================================
async function borrarEnlace(idEnlace) {
    const resultadoElimEnl = await pool.query(
        'DELETE FROM enlace WHERE id=$1',
        [idEnlace]
    );
    return resultadoElimEnl.rowCount > 0;
}

// ================================================
// FUNCION: obtenerDatos
// Trae todos los temas con sus enlaces y votos ordenados
// Los enlaces dentro de cada tema se ordenan por votos (mayor a menor)
// Retorna: array de temas con array de enlaces
// ================================================
async function obtenerTodosLosDatos() {

    // Primero obtiene todos los temas con el conteo de votos
    const temasConsulta = await pool.query(`
        SELECT
            t.id,
            t.tema,
            COUNT(v.id) AS votos
        FROM tema t
        LEFT JOIN votos v ON v.tema_id = t.id
        GROUP BY t.id, t.tema
        ORDER BY votos DESC, t.id DESC
    `);

    // Para cada tema, obtiene sus enlaces con el conteo de votos
    const temasConEnlacesYVotos = await Promise.all(
        temasConsulta.rows.map(async (temaActual) => {
            const enlacesConsulta = await pool.query(`
                SELECT
                    e.id,
                    e.url,
                    COUNT(ve.id) AS votos
                FROM enlace e
                LEFT JOIN votos_enlace ve ON ve.enlace_id = e.id
                WHERE e.tema_id = $1
                GROUP BY e.id, e.url
                ORDER BY votos DESC, e.id ASC
            `, [temaActual.id]);

            return {
                ...temaActual,
                enlaces: enlacesConsulta.rows
            };
        })
    );

    return temasConEnlacesYVotos;
}

// Exporta todas las funciones para que el controlador pueda usarlas con require()
module.exports = {
    insertarTema,
    obtenerTodosLosDatos,
    modificarTema,
    insertarVotoTema,
    borrarTema,
    insertarEnlace,
    modificarEnlace,
    insertarVotoEnlace,
    borrarEnlace
};