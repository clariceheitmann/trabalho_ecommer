
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formExcluir')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!token) {
        mensagem.textContent = 'Faça login para excluir uma categoria.'
        return
    }

    const id = document.getElementById('id').value

    if (!confirm(`Tem certeza que deseja excluir a categoria ${id}?`)) {
        return
    }

    try {
        const resposta = await fetch(
            `${baseUrl}/categoria/${encodeURIComponent(id)}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao excluir categoria.'
            return
        }

        mensagem.textContent = dados.message || 'Categoria excluída com sucesso!'
        formulario.reset()

    } catch (erro) {
        console.error('Erro ao excluir categoria:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
