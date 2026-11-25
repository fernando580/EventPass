const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de las 4 tablas del CRUD
app.use('/api/roles', require('./routes/rol.routes'));
app.use('/api/categorias', require('./routes/categoria.routes'));
app.use('/api/sedes', require('./routes/sede.routes'));
app.use('/api/espacios', require('./routes/espacio.routes'));

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});