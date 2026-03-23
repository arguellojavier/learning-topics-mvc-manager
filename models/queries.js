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
// FUNCION: obtenerDatos
// Trae todos los registros con su conteo de votos
// Ordena de mayor a menor por votos (los mas votados primero)
// Retorna: array de objetos con { id, tema, enlace, votos }
// ================================================
async function obtenerDatos() {

    // JOIN une las dos tablas: tema y votos
    // LEFT JOIN significa: trae todos los temas aunque no tengan votos
    // COUNT(v.id) cuenta cuantas filas de votos existen para cada tema
    // GROUP BY agrupa los resultados por cada tema para que COUNT funcione
    // ORDER BY votos DESC ordena de mayor a menor
    const result = await pool.query(`
        SELECT
            t.id,
            t.tema,
            t.enlace,
            COUNT(v.id) AS votos
        FROM tema t
        LEFT JOIN votos v ON v.tema_id = t.id
        GROUP BY t.id, t.tema, t.enlace
        ORDER BY votos DESC
    `);

    return result.rows;
}

// Exporta todas las funciones para que el controlador pueda usarlas con require()
module.exports = {
    agregarTema,
    obtenerDatos,
    actualizarTema,
    agregarVoto,
    eliminarTema
};