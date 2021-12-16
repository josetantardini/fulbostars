const Sequelize = require('sequelize');
const db = require('../config/db.js');
const bcrypt = require('bcrypt-nodejs');
const { sequelize } = require('sequelize/lib/model');

const fulbo = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    mobile: {
        type: Sequelize.STRING(255),
        allowNull: false,

        unique: {
            args: true,
            msg: 'Mobile already exists'
        }

    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,

        unique: {
            args: true,
            msg: 'Email already exists'
        }

    },
    subscribe: {
        type: Sequelize.STRING

    },
    avatar: {
        type: Sequelize.STRING

    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    terms: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    usertype: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },

    token: {
        type: Sequelize.STRING
    },
    expiracion: {
        type: Sequelize.DATE
    },



}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.pass = bcrypt.hashSync(usuario.pass, bcrypt.genSaltSync(100));
        }
    },

});
//metodo personalizados
fulbo.prototype.verificarPassword = function(pass) {
    return bcrypt.compareSync(pass, this.pass);
}
fulbo.prototype.verificaremail = function(email) {
    return email == this.email;
}

module.exports = fulbo;