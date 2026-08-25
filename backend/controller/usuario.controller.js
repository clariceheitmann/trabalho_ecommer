const Usuario = require('../models/Usuario')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha) {
        return res.status(400).json({
            message: 'Nome, email e senha devem ser preenchidos!'
        })
    }

    try {
        const usuarioExistente = await Usuario.findOne({
            where: {
                email: valores.email
            }
        })

        if (usuarioExistente) {
            return res.status(409).json({
                message: 'Este email já está cadastrado!'
            })
        }

        const usuario = await Usuario.create(valores)

        res.status(201).json({
            message: 'Usuario cadastrado com sucesso!',
            usuario
        })

    } catch (err) {
        console.error('Erro ao cadastrar usuario!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar usuario!'
        })
    }
}


const listar = async (req, res) => {

    try {
        const dados = await Usuario.findAll()

        res.status(200).json(dados)

    } catch (err) {
        console.error('Erro ao listar usuarios!', err)

        res.status(500).json({
            message: 'Erro ao listar usuarios!'
        })
    }
}


const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {
        const dados = await Usuario.findByPk(id)

        if (!dados) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        res.status(200).json(dados)

    } catch (err) {
        console.error('Erro ao consultar usuario!', err)

        res.status(500).json({
            message: 'Erro ao consultar usuario!'
        })
    }
}


const consultarPorNome = async (req, res) => {

    const nome = req.params.nome

    try {
        const dados = await Usuario.findOne({
            where: {
                nome: nome
            }
        })

        if (!dados) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        res.status(200).json(dados)

    } catch (err) {
        console.error('Erro ao consultar usuario!', err)

        res.status(500).json({
            message: 'Erro ao consultar usuario!'
        })
    }
}


const excluir = async (req, res) => {

    const id = req.params.id

    try {
        const dados = await Usuario.findByPk(id)

        if (!dados) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        await Usuario.destroy({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: 'Usuario excluído com sucesso!'
        })

    } catch (err) {
        console.error('Erro ao excluir usuario!', err)

        res.status(500).json({
            message: 'Erro ao excluir usuario!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {
        const dados = await Usuario.findByPk(id)

        if (!dados) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        await Usuario.update(valores, {
            where: {
                id: id
            }
        })

        const usuarioAtualizado = await Usuario.findByPk(id)

        res.status(200).json(usuarioAtualizado)

    } catch (err) {
        console.error('Erro ao atualizar usuario!', err)

        res.status(500).json({
            message: 'Erro ao atualizar usuario!'
        })
    }
}


const atualizarParcial = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {
        const dados = await Usuario.findByPk(id)

        if (!dados) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        await dados.update(valores)

        res.status(200).json(dados)

    } catch (err) {
        console.error('Erro ao atualizar usuario!', err)

        res.status(500).json({
            message: 'Erro ao atualizar usuario!'
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