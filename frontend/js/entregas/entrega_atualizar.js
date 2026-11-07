
const form = document.getElementById('formEntrega')
const mensagem = document.getElementById('mensagem')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const id = document.getElementById('id').value

    const valores = {
        endereco: document.getElementById('endereco').value.trim(),
        codigo_rastreio: document.getElementById('codigo_rastreio').value.trim() || null,
        status: document.getElementById('status').value
    }

    if (!valores.endereco) {
        mensagem.textContent = 'O endereço é obrigatório.'
        return
    }

    try {
        const resposta = await fetch(`http://localhost:3000/entrega/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(valores)
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao atualizar entrega.'
            return
        }

        mensagem.textContent = 'Entrega atualizada com sucesso!'
    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
