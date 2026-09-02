const ItemPedido = require('../models/ItemPedido')
const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')

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

        // Verifica se o pedido existe
        const pedido = await Pedido.findByPk(pedido_id)

        if (!pedido) {

            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })

        }


        // Verifica se o produto existe
        const produto = await Produto.findByPk(produto_id)

        if (!produto) {

            return res.status(404).json({
                message: 'Produto não encontrado!'
            })

        }


        // Usa o preço que está cadastrado no banco
        const preco_unitario = Number(produto.preco)

        const subtotal = preco_unitario * quantidade


        // Cria o item
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

        const itens = await ItemPedido.findAll()

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

        res.status(200).json(item)

    } catch (err) {

        console.error('Erro ao consultar item!', err)

        res.status(500).json({
            message: 'Erro ao consultar item!'
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
    excluir
}