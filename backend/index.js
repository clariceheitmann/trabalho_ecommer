const express = require('express')
const app = express()
const cors = require('cors')

const categoriaController = require('./controller/categoria.controller')
const entregaController = require('./controller/entrega.controller')
const estoqueController = require('./controller/estoque.controller')
const itemPedidoController = require('./controller/itemPedido.controller')
const loginController = require('./controller/login.controller')
const pedidoController = require('./controller/pedido.controller')
const produtoController = require('./controller/produto.controller')
const relatorioController = require('./controller/relatorio.controller')
const usuarioController = require('./controller/usuario.controller')
const verificarToken = require('./middleware/auth.middleware')
const verificarAdmin = require('./middleware/admin.middleware')

require('./models/rel')

const PORT = 3000
const conn = require('./db/conn')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const path = require('path')

// Disponibiliza as capas dos álbuns
app.use(
    '/imagens',
    express.static(
        path.join(__dirname, '../frontend/imagens')
    )
)


// =====================================================
// ROTAS PÚBLICAS
// =====================================================

// USUÁRIOS
app.post('/usuario', usuarioController.cadastrar)


// PRODUTOS
app.get('/produtos', produtoController.listar)
app.get('/produto/:id', produtoController.consultarPorCod)
app.get('/produto/buscar/:nome', produtoController.consultarPorNome)


// CATEGORIAS
app.get('/categorias', categoriaController.listar)
app.get('/categoria/:id', categoriaController.consultarPorCod)
app.get('/categoria/buscar/:nome', categoriaController.consultarPorNome)


// LOGIN
app.post('/login', loginController.login)
app.post('/login/admin', loginController.loginAdmin)


// =====================================================
// ROTAS PRIVADAS
// =====================================================

// USUÁRIOS
// Somente administradores podem listar e pesquisar todos os usuários
app.get('/usuarios', verificarToken, verificarAdmin, usuarioController.listar)
app.get('/usuario/buscar/:nome', verificarToken, verificarAdmin, usuarioController.consultarPorNome)
app.post('/admin/usuario', verificarToken, verificarAdmin, usuarioController.cadastrarAdmin)

// Usuários autenticados podem acessar estas rotas,
// mas o controller verificará se são donos da conta ou administradores
app.get('/usuario/:id', verificarToken, usuarioController.consultarPorCod)
app.put('/usuario/:id', verificarToken, usuarioController.atualizar)
app.patch('/usuario/:id', verificarToken, usuarioController.atualizarParcial)
app.delete('/usuario/:id', verificarToken, usuarioController.excluir)

// PRODUTOS
app.post('/produto', verificarToken, verificarAdmin, produtoController.cadastrar)
app.put('/produto/:id', verificarToken, verificarAdmin, produtoController.atualizar)
app.patch('/produto/:id', verificarToken, verificarAdmin, produtoController.atualizarParcial)
app.delete('/produto/:id', verificarToken, verificarAdmin, produtoController.excluir)


// PEDIDOS
app.post('/pedido', verificarToken, pedidoController.cadastrar)
app.post('/pedido/:id/finalizar', verificarToken, pedidoController.finalizar)
app.get('/pedidos', verificarToken, pedidoController.listar)
app.get('/pedido/:id', verificarToken, pedidoController.consultarPorCod)
app.put('/pedido/:id', verificarToken, pedidoController.atualizar)
app.patch('/pedido/:id', verificarToken, pedidoController.atualizarParcial)
app.delete('/pedido/:id', verificarToken, pedidoController.excluir)


// ITENS DO PEDIDO
app.post('/itemPedido', verificarToken, itemPedidoController.cadastrar)
app.get('/itemPedidos', verificarToken, itemPedidoController.listar)
app.get('/itemPedido/:id', verificarToken, itemPedidoController.consultarPorCod)
app.put('/itemPedido/:id', verificarToken, itemPedidoController.atualizar)
app.patch('/itemPedido/:id', verificarToken, itemPedidoController.atualizar)
app.delete('/itemPedido/:id', verificarToken, itemPedidoController.excluir)

// ESTOQUE
app.post('/estoque', verificarToken, verificarAdmin, estoqueController.cadastrar)
app.get('/estoques', verificarToken, verificarAdmin, estoqueController.listar)
app.get('/estoque/:id', verificarToken, verificarAdmin, estoqueController.consultarPorCod)
app.put('/estoque/:id', verificarToken, verificarAdmin, estoqueController.atualizar)
app.delete('/estoque/:id', verificarToken, verificarAdmin, estoqueController.excluir)

// RELATÓRIOS
app.get('/relatorios/vendas', verificarToken, verificarAdmin, relatorioController.vendas)
app.get('/relatorios/estoque', verificarToken, verificarAdmin, relatorioController.estoque)


// ENTREGAS
app.post('/entrega', verificarToken, verificarAdmin, entregaController.cadastrar)
app.get('/entregas', verificarToken, verificarAdmin, entregaController.listar)
app.get('/entrega/:id', verificarToken, verificarAdmin, entregaController.consultarPorCod)
app.put('/entrega/:id', verificarToken, verificarAdmin, entregaController.atualizar)
app.patch('/entrega/:id', verificarToken, verificarAdmin, entregaController.atualizarParcial)
app.delete('/entrega/:id', verificarToken, verificarAdmin, entregaController.excluir)

//CATEGORIAS
app.post('/categoria', verificarToken, verificarAdmin, categoriaController.cadastrar)
app.put('/categoria/:id', verificarToken, verificarAdmin, categoriaController.atualizar)
app.patch('/categoria/:id', verificarToken, verificarAdmin, categoriaController.atualizarParcial)
app.delete('/categoria/:id', verificarToken, verificarAdmin, categoriaController.excluir)


app.get(
    '/teste-protegido',
    verificarToken,
    (req, res) => {

        res.status(200).json({
            message: 'Você possui autorização!',
            usuario: req.usuario
        })

    }
)


app.get('/', (req, res) => {

    res.status(200).json({
        message: 'Aplicação rodando!'
    })

})


conn.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Aplicação rodando na porta ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(
            'Erro ao se conectar com o banco de dados!',
            err
        )
    })