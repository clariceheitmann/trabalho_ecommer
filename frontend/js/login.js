const baseUrl = 'http://localhost:3000'

const formulario = document.getElementById('formLogin')

formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    try {

        const resposta = await fetch(`${baseUrl}/login`, {

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

        // Guarda o token do usuário
        localStorage.setItem('token', dados.token)

        alert('Login realizado com sucesso!')

        window.location.href = 'produtos.html'

    } catch (erro) {

        console.error('Erro ao realizar login:', erro)

        alert('Não foi possível realizar o login.')

    }

})