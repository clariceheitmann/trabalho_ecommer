
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formAtualizar')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!token) {
        mensagem.textContent = 'Faça login para atualizar uma categoria.'
        return
    }

    const id = document.getElementById('id').value

    const categoria = {
        nome: document.getElementById('nome').value.trim(),
        descricao: document.getElementById('descricao').value.trim() || null
    }

    try {
        const resposta = await fetch(
            `${baseUrl}/categoria/${encodeURIComponent(id)}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(categoria)
            }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao atualizar categoria.'
            return
        }

        mensagem.textContent = 'Categoria atualizada com sucesso!'

    } catch (erro) {
        console.error('Erro ao atualizar categoria:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
