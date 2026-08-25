const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {

    const valores = req.body

    if (!valores.nome || !valores.artista || !valores.album ||
        !valores.formato || !valores.ano || !valores.preco ||
        !valores.categoria_id) {

        return res.status(400).json({
            message: 'Todos os campos obrigatórios devem ser preenchidos!'
        })
    }

    try {

        const produto = await Produto.create(valores)

        res.status(201).json({
            message: 'Produto cadastrado com sucesso!',
            produto
        })

    } catch (err) {

        console.error('Erro ao cadastrar produto!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar produto!'
        })
    }
}


const listar = async (req, res) => {

    try {

        const produtos = await Produto.findAll()

        res.status(200).json(produtos)

    } catch (err) {

        console.error('Erro ao listar produtos!', err)

        res.status(500).json({
            message: 'Erro ao listar produtos!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const produto = await Produto.findByPk(id)

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        res.status(200).json(produto)

    } catch (err) {

        console.error('Erro ao consultar produto!', err)

        res.status(500).json({
            message: 'Erro ao consultar produto!'
        })
    }
}


const consultarPorNome = async (req, res) => {

    const nome = req.params.nome

    try {

        const produto = await Produto.findOne({
            where: {
                nome: nome
            }
        })

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        res.status(200).json(produto)

    } catch (err) {

        console.error('Erro ao consultar produto!', err)

        res.status(500).json({
            message: 'Erro ao consultar produto!'
        })
    }
}


const excluir = async (req, res) => {

    const id = req.params.id

    try {

        const produto = await Produto.findByPk(id)

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        await Produto.destroy({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: 'Produto excluído com sucesso!'
        })

    } catch (err) {

        console.error('Erro ao excluir produto!', err)

        res.status(500).json({
            message: 'Erro ao excluir produto!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const produto = await Produto.findByPk(id)

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        await Produto.update(valores, {
            where: {
                id: id
            }
        })

        const atualizado = await Produto.findByPk(id)

        res.status(200).json(atualizado)

    } catch (err) {

        console.error('Erro ao atualizar produto!', err)

        res.status(500).json({
            message: 'Erro ao atualizar produto!'
        })
    }
}


const atualizarParcial = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const produto = await Produto.findByPk(id)

        if (!produto) {
            return res.status(404).json({
                message: 'Produto não encontrado!'
            })
        }

        await produto.update(valores)

        res.status(200).json(produto)

    } catch (err) {

        console.error('Erro ao atualizar produto!', err)

        res.status(500).json({
            message: 'Erro ao atualizar produto!'
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