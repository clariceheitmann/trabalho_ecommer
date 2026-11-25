
const baseUrl = 'http://localhost:3000'
const formulario = document.getElementById('formAdminLogin')

formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    try {

        const resposta = await fetch(`${baseUrl}/login/admin`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                senha
            })

        })

        const dados = await resposta.json()

        if (!resposta.ok) {

            alert(dados.message)

            return
        }

        // Salva os dados do administrador
        localStorage.setItem('token', dados.token)

        localStorage.setItem(
            'usuario',
            JSON.stringify(dados.usuario)
        )

        alert('Login administrativo realizado com sucesso!')

        window.location.href = 'admin.html'

    } catch (erro) {

        console.error('Erro ao realizar login administrativo:', erro)

        alert('Não foi possível conectar ao servidor.')

    }

})
