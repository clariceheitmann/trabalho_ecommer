
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

async function listarPedidos() {
    const lista = document.getElementById('lista_pedidos')

    try {
        const resposta = await fetch(`${baseUrl}/pedidos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const pedidos = await resposta.json()

        if (!resposta.ok) {
            alert(pedidos.message)
            return
        }

        if (pedidos.length === 0) {
            lista.innerHTML = '<p>Nenhum pedido encontrado!</p>'
            return
        }

        lista.innerHTML = ''

        pedidos.forEach(pedido => {
            let produtos = ''

            pedido.itens.forEach(item => {
                const produto = item.produto

                produtos += `
                    <p>
                        ${produto ? produto.nome : 'Produto não encontrado'}
                        - Quantidade: ${item.quantidade}
                        - Subtotal: R$ ${Number(item.subtotal).toFixed(2)}
                    </p>
                `
            })

            lista.innerHTML += `
                <div class="card">
                    <h3>Pedido ${pedido.id}</h3>

                    <p>Data: ${new Date(pedido.data_pedido).toLocaleString('pt-BR')}</p>

                    <p>Valor total: R$ ${Number(pedido.valor_total).toFixed(2)}</p>

                    <p>Status: ${pedido.status}</p>

                    <h4>Produtos:</h4>
                    ${produtos || '<p>Nenhum produto adicionado.</p>'}
                </div>
            `
        })

    } catch (erro) {
        console.error(erro)
        alert('Erro ao listar pedidos!')
    }
}

listarPedidos()
