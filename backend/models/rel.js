const Usuario = require("./Usuario");
const Produto = require("./Produto");
const Categoria = require("./Categoria");
const Estoque = require("./Estoque");
const Pedido = require("./Pedido");
const ItemPedido = require("./ItemPedido");
const Entrega = require("./Entrega");

// Usuario → Pedido
Usuario.hasMany(Pedido, {
    foreignKey: "usuario_id",
    as: "pedidos"
});

Pedido.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    as: "usuario"
});


// Categoria → Produto
Categoria.hasMany(Produto, {
    foreignKey: "categoria_id",
    as: "produtos"
});

Produto.belongsTo(Categoria, {
    foreignKey: "categoria_id",
    as: "categoria"
});


// Produto → Estoque
Produto.hasOne(Estoque, {
    foreignKey: "produto_id",
    as: "estoque"
});

Estoque.belongsTo(Produto, {
    foreignKey: "produto_id",
    as: "produto"
});


// Pedido → ItemPedido
Pedido.hasMany(ItemPedido, {
    foreignKey: "pedido_id",
    as: "itens"
});

ItemPedido.belongsTo(Pedido, {
    foreignKey: "pedido_id",
    as: "pedido"
});


// Produto → ItemPedido
Produto.hasMany(ItemPedido, {
    foreignKey: "produto_id",
    as: "itens_pedido"
});

ItemPedido.belongsTo(Produto, {
    foreignKey: "produto_id",
    as: "produto"
});


// Pedido → Entrega
Pedido.hasOne(Entrega, {
    foreignKey: "pedido_id",
    as: "entrega"
});

Entrega.belongsTo(Pedido, {
    foreignKey: "pedido_id",
    as: "pedido"
});

module.exports = {
    Usuario,
    Produto,
    Categoria,
    Estoque,
    Pedido,
    ItemPedido,
    Entrega
};