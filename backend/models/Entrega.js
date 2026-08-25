const { DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Entrega = conn.define("entregas", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },

    endereco: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    codigo_rastreio: {
        type: DataTypes.STRING(50),
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM(
            "AGUARDANDO_ENVIO",
            "ENVIADO",
            "EM_TRANSITO",
            "ENTREGUE"
        ),
        allowNull: false,
        defaultValue: "AGUARDANDO_ENVIO"
    },

    data_envio: {
        type: DataTypes.DATE,
        allowNull: true
    },

    data_entrega: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName: 'entregas',
    timestamps: false
});

module.exports = Entrega;