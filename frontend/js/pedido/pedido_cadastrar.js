
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

document.getElementById('form_pedido').addEventListener('submit', async (e) => {
    e.preventDefault()

    const valor_total = document.getElementById('valor_total').value

    try {
        const resposta = await fetch(`${baseUrl}/pedido`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ valor_total })
        })

        const dados = await resposta.json()

        alert(dados.message)

        if (resposta.ok) {
            window.location.href = 'pedido_listar.html'
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao cadastrar pedido!')
    }
})
