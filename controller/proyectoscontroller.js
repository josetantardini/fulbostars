//importamos el modelo 
const Proyectos = require('../models/proyect');
var messagebird = require('messagebird')('9UbJwDu68mKp5zuegKQeFRizU');
const enviaremail = require('../handlers/email')
    //mvc de inicio
const crypto = require('crypto');
exports.proyectoshome = (req, res) => {

    res.render('index', {
        pagename: 'Home',


    });
}

exports.registro = (req, res) => {
    res.render('registro', {
        pagename: 'registro'
    });
}

exports.login = (req, res) => {

    const { error } = res.locals.mensajes;
    res.render('login', {
        pagename: 'login',
        error: error
    });
}


exports.login2 = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('login2', {
        pagename: 'login2',
        error: error
    });
}







//registro de usuarios
exports.registropost = async(req, res) => {
    const { email } = req.body;
    const { name } = req.body;
    const { lastname } = req.body;
    const { cod } = req.body;
    const { mobile } = req.body;
    const { pass } = req.body;
    const { country } = req.body;
    const { city } = req.body;
    const { suscribe, terms } = req.body;
    const { rcontrasena } = req.body;
    const { acept } = req.body;
    const usertype = 0;
    console.log(req.body)
    let errores3 = [];
    var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var solonum = /^[0-9]+$/;

    if (!email) {
        errores3.push({ 'texto3': 'An email was not entered' });
    } else if (expReg.test(email) == false) {
        errores3.push({ 'texto3': 'Email entered is not valid' });

    } else if (solonum.test(mobile) == false) {
        errores3.push({ 'texto3': 'Phone number is invalid' });

    } else if (solonum.test(cod) == false) {
        errores3.push({ 'texto3': 'Area code is invalid' });

    } else if (!name) {
        errores3.push({ 'texto3': 'A name has not been entered' });
    } else if (name.length > 50) {
        errores3.push({ 'texto3': 'Name cannot have more than 50 digits' });
    } else if (lastname.length > 50) {
        errores3.push({ 'texto3': 'Last name cannot have more than 50 digits' });
    } else if (!pass) {
        errores3.push({ 'texto3': 'No password has been entered' });
    } else if (pass.length > 100) {
        errores3.push({ 'texto3': 'Password cannot have more than 100 digits' });
    } else if (!rcontrasena) {
        errores3.push({ 'texto3': 'Repeat your password' });
    } else if (!acept) {
        errores3.push({ 'texto3': 'To register, accept the conditions' });


    } else if (!city) {
        errores3.push({ 'texto3': 'Enter your city' });
    } else if (city.length > 150) {
        errores3.push({ 'texto3': 'The city must not have more than 150 digits' });
    } else if (!country) {
        errores3.push({ 'texto3': 'Your country has not been entered' });
    } else if (country.length > 150) {
        errores3.push({ 'texto3': 'The country cannot have more than 150 digits' });
    } else if (!mobile) {
        errores3.push({ 'texto3': 'Your mobile phone number has not been entered' });
    } else if (mobile.length > 20) {
        errores3.push({ 'texto3': 'The number cannot have more than 20 digits' });
    } else if (!cod) {
        errores3.push({ 'texto3': 'The area code has not been entered' });
    } else if (cod.length > 20) {
        errores3.push({ 'texto3': 'The area code cannot have more than 20 digits' });
    } else if (!lastname) {
        errores3.push({ 'texto3': 'You have not entered a last name' });
    } else if (pass != rcontrasena) {
        errores3.push({ 'texto3': 'The passwords are not identical' });
    } else if (pass.length < 8) {
        errores3.push({ 'texto3': 'The password entered must not have less than 8 digits' });
    } else if (pass.length > 50) {
        errores3.push({ 'texto3': 'The password entered must not have more than 50 digits' });
    } else if (false == strongRegex.test(pass)) {
        errores3.push({ 'texto3': 'Very weak password. It must contain at least 1 capital letter, numbers, letters and a special character.' });
    }



    const tel = '+' + cod + mobile;

    if (errores3.length > 0) {
        res.render('registro', {
            pagename: 'registro',
            errores3,
            email,
            pass,
            name,
            lastname,
            mobile,
            cod,
            city,
            country,








        });
    } else {
        try {
            const token = crypto.randomBytes(60).toString('hex');
            const registra = await Proyectos.create({ name, pass, lastname, terms, email, mobile: tel, country, city, avatar: '../controller/uploads/avatar.jpg', subscribe: suscribe, terms: acept, usertype, token });

            //crear una url de confirmar
            const confirmarUrl = `http://${req.headers.host}/confirmarcuenta/${token}`;

            //crear el objeto usuario
            const usuario = {
                email
            }


            //enviar email
            await enviaremail.enviar({
                usuario,
                subject: 'Confirma tu cuenta Fulbostars',
                confirmarUrl,
                archivo: 'confirmarcuenta'

            });

            //redirigir usuario
            res.render('login', {
                pagename: 'login',
                success: 'Enviamos un correo confirma tu cuenta'
            })
        } catch (error) {
            res.render('registro', {
                errores: error.errors,
                pagename: 'registro'

            })
        }
    }
}

exports.formRestorepassword = (req, res) => {
    res.render('restorepassword', {
        pagename: 'Reset password'
    })
}

exports.confirmarcuenta = async(req, res) => {
    const usuarios = await Proyectos.findOne({
        where: {
            token: req.params.token
        }
    })
    if (!usuarios) {
        res.render('registro', {
            pagename: 'Registro',
            error: 'No valido'
        })
    }

    usuarios.activo = 1;
    usuarios.token = null;
    await usuarios.save();


    res.render('Login', {
        pagename: 'Login',
        success: 'Cuenta activada correctamente'
    })

}