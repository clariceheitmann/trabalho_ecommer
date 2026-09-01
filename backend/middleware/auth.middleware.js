const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {

        return res.status(401).json({
            message: 'Token não informado!'
        })

    }


    const partes = authHeader.split(' ')

    const token = partes[1]


    if (!token) {

        return res.status(401).json({
            message: 'Token inválido!'
        })

    }


    try {

        const usuario = jwt.verify(
            token,
            'CHAVE_SECRETA_DO_PROJETO'
        )

        req.usuario = usuario

        next()

    } catch (err) {

        return res.status(401).json({
            message: 'Token inválido ou expirado!'
        })

    }

}


module.exports = verificarToken