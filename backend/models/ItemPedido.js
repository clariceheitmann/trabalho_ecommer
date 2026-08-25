const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const ItemPedido = conn.define("itens_pedido", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    preco_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
},{
    tableName: 'itensPedidos',
    timestamps: false
});

module.exports = ItemPedido;