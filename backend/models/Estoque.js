const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Estoque = conn.define("estoques", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },

    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},{
    tableName: 'estoques',
    timestamps: false
});

module.exports = Estoque;