const Entrega = require('../models/Entrega')
const Pedido = require('../models/Pedido')

const cadastrar = async (req, res) => {

    const valores = req.body

    if (!valores.pedido_id || !valores.endereco) {
        return res.status(400).json({
            message: 'Pedido e endereço são obrigatórios!'
        })
    }

    try {

        const pedido = await Pedido.findByPk(valores.pedido_id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        const entregaExistente = await Entrega.findOne({
            where: {
                pedido_id: valores.pedido_id
            }
        })

        if (entregaExistente) {
            return res.status(409).json({
                message: 'Este pedido já possui uma entrega!'
            })
        }

        const entrega = await Entrega.create(valores)

        res.status(201).json({
            message: 'Entrega cadastrada com sucesso!',
            entrega
        })

    } catch (err) {

        console.error('Erro ao cadastrar entrega!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar entrega!'
        })
    }
}


const listar = async (req, res) => {

    try {

        const entregas = await Entrega.findAll()

        res.status(200).json(entregas)

    } catch (err) {

        console.error('Erro ao listar entregas!', err)

        res.status(500).json({
            message: 'Erro ao listar entregas!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const entrega = await Entrega.findByPk(id)

        if (!entrega) {
            return res.status(404).json({
                message: 'Entrega não encontrada!'
            })
        }

        res.status(200).json(entrega)

    } catch (err) {

        console.error('Erro ao consultar entrega!', err)

        res.status(500).json({
            message: 'Erro ao consultar entrega!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const entrega = await Entrega.findByPk(id)

        if (!entrega) {
            return res.status(404).json({
                message: 'Entrega não encontrada!'
            })
        }

        await entrega.update(valores)

        res.status(200).json(entrega)

    } catch (err) {

        console.error('Erro ao atualizar entrega!', err)

        res.status(500).json({
            message: 'Erro ao atualizar entrega!'
        })
    }
}


const atualizarParcial = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const entrega = await Entrega.findByPk(id)

        if (!entrega) {
            return res.status(404).json({
                message: 'Entrega não encontrada!'
            })
        }

        await entrega.update(valores)

        res.status(200).json(entrega)

    } catch (err) {

        console.error('Erro ao atualizar entrega!', err)

        res.status(500).json({
            message: 'Erro ao atualizar entrega!'
        })
    }
}

module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    atualizar,
    atualizarParcial
}