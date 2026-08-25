const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Produto = conn.define("produtos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nome: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    artista: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    album: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    formato: {
        type: DataTypes.ENUM("VINIL", "CD", "CASSETE"),
        allowNull: false
    },

    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    imagem: {
        type: DataTypes.STRING(500),
        allowNull: true
    },

    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: 'produtos',
    timestamps: false
});

module.exports = Produto;