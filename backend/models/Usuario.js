const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Usuario = conn.define("usuarios", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    sobreNome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    telefone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },

    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
    },

    cep: {
        type: DataTypes.STRING(8),
        allowNull: false
    },

    rua: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    numero: {
        type: DataTypes.STRING(10),
        allowNull: false
    },

    bairro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    cidade: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING(2),
        allowNull: false
    }
},{
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;