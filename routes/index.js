//importamos express
const express = require('express');
const { send } = require('express/lib/response');
const res = require('express/lib/response');
const { body, validationResult } = require('express-validator');
//instanciamos express en router
const router = express.Router();


const proyectoscontroller = require('../controller/proyectoscontroller.js');
const authController = require('../controller/authController');

const { route } = require('express/lib/application');
//creamos funcion con rutas para exportar a indexjs
module.exports = function() {
    //ruta pagina de inicio pagina de inicio
    router.get('/',
        authController.usuarioautenticado,
        proyectoscontroller.proyectoshome
    );
    router.get('/login',
        authController.validarruta,
        proyectoscontroller.login

    );

    router.get('/registro',
        authController.validarruta,
        proyectoscontroller.registro
    );

    router.get('/restorepassword',
        authController.validarruta,
        proyectoscontroller.formRestorepassword
    );

    router.get('/restorepassword/:token',
        authController.validarruta,
        authController.resetpassword
    );

    router.post('/login',
        authController.validarruta,
        authController.autenticarusuario
    );


    router.post('/registro',
        authController.validarruta,
        proyectoscontroller.registropost
    );

    router.post('/restorepassword',
        authController.validarruta,
        authController.enviartoken
    );

    router.post('/restorepassword/:token',
        authController.validarruta,
        authController.updatepassword
    );


    //cerrar sesion 
    router.get('/cerrarsesion', authController.cerrarsesion)

    router.get('/confirmarcuenta/:token',
        authController.validarruta,
        proyectoscontroller.confirmarcuenta
    )

    return router;
}