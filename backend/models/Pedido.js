const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Pedido = conn.define("pedidos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    data_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM(
            "AGUARDANDO_PAGAMENTO",
            "PAGO",
            "EM_PREPARACAO",
            "ENVIADO",
            "ENTREGUE",
            "CANCELADO"
        ),
        allowNull: false,
        defaultValue: "AGUARDANDO_PAGAMENTO"
    }
},{
    tableName: 'pedidos',
    timestamps: false
});

module.exports = Pedido;