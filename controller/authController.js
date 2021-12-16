const passport = require('passport')
const usuarioimp = require('../models/proyect');
const { formRestorepassword } = require('./proyectoscontroller');
const crypto = require('crypto');
const { Op } = require("sequelize");
const { dateToString } = require('sqlstring');
const bcrypt = require('bcrypt-nodejs');
const enviarusuario = require('../handlers/email')
const enviarsms = require('../handlers/sms')
exports.autenticarusuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required'
});

const fs = require('fs')

//funcion para checkear que el usuario este logeado o no

exports.usuarioautenticado = (req, res, next) => {
    //si esta autenticado adelante
    if (req.isAuthenticated()) {


        return res.render('index', {
            pagename: "Home",
            autenticacion: true
        });


    }


    //si no esta autenticado, redirigir al formulario
    else {


        res.render('index', {
            pagename: "Home",
            autenticacion: false
        });
    }
}


exports.validarruta = (req, res, next) => {
    //si esta autenticado adelante
    if (req.isAuthenticated()) {


        return res.redirect('/');


    }


    //si no esta autenticado, redirigir al formulario
    else {
        return next();
    }
}

//funcion para cerrar sesion
exports.cerrarsesion = (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        })
    }
    //generamos token si el usuario es valido
exports.enviartoken = async(req, res) => {
    //verificamos que el usuario existe

    const { mobile } = req.body;

    const usuario = await usuarioimp.findOne({
        where: {
            email: mobile,
            activo: 1
        }
    })

    const tel = await usuarioimp.findOne({
        where: {
            mobile: mobile,
            activo: 1
        }
    })


    //si no existe el usuario
    if (!tel && !usuario) {

        res.render('restorepassword', {
            namepage: 'Reset Password',
            mensajes: 'La cuenta ingresada no existe'
        });
    } else if (tel) {
        tel.token = crypto.randomBytes(60).toString('hex');
        tel.expiracion = Date.now() + 3600000;
        await tel.save();
        const resetUrl = `http://${req.headers.host}/restorepassword/${tel.token}`;


        //falta aca el envio de sms al usuario

        res.render('resetpassword', {
            namepage: 'Reset password',
            success: 'La solicitud de restablecer contraseña fue enviado al numero ingresado'
        });

    } else if (usuario) {
        usuario.token = crypto.randomBytes(60).toString('hex');
        usuario.expiracion = Date.now() + 3600000;
        await usuario.save();
        const resetUrl = `http://${req.headers.host}/restorepassword/${usuario.token}`;
        //enviar correo con el token
        await enviarusuario.enviar({
            usuario,
            subject: 'password reset',
            resetUrl,
            archivo: 'resetpassword'

        });

        res.render('resetpassword', {
            namepage: 'Reset password',
            success: 'La solicitud de restablecer contraseña fue enviado al correo ingresado'
        });
    }

}

exports.resetpassword = async(req, res) => {
    const usuarios = await usuarioimp.findOne({ where: { token: req.params.token } })

    if (!usuarios) {
        res.render('restorepassword', {

            errtoken: 'No valido'
        })

    }

    res.render('resetpassword', {
        namepage: 'Reset password'
    })

}
exports.updatepassword = async(req, res) => {
    const usuarios = await usuarioimp.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }

        }
    })

    if (!usuarios) {
        res.render('restorepassword', {
            namepage: 'Reset Password',
            mensajes: 'Invalid'
        });
    }
    usuarios.pass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(100));
    usuarios.token = null;
    usuarios.expiracion = null;
    //guardamos el nuevo password

    await usuarios.save();

    res.render('login', {
        namepage: 'login',
        success: 'Password modificado correctamente'
    });

}