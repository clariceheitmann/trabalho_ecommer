const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')

const usuarioController = require('./controller/usuario.controller')
const produtoController = require('./controller/produto.controller')
const pedidoController = require('./controller/pedido.controller')
const itemPedidoController = require('./controller/itemPedido.controller')
const estoqueController = require('./controller/estoque.controller')
const entregaController = require('./controller/entrega.controller')
const categoriaController = require('./controller/categoria.controller')

const loginController = require('./controller/login.controller')
const verificarToken = require('./middleware/auth.middleware')

const hostname = 'localhost'
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


// =====================================================
// ROTAS PÚBLICAS
// =====================================================

// -------------------------
// USUÁRIOS
// -------------------------

// Cadastro de usuário
app.post('/usuario', usuarioController.cadastrar)


// -------------------------
// PRODUTOS
// -------------------------

// Listar produtos
app.get('/produtos', produtoController.listar)

// Consultar produto por ID
app.get('/produto/:id', produtoController.consultarPorCod)

// Consultar produto por nome
app.get('/produto/buscar/:nome', produtoController.consultarPorNome)


// -------------------------
// CATEGORIAS
// -------------------------

// Listar categorias
app.get('/categorias', categoriaController.listar)

// Consultar categoria por ID
app.get('/categoria/:id', categoriaController.consultarPorCod)

// Consultar categoria por nome
app.get('/categoria/buscar/:nome', categoriaController.consultarPorNome)


// -------------------------
// LOGIN
// -------------------------

app.post('/login', loginController.login)


// =====================================================
// ROTAS PRIVADAS
// =====================================================


// -------------------------
// USUÁRIOS
// -------------------------

// Consultar usuário por ID
app.get(
    '/usuario/:id',
    verificarToken,
    usuarioController.consultarPorCod
)

// Consultar usuário por nome
app.get(
    '/usuario/buscar/:nome',
    verificarToken,
    usuarioController.consultarPorNome
)

// Atualizar usuário completamente
app.put(
    '/usuario/:id',
    verificarToken,
    usuarioController.atualizar
)

// Atualizar usuário parcialmente
app.patch(
    '/usuario/:id',
    verificarToken,
    usuarioController.atualizarParcial
)

// Excluir usuário
app.delete(
    '/usuario/:id',
    verificarToken,
    usuarioController.excluir
)


// -------------------------
// PRODUTOS
// -------------------------

// Cadastrar produto
app.post(
    '/produto',
    verificarToken,
    produtoController.cadastrar
)

// Atualizar produto completamente
app.put(
    '/produto/:id',
    verificarToken,
    produtoController.atualizar
)

// Atualizar produto parcialmente
app.patch(
    '/produto/:id',
    verificarToken,
    produtoController.atualizarParcial
)

// Excluir produto
app.delete(
    '/produto/:id',
    verificarToken,
    produtoController.excluir
)


// -------------------------
// PEDIDOS
// -------------------------

// Cadastrar pedido
app.post(
    '/pedido',
    verificarToken,
    pedidoController.cadastrar
)

// Listar pedidos
app.get(
    '/pedidos',
    verificarToken,
    pedidoController.listar
)

// Consultar pedido por ID
app.get(
    '/pedido/:id',
    verificarToken,
    pedidoController.consultarPorCod
)

// Atualizar pedido completamente
app.put(
    '/pedido/:id',
    verificarToken,
    pedidoController.atualizar
)

// Atualizar pedido parcialmente
app.patch(
    '/pedido/:id',
    verificarToken,
    pedidoController.atualizarParcial
)

// Excluir pedido
app.delete(
    '/pedido/:id',
    verificarToken,
    pedidoController.excluir
)


// -------------------------
// ITENS DO PEDIDO
// -------------------------

app.post(
    '/itemPedido',
    verificarToken,
    itemPedidoController.cadastrar
)

app.get(
    '/itemPedidos',
    verificarToken,
    itemPedidoController.listar
)

app.get(
    '/itemPedido/:id',
    verificarToken,
    itemPedidoController.consultarPorCod
)

app.delete(
    '/itemPedido/:id',
    verificarToken,
    itemPedidoController.excluir
)


// -------------------------
// ESTOQUE
// -------------------------

app.post(
    '/estoque',
    verificarToken,
    estoqueController.cadastrar
)

app.get(
    '/estoques',
    verificarToken,
    estoqueController.listar
)

app.get(
    '/estoque/:id',
    verificarToken,
    estoqueController.consultarPorCod
)

app.put(
    '/estoque/:id',
    verificarToken,
    estoqueController.atualizar
)


// -------------------------
// ENTREGAS
// -------------------------

app.post(
    '/entrega',
    verificarToken,
    entregaController.cadastrar
)

app.get(
    '/entregas',
    verificarToken,
    entregaController.listar
)

app.get(
    '/entrega/:id',
    verificarToken,
    entregaController.consultarPorCod
)

app.put(
    '/entrega/:id',
    verificarToken,
    entregaController.atualizar
)

app.patch(
    '/entrega/:id',
    verificarToken,
    entregaController.atualizarParcial
)


// -------------------------
// CATEGORIAS - ADMIN
// -------------------------

app.post(
    '/categoria',
    verificarToken,
    categoriaController.cadastrar
)

app.put(
    '/categoria/:id',
    verificarToken,
    categoriaController.atualizar
)

app.patch(
    '/categoria/:id',
    verificarToken,
    categoriaController.atualizarParcial
)

app.delete(
    '/categoria/:id',
    verificarToken,
    categoriaController.excluir
)


// =====================================================
// TESTE DO JWT
// =====================================================

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


// =====================================================
// ROTA PRINCIPAL
// =====================================================

app.get('/', (req, res) => {

    res.status(200).json({
        message: 'Aplicação rodando!'
    })

})


// =====================================================
// CONEXÃO COM BANCO
// =====================================================

conn.sync()
    .then(() => {

        app.listen(PORT, hostname, () => {

            console.log(
                `Aplicação rodando em: http://${hostname}:${PORT}`
            )

        })

    })
    .catch((err) => {

        console.error(
            'Erro ao se conectar com o banco de dados!',
            err
        )

    })