const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Render usará process.env.PORT

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (CSS, JS, imágenes) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Definición de Rutas ---

// Página de Inicio
app.get('/', (req, res) => {
  // Pasamos la variable 'page' para que el header sepa qué link marcar como 'active'
  res.render('inicio', { page: 'inicio' });
});

app.get('/inicio', (req, res) => {
  res.render('inicio', { page: 'inicio' });
});

// Página de Entrenamiento (Formulario)
app.get('/rutinas', (req, res) => {
  res.render('rutinas', { page: 'rutinas' });
});

// Página de Alimentación (Formulario)
app.get('/dietas', (req, res) => {
  res.render('dietas', { page: 'dietas' });
});

// Página de Contacto
app.get('/contacto', (req, res) => {
  res.render('contacto', { page: 'contacto' });
});

// Página de Inicio de Sesión
app.get('/inicio-sesion', (req, res) => {
  res.render('inicio sesion', { page: 'inicio-sesion' }); // 'page' no se usa aquí, pero es buena práctica
});

// Página de Registro
app.get('/registro', (req, res) => {
  res.render('registro', { page: 'registro' });
});

// --- Páginas de Resultados (las que muestran las tablas) ---

// La acción del formulario de rutinas ahora apunta a esta ruta
app.get('/tablas-rutinas', (req, res) => {
  // (Aquí podrías tomar datos del req.query si el form usara GET)
  res.render('tablas rutinas', { page: 'rutinas' });
});

// La acción del formulario de dietas ahora apunta a esta ruta
app.get('/tablas-dietas', (req, res) => {
  res.render('tablas dietas', { page: 'dietas' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});