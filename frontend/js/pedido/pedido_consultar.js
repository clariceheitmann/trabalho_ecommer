
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

document.getElementById('form_consultar').addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value
    const resultado = document.getElementById('resultado')

    try {
        const resposta = await fetch(`${baseUrl}/pedido/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const pedido = await resposta.json()

        if (!resposta.ok) {
            resultado.innerHTML = `<p>${pedido.message}</p>`
            return
        }

        resultado.innerHTML = `
            <div class="card">
                <h3>Pedido ${pedido.id}</h3>
                <p>Usuário: ${pedido.usuario_id}</p>
                <p>Data: ${new Date(pedido.data_pedido).toLocaleString('pt-BR')}</p>
                <p>Valor: R$ ${Number(pedido.valor_total).toFixed(2)}</p>
                <p>Status: ${pedido.status}</p>
            </div>
        `

    } catch (erro) {
        console.error(erro)
        alert('Erro ao consultar pedido!')
    }
})
