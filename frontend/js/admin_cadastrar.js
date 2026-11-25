const token = localStorage.getItem('token')
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

const baseUrl = 'http://localhost:3000'

const formulario = document.getElementById('formCadastroAdmin')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    const token = localStorage.getItem('token')

    const dadosAdmin = {
        nome: document.getElementById('nome').value.trim(),
        sobreNome: document.getElementById('sobreNome').value.trim(),
        idade: document.getElementById('idade').value,
        email: document.getElementById('email').value.trim(),
        senha: document.getElementById('senha').value,
        telefone: document.getElementById('telefone').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        cep: document.getElementById('cep').value.trim(),
        numero: document.getElementById('numero').value.trim()
    }

    try {

        const resposta = await fetch(`${baseUrl}/admin/usuario`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify(dadosAdmin)

        })

        const dados = await resposta.json()

        if (!resposta.ok) {

            mensagem.textContent = dados.message || 'Erro ao cadastrar administrador.'

            return
        }

        mensagem.textContent = dados.message

        formulario.reset()

    } catch (erro) {

        console.error('Erro ao cadastrar administrador:', erro)

        mensagem.textContent = 'Não foi possível conectar ao servidor.'

    }

})
