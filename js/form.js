// form.js - Script del lado del NAVEGADOR
// Se encarga de capturar eventos del usuario y comunicarse
// con el servidor usando fetch() sin recargar la pagina

// ================================================
// SECCION 1: AGREGAR NUEVO TEMA
// ================================================

const formularioTema = document.getElementById("formulario-tema");

formularioTema.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tema = document.getElementById("entrada-tema").value;
  const enlace = document.getElementById("entrada-enlace").value;

  await fetch("/records/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tema, link: enlace }),
  });

  location.reload();
});

// ================================================
// SECCION 2: EDITAR TEMA EXISTENTE
// ================================================

const botonesEditarTema = document.querySelectorAll(".btn-editar-tema");

botonesEditarTema.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const temaId = boton.getAttribute("data-id");
    const contenedorTema = boton.closest(".tema-contenedor");
    const temaActual = contenedorTema.querySelector(".titulo-tema").textContent.trim();

    const nuevoTema = prompt("Editar tema:", temaActual);

    if (nuevoTema === null || !nuevoTema.trim()) {
      return;
    }

    await fetch("/records/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema_id: temaId, tema: nuevoTema.trim(), link: "" }),
    });

    location.reload();
  });
});

// ================================================
// SECCION 3: ELIMINAR TEMA
// ================================================

const botonesEliminarTema = document.querySelectorAll(".btn-eliminar-tema");

botonesEliminarTema.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const temaId = boton.getAttribute("data-id");

    if (confirm("¿Eliminar este tema y todos sus enlaces?")) {
      await fetch("/records/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema_id: temaId }),
      });

      location.reload();
    }
  });
});

// ================================================
// SECCION 4: AGREGAR NUEVO ENLACE A UN TEMA
// ================================================

const botonesAgregarEnlace = document.querySelectorAll(".btn-agregar-enlace");

botonesAgregarEnlace.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const temaId = boton.getAttribute("data-tema-id");
    const inputEnlace = boton.previousElementSibling;
    const url = inputEnlace.value.trim();

    if (!url) {
      alert("Por favor ingresa una URL valida");
      return;
    }

    const resultado = await fetch("/records/enlace/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema_id: temaId, url }),
    });

    const datos = await resultado.json();
    if (datos.success) {
      inputEnlace.value = "";
      location.reload();
    }
  });
});

// ================================================
// SECCION 5: VOTAR POR UN ENLACE
// ================================================

const botonesVotarEnlace = document.querySelectorAll(".btn-votar-enlace");

botonesVotarEnlace.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const enlaceId = boton.getAttribute("data-enlace-id");

    await fetch("/records/enlace/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enlace_id: enlaceId }),
    });

    location.reload();
  });
});

// ================================================
// SECCION 6: EDITAR UN ENLACE
// ================================================

const botonesEditarEnlace = document.querySelectorAll(".btn-editar-enlace");

botonesEditarEnlace.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const enlaceId = boton.getAttribute("data-enlace-id");
    const elementoEnlace = boton.closest(".enlace-item");
    const urlActual = elementoEnlace.querySelector(".enlace-url").href;

    const nuevoUrl = prompt("Editar URL del enlace:", urlActual);

    if (nuevoUrl === null || !nuevoUrl.trim()) {
      return;
    }

    await fetch("/records/enlace/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enlace_id: enlaceId, url: nuevoUrl.trim() }),
    });

    location.reload();
  });
});

// ================================================
// SECCION 7: ELIMINAR UN ENLACE
// ================================================

const botonesEliminarEnlace = document.querySelectorAll(".btn-eliminar-enlace");

botonesEliminarEnlace.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const enlaceId = boton.getAttribute("data-enlace-id");

    if (confirm("¿Eliminar este enlace?")) {
      await fetch("/records/enlace/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enlace_id: enlaceId }),
      });

      location.reload();
    }
  });
});