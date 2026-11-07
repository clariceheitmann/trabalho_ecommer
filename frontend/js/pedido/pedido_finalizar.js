
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

        const aguardando = pedidos.filter(pedido =>
            pedido.status === 'AGUARDANDO_PAGAMENTO'
        )

        aguardando.forEach(pedido => {
            select.innerHTML += `
                <option value="${pedido.id}">
                    Pedido ${pedido.id} - R$ ${Number(pedido.valor_total).toFixed(2)}
                </option>
            `
        })

        if (aguardando.length === 0) {
            select.innerHTML = '<option value="">Nenhum pedido aguardando pagamento</option>'
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao carregar pedidos!')
    }
}

document.getElementById('form_finalizar').addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = select.value

    if (!confirm('Deseja finalizar este pedido?')) {
        return
    }

    try {
        const resposta = await fetch(`${baseUrl}/pedido/${id}/finalizar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        alert(dados.message)

        if (resposta.ok) {
            window.location.href = 'pedido_listar.html'
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao finalizar pedido!')
    }
})

carregarPedidos()
