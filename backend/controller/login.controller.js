const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {

    const { email, senha } = req.body

    if (!email || !senha) {

        return res.status(400).json({
            message: 'E-mail e senha são obrigatórios!'
        })

    }

    try {

        const usuario = await Usuario.findOne({
            where: {
                email: email
            }
        })

        if (!usuario) {

            return res.status(401).json({
                message: 'E-mail ou senha inválidos!'
            })

        }


        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        )


        if (!senhaValida) {

            return res.status(401).json({
                message: 'E-mail ou senha inválidos!'
            })

        }


        const token = jwt.sign(

            {
                id: usuario.id,
                email: usuario.email
            },

            'CHAVE_SECRETA_DO_PROJETO',

            {
                expiresIn: '2h'
            }

        )


        res.status(200).json({

            message: 'Login realizado com sucesso!',

            token: token

        })


    } catch (err) {

        console.error('Erro ao realizar login!', err)

        res.status(500).json({
            message: 'Erro ao realizar login!'
        })

    }

}

module.exports = {
    login
}