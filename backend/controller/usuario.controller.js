const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')

const cadastrar = async (req, res) => {

    try {

        const valores = req.body

        if (
            !valores.nome ||
            !valores.sobreNome ||
            !valores.idade ||
            !valores.email ||
            !valores.senha ||
            !valores.telefone ||
            !valores.cpf ||
            !valores.cep ||
            !valores.numero
        ) {
            return res.status(400).json({
                message: 'Todos os campos obrigatórios devem ser preenchidos!'
            })
        }


        // =========================
        // VALIDAR CPF
        // =========================

        if (!validarCPF(valores.cpf)) {

            return res.status(400).json({
                message: 'CPF inválido!'
            })

        }


        // =========================
        // VERIFICAR E-MAIL
        // =========================

        const emailExiste = await Usuario.findOne({
            where: {
                email: valores.email
            }
        })

        if (emailExiste) {

            return res.status(400).json({
                message: 'Este e-mail já está cadastrado!'
            })

        }


        // =========================
        // VERIFICAR CPF
        // =========================

        const cpfExiste = await Usuario.findOne({
            where: {
                cpf: valores.cpf.replace(/\D/g, '')
            }
        })

        if (cpfExiste) {

            return res.status(400).json({
                message: 'Este CPF já está cadastrado!'
            })

        }


        // =========================
        // BUSCAR CEP
        // =========================

        const endereco = await buscarCEP(valores.cep)


        // =========================
        // CRIPTOGRAFAR SENHA
        // =========================

        const senhaCriptografada = await bcrypt.hash(
            valores.senha,
            10
        )


        // =========================
        // CRIAR USUÁRIO
        // =========================

        await Usuario.create({

            nome: valores.nome,

            sobreNome: valores.sobreNome,

            idade: valores.idade,

            email: valores.email,

            senha: senhaCriptografada,

            telefone: valores.telefone,

            cpf: valores.cpf.replace(/\D/g, ''),

            cep: valores.cep.replace(/\D/g, ''),

            rua: endereco.logradouro,

            numero: valores.numero,

            bairro: endereco.bairro,

            cidade: endereco.localidade,

            estado: endereco.uf

        })


        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!'
        })


    } catch (err) {

        console.error('Erro ao cadastrar usuário!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar usuário!'
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

const validarCPF = (cpf) => {

    cpf = cpf.replace(/\D/g, '')

    if (cpf.length !== 11) {
        return false
    }

    // Impede CPFs como 11111111111
    if (/^(\d)\1+$/.test(cpf)) {
        return false
    }

    let soma = 0

    // Primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i)
    }

    let resto = (soma * 10) % 11

    if (resto === 10) {
        resto = 0
    }

    if (resto !== Number(cpf[9])) {
        return false
    }

    soma = 0

    // Segundo dígito verificador
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i)
    }

    resto = (soma * 10) % 11

    if (resto === 10) {
        resto = 0
    }

    if (resto !== Number(cpf[10])) {
        return false
    }

    return true
}

const buscarCEP = async (cep) => {

    cep = cep.replace(/\D/g, '')

    if (cep.length !== 8) {
        throw new Error('CEP inválido!')
    }

    const resposta = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
    )

    const dados = await resposta.json()

    if (dados.erro) {
        throw new Error('CEP não encontrado!')
    }

    return dados
}


module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    consultarPorNome,
    excluir,
    atualizar,
    atualizarParcial,
    validarCPF,
    buscarCEP
}