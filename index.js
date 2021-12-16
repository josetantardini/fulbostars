const express = require("express");
const res = require('express/lib/response');
const path = require('path');

const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('./config/passport');

const helpers = require('./helpers');
//conexion a base de datos
const db = require('./config/db');

//importamos el modelo
require('./models/proyect');
db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error));


//importamos el index.js de routes
const routes = require('./routes');




//almacenamos todas las funcionalidades de express
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));


//donde cargar los archivos staticos (css js y todo eso)
app.use(express.static('public'));

// habilitar pug

app.set('view engine', 'pug');






// leer carpetas de las vistas

app.set('views', path.join(__dirname, './views'))


//agregar flash menssages
app.use(flash());


app.use(cookieParser());

//cargamos session nos permite mantener la sesion si necesidad de volvernos autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//llamamos a passport 

app.use(passport.initialize());
app.use(passport.session());


//pasar var dump a la aplicacion
app.use((req, res, next) => {

    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.sesion = helpers.vardump;
    //traemos toda la informacion de la tabla users del usuario que se logeo
    res.locals.usuario = {...req.user } || null;

    next();
});


//invocamos la funcion de routes de index.js de la carpeta routes
app.use('/', routes());




//indicamos en que puerto va a correr
app.listen(3000);