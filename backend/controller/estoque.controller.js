const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {

    const valores = req.body

    if (!valores.produto_id || valores.quantidade === undefined) {
        return res.status(400).json({
            message: 'Produto e quantidade são obrigatórios!'
        })
    }

    try {

        const produto = await Produto.findByPk(valores.produto_id)

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        const estoqueExistente = await Estoque.findOne({
            where: {
                produto_id: valores.produto_id
            }
        })

        if (estoqueExistente) {
            return res.status(409).json({
                message: 'Este produto já possui estoque cadastrado!'
            })
        }

        const estoque = await Estoque.create(valores)

        res.status(201).json({
            message: 'Estoque cadastrado com sucesso!',
            estoque
        })

    } catch (err) {

        console.error('Erro ao cadastrar estoque!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar estoque!'
        })
    }
}


const listar = async (req, res) => {

    try {

        const estoques = await Estoque.findAll()

        res.status(200).json(estoques)

    } catch (err) {

        console.error('Erro ao listar estoques!', err)

        res.status(500).json({
            message: 'Erro ao listar estoques!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const estoque = await Estoque.findByPk(id)

        if (!estoque) {
            return res.status(404).json({
                message: 'Estoque não encontrado!'
            })
        }

        res.status(200).json(estoque)

    } catch (err) {

        console.error('Erro ao consultar estoque!', err)

        res.status(500).json({
            message: 'Erro ao consultar estoque!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const estoque = await Estoque.findByPk(id)

        if (!estoque) {
            return res.status(404).json({
                message: 'Estoque não encontrado!'
            })
        }

        await estoque.update(valores)

        res.status(200).json(estoque)

    } catch (err) {

        console.error('Erro ao atualizar estoque!', err)

        res.status(500).json({
            message: 'Erro ao atualizar estoque!'
        })
    }
}


module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    atualizar
}