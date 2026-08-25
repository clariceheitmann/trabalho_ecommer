const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')
const usuarioController = require('./controller/usuario.controller')
const produtoController = require('./controller/produto.controller')
const pedidoController = require('./controller/pedido.controller')
const estoqueController = require('./controller/estoque.controller')
const entregaController = require('./controller/entrega.controller')
const categoriaController = require('./controller/categoria.controller')
const hostname = 'localhost'
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Usuários
app.post('/usuario', usuarioController.cadastrar)
app.get('/usuarios', usuarioController.listar)
app.get('/usuario/:id', usuarioController.consultarPorCod)
app.get('/usuario/buscar/:nome', usuarioController.consultarPorNome)
app.delete('/usuario/:id', usuarioController.excluir)
app.put('/usuario/:id', usuarioController.atualizar)
app.put('/usuario/:id', usuarioController.atualizarParcial)

// Produtos
app.post('/produto', produtoController.cadastrar)
app.get('/produtos', produtoController.listar)
app.get('/produto/:id', produtoController.consultarPorCod)
app.get('/produto/buscar/:nome', produtoController.consultarPorNome)
app.delete('/produto/:id', produtoController.excluir)
app.put('/produto/:id', produtoController.atualizar)
app.put('/produto/:id', produtoController.atualizarParcial)

// Pedidos
app.post('/pedido', pedidoController.cadastrar)
app.get('/pedidos', pedidoController.listar)
app.get('/pedido/:id', pedidoController.consultarPorCod)
app.delete('/pedido/:id', pedidoController.excluir)
app.put('/pedido/:id', pedidoController.atualizar)
app.put('/pedido/:id', pedidoController.atualizarParcial)

// Itens pedidos
app.post('/itemPedido', itemPedidoController.cadastrar)
app.get('/itemPedidos', itemPedidoController.listar)
app.get('/itemPedido/:id', itemPedidoController.consultarPorCod)
app.delete('/itemPedido/:id', itemPedidoController.excluir)

// Estoque
app.post('/estoque', estoqueController.cadastrar)
app.get('/estoques', estoqueController.listar)
app.get('/estoque/:id', estoqueController.consultarPorCod)
app.put('/estoque/:id', estoqueController.atualizar)

// Entregas
app.post('/entrega', entregaController.cadastrar)
app.get('/entregas', entregaController.listar)
app.get('/entrega/:id', entregaController.consultarPorCod)
app.put('/entrega/:id', entregaController.atualizar)
app.put('/entrega/:id', entregaController.atualizarParcial)

// Categorias
app.post('/categoria', categoriaController.cadastrar)
app.get('/categorias', categoriaController.listar)
app.get('/categoria/:id', categoriaController.consultarPorCod)
app.get('/categoria/buscar/:nome', categoriaController.consultarPorNome)
app.delete('/categoria/:id', categoriaController.excluir)
app.put('/categoria/:id', categoriaController.atualizar)
app.put('/categoria/:id', categoriaController.atualizarParcial)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Aplicação rodando!' })
})

conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Aplicação rodando em: http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao se conectar com o banco de dados!', err)
    })