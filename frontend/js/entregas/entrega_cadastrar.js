
const form = document.getElementById('formEntrega')
const mensagem = document.getElementById('mensagem')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    const valores = {
        pedido_id: Number(document.getElementById('pedido_id').value),
        endereco: document.getElementById('endereco').value.trim(),
        codigo_rastreio: document.getElementById('codigo_rastreio').value.trim() || null
    }

    try {
        const resposta = await fetch('http://localhost:3000/entrega', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(valores)
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao cadastrar entrega.'
            return
        }

        mensagem.textContent = dados.message || 'Entrega cadastrada com sucesso!'
        form.reset()
    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
