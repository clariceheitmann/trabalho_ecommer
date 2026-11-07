
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

const select = document.getElementById('id')

async function carregarPedidos() {
    try {
        const resposta = await fetch(`${baseUrl}/pedidos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const pedidos = await resposta.json()

        select.innerHTML = '<option value="">Selecione</option>'

        if (!resposta.ok) {
            alert(pedidos.message)
            return
        }

        pedidos.forEach(pedido => {
            select.innerHTML += `
                <option value="${pedido.id}">
                    Pedido ${pedido.id} - R$ ${Number(pedido.valor_total).toFixed(2)}
                </option>
            `
        })

    } catch (erro) {
        console.error(erro)
        alert('Erro ao carregar pedidos!')
    }
}

document.getElementById('form_excluir').addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = select.value

    if (!confirm('Deseja realmente excluir este pedido?')) {
        return
    }

    try {
        const resposta = await fetch(`${baseUrl}/pedido/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        alert(resposta.ok ? 'Pedido excluído com sucesso!' : dados.message)

        if (resposta.ok) {
            carregarPedidos()
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao excluir pedido!')
    }
})

carregarPedidos()
