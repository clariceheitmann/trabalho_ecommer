const Categoria = require('../models/Categoria')

const cadastrar = async (req, res) => {

    const valores = req.body

    if (!valores.nome) {
        return res.status(400).json({
            message: 'O nome da categoria é obrigatório!'
        })
    }

    try {

        const existente = await Categoria.findOne({
            where: {
                nome: valores.nome
            }
        })

        if (existente) {
            return res.status(409).json({
                message: 'Esta categoria já existe!'
            })
        }

        const categoria = await Categoria.create(valores)

        res.status(201).json({
            message: 'Categoria cadastrada com sucesso!',
            categoria
        })

    } catch (err) {

        console.error('Erro ao cadastrar categoria!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar categoria!'
        })
    }
}


const listar = async (req, res) => {

    try {

        const categorias = await Categoria.findAll()

        res.status(200).json(categorias)

    } catch (err) {

        console.error('Erro ao listar categorias!', err)

        res.status(500).json({
            message: 'Erro ao listar categorias!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const categoria = await Categoria.findByPk(id)

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria não encontrada!'
            })
        }

        res.status(200).json(categoria)

    } catch (err) {

        console.error('Erro ao consultar categoria!', err)

        res.status(500).json({
            message: 'Erro ao consultar categoria!'
        })
    }
}


const consultarPorNome = async (req, res) => {

    const nome = req.params.nome

    try {

        const categoria = await Categoria.findOne({
            where: {
                nome: nome
            }
        })

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria não encontrada!'
            })
        }

        res.status(200).json(categoria)

    } catch (err) {

        console.error('Erro ao consultar categoria!', err)

        res.status(500).json({
            message: 'Erro ao consultar categoria!'
        })
    }
}


const excluir = async (req, res) => {

    const id = req.params.id

    try {

        const categoria = await Categoria.findByPk(id)

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria não encontrada!'
            })
        }

        await Categoria.destroy({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: 'Categoria excluída com sucesso!'
        })

    } catch (err) {

        console.error('Erro ao excluir categoria!', err)

        res.status(500).json({
            message: 'Erro ao excluir categoria!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const categoria = await Categoria.findByPk(id)

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria não encontrada!'
            })
        }

        await Categoria.update(valores, {
            where: {
                id: id
            }
        })

        const atualizada = await Categoria.findByPk(id)

        res.status(200).json(atualizada)

    } catch (err) {

        console.error('Erro ao atualizar categoria!', err)

        res.status(500).json({
            message: 'Erro ao atualizar categoria!'
        })
    }
}


const atualizarParcial = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const categoria = await Categoria.findByPk(id)

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria não encontrada!'
            })
        }

        await categoria.update(valores)

        res.status(200).json(categoria)

    } catch (err) {

        console.error('Erro ao atualizar categoria!', err)

        res.status(500).json({
            message: 'Erro ao atualizar categoria!'
        })
    }
}


module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    consultarPorNome,
    excluir,
    atualizar,
    atualizarParcial
}