
const btnExcluir = document.getElementById('btnExcluir')
const mensagem = document.getElementById('mensagem')

btnExcluir.addEventListener('click', excluirEntrega)

async function excluirEntrega() {
    const id = document.getElementById('id').value

    if (!id || Number(id) < 1) {
        mensagem.textContent = 'Informe um código válido.'
        return
    }

    if (!confirm('Tem certeza de que deseja excluir esta entrega?')) {
        return
    }

    const token = localStorage.getItem('token')

    try {
        const resposta = await fetch(`http://localhost:3000/entrega/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao excluir entrega.'
            return
        }

        mensagem.textContent = dados.message || 'Entrega excluída com sucesso!'
        document.getElementById('id').value = ''
    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}
