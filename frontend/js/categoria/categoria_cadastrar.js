
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formCategoria')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!token) {
        mensagem.textContent = 'Faça login para cadastrar uma categoria.'
        return
    }

    const categoria = {
        nome: document.getElementById('nome').value.trim(),
        descricao: document.getElementById('descricao').value.trim()
    }

    try {
        const resposta = await fetch(`${baseUrl}/categoria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(categoria)
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao cadastrar categoria.'
            return
        }

        mensagem.textContent = dados.message || 'Categoria cadastrada com sucesso!'
        formulario.reset()

    } catch (erro) {
        console.error('Erro ao cadastrar categoria:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
