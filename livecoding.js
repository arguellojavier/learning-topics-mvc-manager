/* Datos que te dieron:
const socios = [
  { email: 'juan@mail.com', password: '123' },
  { email: 'maria@mail.com', password: '456' }
];

// Te pidieron:
// "Crear una ruta GET que renderice index.ejs con estos datos"
app.get('/', (req, res) => {
  res.render('index.ejs', {socios : socios});
})

app.post('/recibir', (req, res) => {
    const {email, password} = req.body;
})


app.get('/usuarios', (req, res) =>{
    res.render('usuarios.ejs', {usuarios})
})

app.post('/post', (req, res) =>{
    const {nombre, edad} = req.body
    usuarios.push(nombre, edad)
})

app.get('/tareas', (req, res) =>{
    res.render('tareas.ejs', {tareas})
})


app.post('/tareas/completar/:id', (req, res) =>{
    const {id}
})
*/
