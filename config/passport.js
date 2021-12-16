const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { Op } = require("sequelize");
// referencia al modelo
const usuarios = require('../models/proyect');

//local strategu - login con credenciales propios

passport.use(
    new localStrategy({
            usernameField: 'mobile',
            passwordField: 'pass'
        },

        async(mobile, pass, done) => {
            try {
                const usuario = await usuarios.findOne({
                    where: {
                        [Op.or]: [{ email: mobile }, { mobile: mobile }],
                        activo: 1

                    }
                });



                //el usuario existe, password  incorrecto
                if (!usuario.verificarPassword(pass)) {
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                } else {
                    return done(null, usuario);

                }
            } catch (error) {

                return done(null, false, {

                    message: 'The entered account does not exist'
                });


            }







        }


    )
);



//serializar el usuario accede a sus valores internos y los coloca juntos como un objeto
passport.serializeUser((usuario, callback) => {
        callback(null, usuario);
    })
    //deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

//exportar
module.exports = passport;