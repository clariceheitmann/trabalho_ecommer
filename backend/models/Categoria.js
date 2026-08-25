const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Categoria = conn.define("categorias", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    tableName: 'categorias',
    timestamps: false
});

module.exports = Categoria;