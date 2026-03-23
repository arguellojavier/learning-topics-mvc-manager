// form.js - Script del lado del NAVEGADOR
// Se encarga de capturar eventos del usuario y comunicarse
// con el servidor usando fetch() sin recargar la pagina

// SECCION 1: AGREGAR NUEVO TEMA
// Escucha el submit del formulario y manda los datos al servidor

// Selecciona el formulario por su id="user-data" definido en index.ejs
const data = document.getElementById("user-data");

// Registra una funcion que se ejecuta cuando el usuario hace click en "Anadir Tema"
data.addEventListener("submit", async (e) => {

  // Evita que el formulario recargue la pagina (comportamiento por defecto de HTML)
  e.preventDefault();

  // Lee el valor escrito en el input id="subject" del formulario
  const tema = document.getElementById("subject").value;

  // Lee el valor escrito en el input id="url" del formulario
  const link = document.getElementById("url").value;

  // fetch() hace una peticion HTTP al servidor, igual que requests.post() en Python
  // Manda los datos como JSON al endpoint POST /records/add
  await fetch("/records/add", {
    method: "POST",                                    // tipo de peticion HTTP
    headers: { "Content-Type": "application/json" },  // le dice al servidor que manda JSON
    body: JSON.stringify({ tema, link }),              // convierte el objeto a texto JSON
  });

  // Recarga la pagina para mostrar el nuevo registro en la tabla
  // El servidor vuelve a hacer SELECT y renderiza la vista actualizada
  location.reload();
});

// ------------------------------------------------
// SECCION 2: EDITAR TEMA EXISTENTE
// Selecciona todos los botones con clase .btn-edit y les pone un listener

// querySelectorAll devuelve TODOS los elementos con esa clase (como una lista)
// Hay un boton .btn-edit por cada fila de la tabla
// ------------------------------------------------
// SECCION 2: EDITAR TEMA EXISTENTE
// ------------------------------------------------

const updateData = document.querySelectorAll(".btn-edit");

updateData.forEach((button) => {
  button.addEventListener("click", async () => {

    const tema_id = button.getAttribute("data-id");

    // Sube por el DOM hasta encontrar la fila <tr> del boton clickeado
    // Así podemos leer los valores actuales de esa fila
    const fila = button.closest("tr");

    // Lee el texto actual de la celda de tema (columna 2, indice 1)
    const temaActual = fila.cells[1].textContent;

    // Lee el texto actual de la celda de enlace (columna 3, indice 2)
    const linkActual = fila.cells[2].querySelector("a").href;

    // Muestra el prompt con el valor actual precargado
    // Si el usuario no escribe nada y acepta, conserva el valor actual
    //promt para pedir los nuevos datos
    const tema = prompt("Nuevo tema:", temaActual) ;
    const link = prompt("Nuevo link:", linkActual);

    // Si el usuario cancela el prompt devuelve null, en ese caso no hace nada
    if (tema === null || link === null) {
      return;
    }

    // Si dejo vacio usa el valor actual, si escribio algo usa el nuevo
    const temaFinal = tema.trim() || temaActual;
    const linkFinal = link.trim() || linkActual;

    await fetch("/records/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema_id, tema: temaFinal, link: linkFinal }),
    });

    location.reload();
  });
});

// SECCION 3: AGREGAR VOTO (+1)
// Selecciona todos los botones con clase .btn-vote (uno por cada fila)
const voteButtons = document.querySelectorAll(".btn-vote");

voteButtons.forEach((button) => {
  button.addEventListener("click", async () => {

    // Lee el id del registro desde el atributo data-id del boton clickeado
    const tema_id = button.getAttribute("data-id");

    // Manda POST /records/vote con el id del tema
    // El servidor inserta una nueva fila en la tabla votos
    await fetch("/records/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema_id }),  // solo necesita el id
    });

    // Recarga para ver el nuevo conteo y el nuevo orden de la tabla
    location.reload();
  });
});

// SECCION 4: ELIMINAR TEMA
// Escucha el click en los botones rojos "Eliminar" de cada fila

// Selecciona todos los botones con clase .btn-delete (uno por cada fila)
const deleteButtons = document.querySelectorAll(".btn-delete");
deleteButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const tema_id = button.getAttribute("data-id");


    await fetch("/records/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema_id }),
    });

    location.reload();
  });
});