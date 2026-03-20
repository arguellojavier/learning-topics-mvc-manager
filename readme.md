# CRUD-MVC

Aplicacion web con operaciones CRUD desarrollada en Node.js siguiendo la arquitectura MVC.

## Descripcion

Sistema de gestion de temas de aprendizaje con enlaces y sistema de votos.
Los temas se ordenan automaticamente de mayor a menor segun sus votos.
La aplicacion sigue el patron Modelo-Vista-Controlador, separando claramente
la logica de negocio, el acceso a datos y la presentacion.

## Tecnologias

- Node.js
- Express
- EJS (motor de plantillas)
- PostgreSQL
- JavaScript puro (lado del cliente)
- CSS propio

## Estructura
```
septimo/
├── server.js                   Punto de entrada, configura Express y EJS
├── routes/
│   └── record.js               Define los endpoints y los conecta al controlador
├── controller/
│   └── recordController.js     Recibe requests, llama al modelo, responde JSON
├── models/
│   ├── db.js                   Conexion al pool de PostgreSQL
│   └── queries.js              Todas las consultas SQL
├── views/
│   └── index.ejs               Vista HTML con EJS
├── js/
│   └── form.js                 Script del navegador: fetch y eventos
├── public/
│   └── css/
│       └── style.css           Estilos de la aplicacion
├── setup.sql                   Crea las tablas e inserta datos de ejemplo
├── .env                        Variables de entorno (credenciales de Postgres)
└── package.json                Dependencias del proyecto
```

## Funcionalidades

- Agregar un tema con su enlace
- Editar un tema existente
- Eliminar un tema
- Votar a favor de un tema
- Ordenamiento automatico por votos de mayor a menor

## Requisitos

- Node.js instalado
- PostgreSQL instalado y corriendo

## Instalacion y uso

**1. Clonar o descargar el proyecto**

**2. Instalar dependencias**
```
npm install
```

**3. Crear la base de datos en PostgreSQL**
```
psql -U postgres -c "CREATE DATABASE registros"
```

**4. Crear las tablas**
```
psql -U postgres -d registros -f setup.sql
```

**5. Configurar el archivo .env con tus datos**
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=registros
```

**6. Iniciar el servidor**
```
npm run dev
```

**7. Abrir en el navegador**
```
http://localhost:5000
```

## Autor

Javier Arguello