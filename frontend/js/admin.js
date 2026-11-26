const token = localStorage.getItem('token')

if (!token) {
    alert('Você precisa fazer login como administrador.')
    return
}

const usuarioSalvo = localStorage.getItem('usuario')

if (!token || !usuarioSalvo) {
    alert('Você precisa fazer login como administrador!')
    window.location.href = 'admin_login.html'
} else {

    try {

        const usuario = JSON.parse(usuarioSalvo)

        if (usuario.tipo !== 'admin') {

            alert('Apenas administradores podem acessar esta página!')

            window.location.href = '../index.html'

        }

    } catch (erro) {

        localStorage.removeItem('token')
        localStorage.removeItem('usuario')

        alert('Dados de acesso inválidos! Faça login novamente.')

        window.location.href = 'admin_login.html'

    }

}
