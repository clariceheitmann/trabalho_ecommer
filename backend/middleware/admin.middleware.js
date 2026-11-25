const verificarAdmin = (req, res, next) => {

    // Verifica se o usuário está autenticado
    if (!req.usuario) {
        return res.status(401).json({
            message: 'Usuário não autenticado!'
        })
    }

    // Verifica se o usuário é administrador
    if (req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            message: 'Acesso permitido somente para administradores!'
        })
    }

    next()
}

module.exports = verificarAdmin