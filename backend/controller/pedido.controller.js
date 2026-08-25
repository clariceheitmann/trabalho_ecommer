const Pedido = require('../models/Pedido')
const Usuario = require('../models/Usuario')

const cadastrar = async (req, res) => {

    const valores = req.body

    if (!valores.usuario_id || valores.valor_total === undefined) {
        return res.status(400).json({
            message: 'Usuario e valor total são obrigatórios!'
        })
    }

    try {

        const usuario = await Usuario.findByPk(valores.usuario_id)

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        const pedido = await Pedido.create(valores)

        res.status(201).json({
            message: 'Pedido cadastrado com sucesso!',
            pedido
        })

    } catch (err) {

        console.error('Erro ao cadastrar pedido!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar pedido!'
        })
    }
}


const listar = async (req, res) => {

    try {

        const pedidos = await Pedido.findAll()

        res.status(200).json(pedidos)

    } catch (err) {

        console.error('Erro ao listar pedidos!', err)

        res.status(500).json({
            message: 'Erro ao listar pedidos!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const pedido = await Pedido.findByPk(id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        res.status(200).json(pedido)

    } catch (err) {

        console.error('Erro ao consultar pedido!', err)

        res.status(500).json({
            message: 'Erro ao consultar pedido!'
        })
    }
}


const excluir = async (req, res) => {

    const id = req.params.id

    try {

        const pedido = await Pedido.findByPk(id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await Pedido.destroy({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: 'Pedido excluído com sucesso!'
        })

    } catch (err) {

        console.error('Erro ao excluir pedido!', err)

        res.status(500).json({
            message: 'Erro ao excluir pedido!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const pedido = await Pedido.findByPk(id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await pedido.update(valores)

        res.status(200).json(pedido)

    } catch (err) {

        console.error('Erro ao atualizar pedido!', err)

        res.status(500).json({
            message: 'Erro ao atualizar pedido!'
        })
    }
}


const atualizarParcial = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const pedido = await Pedido.findByPk(id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await pedido.update(valores)

        res.status(200).json(pedido)

    } catch (err) {

        console.error('Erro ao atualizar pedido!', err)

        res.status(500).json({
            message: 'Erro ao atualizar pedido!'
        })
    }
}


module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    excluir,
    atualizar,
    atualizarParcial
}