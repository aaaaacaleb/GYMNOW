const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // Importar cliente de Postgres
const bcrypt = require('bcrypt'); // Importar encriptador
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para leer los datos de los formularios (IMPORTANTE)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS GET (VISTAS) ---
// (Tus rutas existentes se mantienen igual)
app.get('/', (req, res) => res.render('inicio', { page: 'inicio' }));
app.get('/inicio', (req, res) => res.render('inicio', { page: 'inicio' }));
app.get('/inicio-sesion', (req, res) => res.render('inicio sesion', { page: 'inicio-sesion' }));
app.get('/registro', (req, res) => res.render('registro', { page: 'registro' }));
// ... (resto de tus rutas get) ...

// --- RUTAS POST (LÓGICA DE BD) ---

// 1. REGISTRAR USUARIO
app.post('/registro', async (req, res) => {
    // Obtenemos los datos tal cual los nombraste en registro.ejs
    const { nombre, apellidos, fecha_nacimiento, email, password } = req.body;

    try {
        // Encriptar contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar en la base de datos
        const query = `
            INSERT INTO usuarios (nombre, apellidos, fecha_nacimiento, email, password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        
        const values = [nombre, apellidos, fecha_nacimiento, email, hashedPassword];
        
        await pool.query(query, values);
        
        // Si sale bien, redirigir al login
        res.redirect('/inicio-sesion');
    } catch (error) {
        console.error(error);
        res.send("Error al registrar: " + error.message);
    }
});

// 2. INICIAR SESIÓN
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Datos de inicio sesion.ejs

    try {
        // Buscar si existe el email
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Comparar la contraseña escrita con la encriptada en la BD
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // AQUÍ ES DONDE ENTRAS: Redirige a la página principal o dashboard
                res.redirect('/inicio'); 
            } else {
                res.send('Contraseña incorrecta');
            }
        } else {
            res.send('Usuario no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.send("Error en el servidor");
    }
})

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