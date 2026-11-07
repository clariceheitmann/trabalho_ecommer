
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

document.getElementById('form_atualizar').addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value
    const status = document.getElementById('status').value

    try {
        const resposta = await fetch(`${baseUrl}/pedido/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        })

        const dados = await resposta.json()

        alert(resposta.ok ? 'Pedido atualizado parcialmente!' : dados.message)

        if (resposta.ok) {
            window.location.href = 'pedido_listar.html'
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao atualizar pedido!')
    }
})
