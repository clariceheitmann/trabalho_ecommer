
const baseUrl = 'http://localhost:3000'
const formulario = document.getElementById('formCadastro')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    const dadosUsuario = {
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
        const resposta = await fetch(`${baseUrl}/usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario)
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao cadastrar usuário.'
            return
        }

        mensagem.textContent = dados.message || 'Usuário cadastrado!'
        formulario.reset()

    } catch (erro) {
        console.error('Erro ao cadastrar:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
