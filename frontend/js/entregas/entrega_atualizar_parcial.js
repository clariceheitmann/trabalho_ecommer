
const form = document.getElementById('formEntrega')
const mensagem = document.getElementById('mensagem')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const id = document.getElementById('id').value

    const endereco = document.getElementById('endereco').value.trim()
    const rastreio = document.getElementById('codigo_rastreio').value.trim()
    const status = document.getElementById('status').value

    const valores = {}

    if (endereco) valores.endereco = endereco
    if (rastreio) valores.codigo_rastreio = rastreio
    if (status) valores.status = status

    if (Object.keys(valores).length === 0) {
        mensagem.textContent = 'Preencha pelo menos um campo para alterar.'
        return
    }

    try {
        const resposta = await fetch(`http://localhost:3000/entrega/${id}`, {
            method: 'PATCH',
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
        form.reset()
    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
