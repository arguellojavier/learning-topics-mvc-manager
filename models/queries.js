// Importa el pool de conexion creado en db.js
// Todas las funciones de este archivo usan este pool para hablar con Postgres
const pool = require('./db');

// ================================================
// FUNCION: add_subject
// Inserta un nuevo tema con su enlace en la tabla record
// Parametros: tema (string), enlace (string)
// Retorna: true si se inserto correctamente, false si fallo
// ================================================
async function add_subject(tema, enlace) {

    // Ejecuta el INSERT en la tabla record
    // $1 y $2 son parametros seguros que evitan SQL injection
    // En MySQL se usan '?' pero en PostgreSQL se usan '$1', '$2', etc.
    const result = await pool.query(
        'INSERT INTO record (tema, enlace) VALUES ($1, $2)',
        [tema, enlace]
    );

    // rowCount es el numero de filas afectadas por el INSERT
    // Si es mayor a 0 significa que se inserto correctamente
    // En MySQL era 'affectedRows', en PostgreSQL es 'rowCount'
    return result.rowCount > 0;
}

// ================================================
// FUNCION: update_subject
// Actualiza el tema y enlace de un registro existente
// Parametros: record_id (number), tema (string), enlace (string)
// Retorna: true si se actualizo correctamente, false si fallo
// ================================================
async function update_subject(record_id, tema, enlace) {

    // Ejecuta el UPDATE usando el id como condicion WHERE
    // $1 = tema nuevo, $2 = enlace nuevo, $3 = id del registro a actualizar
    const result = await pool.query(
        'UPDATE record SET tema=$1, enlace=$2 WHERE id=$3',
        [tema, enlace, record_id]
    );

    // Verifica si se actualizo al menos una fila
    return result.rowCount > 0;
}

// ================================================
// FUNCION: add_vote
// Inserta una nueva fila en votes para el registro indicado
// Cada fila en votes = 1 voto. Los votos se cuentan con COUNT()
// Parametros: record_id (number)
// Retorna: true si se voto correctamente, false si fallo
// ================================================
async function add_vote(record_id) {

    // Inserta una fila nueva en votes apuntando al record_id
    const result = await pool.query(
        'INSERT INTO votes (record_id) VALUES ($1)',
        [record_id]
    );

    return result.rowCount > 0;
}

// ================================================
// FUNCION: remove_vote
// Elimina UN voto del registro indicado
// Usa ctid que es el identificador interno de fila en PostgreSQL
// (en MySQL se usaba LIMIT 1, en PostgreSQL no existe LIMIT en DELETE)
// Parametros: record_id (number)
// Retorna: true si se elimino un voto, false si no habia votos
// ================================================
async function remove_vote(record_id) {

    // ctid es el identificador fisico interno de cada fila en PostgreSQL
    // Esta tecnica selecciona UNA sola fila para borrar, ya que
    // PostgreSQL no soporta DELETE ... LIMIT 1 como MySQL
    // La subconsulta busca el ctid de una fila con ese record_id y borra solo esa
    const result = await pool.query(
        'DELETE FROM votes WHERE ctid = (SELECT ctid FROM votes WHERE record_id=$1 LIMIT 1)',
        [record_id]
    );

    return result.rowCount > 0;
}

// ================================================
// FUNCION: display_data
// Trae todos los registros con su conteo de votos
// Ordena de mayor a menor por votos (los mas votados primero)
// Retorna: array de objetos con { id, tema, enlace, votos }
// ================================================
async function display_data() {

    // JOIN une las dos tablas: record y votes
    // LEFT JOIN significa: trae todos los records aunque no tengan votos
    // COUNT(v.id) cuenta cuantas filas de votes existen para cada record
    // GROUP BY agrupa los resultados por cada record para que COUNT funcione
    // ORDER BY votos DESC ordena de mayor a menor
    const result = await pool.query(`
        SELECT
            r.id,
            r.tema,
            r.enlace,
            COUNT(v.id) AS votos
        FROM record r
        LEFT JOIN votes v ON v.record_id = r.id
        GROUP BY r.id, r.tema, r.enlace
        ORDER BY votos DESC
    `);

    // .rows es el array de resultados en PostgreSQL
    // En MySQL era el primer elemento del array desestructurado: const [rows] = ...
    return result.rows;
}

// Exporta todas las funciones para que el controlador pueda usarlas con require()
module.exports = {
    add_subject,
    display_data,
    update_subject,
    add_vote,
    remove_vote
};