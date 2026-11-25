const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')

const verificarPermissao = (req, id) => {
    return req.usuario.tipo === 'admin' ||
        Number(req.usuario.id) === Number(id)
}

const prepararValoresAtualizacao = async (req) => {

    const camposPermitidos = [
        'nome',
        'sobreNome',
        'idade',
        'email',
        'telefone',
        'cpf',
        'cep',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado'
    ]

    const valores = {}

    camposPermitidos.forEach(campo => {
        if (req.body[campo] !== undefined) {
            valores[campo] = req.body[campo]
        }
    })

    // A senha sempre será criptografada antes de ser salva
    if (req.body.senha) {
        valores.senha = await bcrypt.hash(req.body.senha, 10)
    }

    // Somente administradores podem alterar o tipo da conta
    if (req.usuario.tipo === 'admin' && req.body.tipo !== undefined) {
        if (['admin', 'usuario'].includes(req.body.tipo)) {
            valores.tipo = req.body.tipo
        }
    }

    return valores
}

const cadastrar = async (req, res) => {

    const valores = req.body
    
    console.log('CPF recebido:', valores.cpf)

    try {

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

        const cpfLimpo = valores.cpf.replace(/\D/g, '')


        if (!validarCPF(cpfLimpo)) {
    return res.status(400).json({
        message: 'CPF inválido!'
    })
}


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


        const cpfExiste = await Usuario.findOne({
    where: {
        cpf: cpfLimpo
    }
})

        if (cpfExiste) {

            return res.status(400).json({
                message: 'Este CPF já está cadastrado!'
            })

        }


        const endereco = await buscarCEP(valores.cep)


        const senhaCriptografada = await bcrypt.hash(
            valores.senha,
            10
        )


        await Usuario.create({

            nome: valores.nome,

            sobreNome: valores.sobreNome,

            idade: valores.idade,

            email: valores.email,

            senha: senhaCriptografada,

            telefone: valores.telefone,

            cpf: cpfLimpo,

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


const cadastrarAdmin = async (req, res) => {

    const valores = req.body

    try {

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

        const cpfLimpo = valores.cpf.replace(/\D/g, '')

        if (!validarCPF(cpfLimpo)) {
            return res.status(400).json({
                message: 'CPF inválido!'
            })
        }

        const emailExiste = await Usuario.findOne({
            where: { email: valores.email }
        })

        if (emailExiste) {
            return res.status(400).json({
                message: 'Este e-mail já está cadastrado!'
            })
        }

        const cpfExiste = await Usuario.findOne({
            where: { cpf: cpfLimpo }
        })

        if (cpfExiste) {
            return res.status(400).json({
                message: 'Este CPF já está cadastrado!'
            })
        }

        const endereco = await buscarCEP(valores.cep)

        const senhaCriptografada = await bcrypt.hash(
            valores.senha,
            10
        )

        await Usuario.create({

            nome: valores.nome,
            sobreNome: valores.sobreNome,
            idade: valores.idade,
            email: valores.email,
            senha: senhaCriptografada,
            tipo: 'admin',
            telefone: valores.telefone,
            cpf: cpfLimpo,
            cep: valores.cep.replace(/\D/g, ''),
            rua: endereco.logradouro,
            numero: valores.numero,
            bairro: endereco.bairro,
            cidade: endereco.localidade,
            estado: endereco.uf

        })

        return res.status(201).json({
            message: 'Administrador cadastrado com sucesso!'
        })

    } catch (err) {

        console.error('Erro ao cadastrar administrador!', err)

        return res.status(500).json({
            message: 'Erro ao cadastrar administrador!'
        })

    }
}



const listar = async (req, res) => {

    try {
        const dados = await Usuario.findAll({
        attributes: { exclude: ['senha'] }
    })

        res.status(200).json(dados)

    } catch (err) {
        console.error('Erro ao listar usuarios!', err)

        res.status(500).json({
            message: 'Erro ao listar usuarios!'
        })
    }
}



const consultarPorCod = async (req, res) => {
    const id = Number(req.params.id)

    if (!verificarPermissao(req, id)) {
    return res.status(403).json({
        message: 'Você não tem permissão para acessar este usuário!'
    })
}

    try {
        // Busca o usuário pelo código, sem retornar a senha
        const dados = await Usuario.findByPk(id, {
            attributes: { exclude: ['senha'] }
        })

        // Verifica se o usuário existe
        if (!dados) {
            return res.status(404).json({
                message: 'Usuário não encontrado!'
            })
        }

        return res.status(200).json(dados)

    } catch (err) {
        console.error('Erro ao consultar usuário!', err)

        return res.status(500).json({
            message: 'Erro ao consultar usuário!'
        })
    }
}





const consultarPorNome = async (req, res) => {

    const nome = req.params.nome

    if (req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            message: 'Acesso permitido somente para administradores!'
        })
    }

    try {
        const dados = await Usuario.findOne({
            where: {
                nome: nome
            },
            attributes: {
                exclude: ['senha']
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

    if (!verificarPermissao(req, id)) {
    return res.status(403).json({
        message: 'Você não tem permissão para acessar este usuário!'
    })
}

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
    const id = Number(req.params.id)

    if (!verificarPermissao(req, id)) {
    return res.status(403).json({
        message: 'Você não tem permissão para acessar este usuário!'
    })
}

    try {
        // Procura o usuário que será atualizado
        const dados = await Usuario.findByPk(id)

        if (!dados) {
            return res.status(404).json({
                message: 'Usuário não encontrado!'
            })
        }

        const valores = await prepararValoresAtualizacao(req)

        await dados.update(valores)

        // Não envia a senha na resposta
        const usuarioAtualizado = await Usuario.findByPk(id, {
            attributes: { exclude: ['senha'] }
        })

        return res.status(200).json(usuarioAtualizado)

    } catch (err) {
        console.error('Erro ao atualizar usuário!', err)

        return res.status(500).json({
            message: 'Erro ao atualizar usuário!'
        })
    }
}




const atualizarParcial = async (req, res) => {
    const id = Number(req.params.id)

    if (!verificarPermissao(req, id)) {
    return res.status(403).json({
        message: 'Você não tem permissão para acessar este usuário!'
    })
}

    try {
        const dados = await Usuario.findByPk(id)

        if (!dados) {
            return res.status(404).json({
                message: 'Usuário não encontrado!'
            })
        }

        const valores = await prepararValoresAtualizacao(req)

        await dados.update(valores)

        // Retorna os dados sem a senha
        const usuarioAtualizado = await Usuario.findByPk(id, {
            attributes: { exclude: ['senha'] }
        })

        return res.status(200).json(usuarioAtualizado)

    } catch (err) {
        console.error('Erro ao atualizar usuário!', err)

        return res.status(500).json({
            message: 'Erro ao atualizar usuário!'
        })
    }
}


const validarCPF = (cpf) => {

    cpf = cpf.replace(/\D/g, '')

    if (cpf.length !== 11) {
        return false
    }

    if (/^(\d)\1+$/.test(cpf)) {
        return false
    }

    let soma = 0

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
    cadastrarAdmin,
    listar,
    consultarPorCod,
    consultarPorNome,
    excluir,
    atualizar,
    atualizarParcial,
    validarCPF,
    buscarCEP
}