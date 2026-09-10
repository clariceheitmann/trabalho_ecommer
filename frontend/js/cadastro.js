const baseUrl = 'http://localhost:3000'

const formulario = document.getElementById('formCadastro')

formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    const dadosUsuario = {

        nome: document.getElementById('nome').value,
        sobreNome: document.getElementById('sobreNome').value,
        idade: document.getElementById('idade').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value

    }

    try {

        const resposta = await fetch(`${baseUrl}/usuario`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dadosUsuario)

        })

        const dados = await resposta.json()

        if (!resposta.ok) {

            alert(dados.message)

            return
        }

        alert('Cadastro realizado com sucesso!')

        window.location.href = 'login.html'

    } catch (erro) {

        console.error('Erro ao cadastrar usuário:', erro)

        alert('Não foi possível realizar o cadastro.')

    }

})