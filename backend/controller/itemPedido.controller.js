const ItemPedido = require('../models/ItemPedido')
const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')
const { Op } = require('sequelize')

const buscarPedidoPermitido = async (req, pedido_id) => {

    const where = {
        id: pedido_id
    }

    if (req.usuario.tipo !== 'admin') {
        where.usuario_id = req.usuario.id
    }

    return await Pedido.findOne({ where })
}

const cadastrar = async (req, res) => {

    const {
        pedido_id,
        produto_id,
        quantidade
    } = req.body

    if (!pedido_id || !produto_id || !quantidade) {

        return res.status(400).json({
            message: 'Pedido, produto e quantidade são obrigatórios!'
        })

    }

    if (quantidade <= 0) {

        return res.status(400).json({
            message: 'A quantidade deve ser maior que zero!'
        })

    }

    try {

       const pedido = await buscarPedidoPermitido(req, pedido_id)

        if (!pedido) {

            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })

        }


        const produto = await Produto.findByPk(produto_id)

        if (!produto) {

            return res.status(404).json({
                message: 'Produto não encontrado!'
            })

        }


        const preco_unitario = Number(produto.preco)

        const subtotal = preco_unitario * quantidade


        const item = await ItemPedido.create({

            pedido_id,

            produto_id,

            quantidade,

            preco_unitario,

            subtotal

        })


        res.status(201).json({

            message: 'Item do pedido cadastrado com sucesso!',

            item

        })

    } catch (err) {

        console.error(
            'Erro ao cadastrar item do pedido!',
            err
        )

        res.status(500).json({
            message: 'Erro ao cadastrar item do pedido!'
        })

    }
}


const listar = async (req, res) => {

    try {

        // Administrador pode listar todos os itens
        if (req.usuario.tipo === 'admin') {

            const itens = await ItemPedido.findAll()

            return res.status(200).json(itens)
        }

        // Cliente busca somente seus pedidos
        const pedidos = await Pedido.findAll({
            where: {
                usuario_id: req.usuario.id
            },
            attributes: ['id']
        })

        const idsPedidos = pedidos.map(pedido => pedido.id)

        const itens = await ItemPedido.findAll({
            where: {
    pedido_id: {
        [Op.in]: idsPedidos
    }
}
        })

        res.status(200).json(itens)

    } catch (err) {

        console.error('Erro ao listar itens!', err)

        res.status(500).json({
            message: 'Erro ao listar itens!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const item = await ItemPedido.findByPk(id)

if (!item) {
    return res.status(404).json({
        message: 'Item do pedido não encontrado!'
    })
}

const pedido = await buscarPedidoPermitido(req, item.pedido_id)

if (!pedido) {
    return res.status(404).json({
        message: 'Item do pedido não encontrado!'
    })
}

        res.status(200).json(item)

    } catch (err) {

        console.error('Erro ao consultar item!', err)

        res.status(500).json({
            message: 'Erro ao consultar item!'
        })
    }
}




const atualizar = async (req, res) => {

    const id = req.params.id
    const { quantidade } = req.body

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return res.status(400).json({
            message: 'Informe uma quantidade válida!'
        })
    }

    try {

        const item = await ItemPedido.findByPk(id)

        if (!item) {
            return res.status(404).json({
                message: 'Item do pedido não encontrado!'
            })
        }

        const pedido = await buscarPedidoPermitido(req, item.pedido_id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Item do pedido não encontrado!'
            })
        }

        if (
            req.usuario.tipo !== 'admin' &&
            pedido.status !== 'AGUARDANDO_PAGAMENTO'
        ) {
            return res.status(403).json({
                message: 'Não é possível alterar itens deste pedido!'
            })
        }

        const subtotal = Number(item.preco_unitario) * quantidade

        await item.update({
            quantidade,
            subtotal
        })

        res.status(200).json({
            message: 'Item atualizado com sucesso!',
            item
        })

    } catch (err) {

        console.error('Erro ao atualizar item!', err)

        res.status(500).json({
            message: 'Erro ao atualizar item!'
        })
    }
}




const excluir = async (req, res) => {

    const id = req.params.id

    try {

        const item = await ItemPedido.findByPk(id)

        if (!item) {
            return res.status(404).json({
                message: 'Item do pedido não encontrado!'
            })
        }

        const pedido = await buscarPedidoPermitido(req, item.pedido_id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Item do pedido não encontrado!'
            })
        }

        if (
            req.usuario.tipo !== 'admin' &&
            pedido.status !== 'AGUARDANDO_PAGAMENTO'
        ) {
            return res.status(403).json({
                message: 'Não é possível excluir itens deste pedido!'
            })
        }

        await ItemPedido.destroy({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: 'Item excluído com sucesso!'
        })

    } catch (err) {

        console.error('Erro ao excluir item!', err)

        res.status(500).json({
            message: 'Erro ao excluir item!'
        })
    }
}



module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    atualizar,
    excluir
}