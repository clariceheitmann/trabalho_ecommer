
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formExcluir')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!token) {
        mensagem.textContent = 'Faça login para continuar.'
        return
    }

    const id = document.getElementById('id').value

    const confirmar = confirm(
        `Tem certeza de que deseja excluir o usuário ${id}?`
    )

    if (!confirmar) {
        return
    }

    try {
        const resposta = await fetch(
            `${baseUrl}/usuario/${encodeURIComponent(id)}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao excluir usuário.'
            return
        }

        mensagem.textContent = dados.message || 'Usuário excluído com sucesso!'
        formulario.reset()

    } catch (erro) {
        console.error('Erro ao excluir usuário:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
