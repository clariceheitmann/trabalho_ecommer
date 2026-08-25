const ItemPedido = require('../models/ItemPedido')
const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {

    const valores = req.body

    if (!valores.pedido_id ||
        !valores.produto_id ||
        !valores.quantidade ||
        valores.preco_unitario === undefined ||
        valores.subtotal === undefined) {

        return res.status(400).json({
            message: 'Todos os campos obrigatórios devem ser preenchidos!'
        })
    }

    try {

        const pedido = await Pedido.findByPk(valores.pedido_id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        const produto = await Produto.findByPk(valores.produto_id)

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        const item = await ItemPedido.create(valores)

        res.status(201).json({
            message: 'Item do pedido cadastrado com sucesso!',
            item
        })

    } catch (err) {

        console.error('Erro ao cadastrar item do pedido!', err)

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