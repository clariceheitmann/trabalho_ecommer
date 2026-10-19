
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')
const listaPedidos = document.getElementById('listaPedidos')

// Verifica se o usuário está logado
if (!token) {
    alert('Você precisa fazer login para ver seus pedidos!')
    window.location.href = 'login.html'
} else {
    carregarPedidos()
}

async function carregarPedidos() {
    try {
        const resposta = await fetch(`${baseUrl}/pedidos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            listaPedidos.innerHTML = `
                <p>${dados.message || 'Não foi possível carregar seus pedidos.'}</p>
            `
            return
        }

        // A rota retorna diretamente a lista de pedidos
        const pedidos = Array.isArray(dados) ? dados : dados.pedidos

        if (!pedidos || pedidos.length === 0) {
            listaPedidos.innerHTML = `
                <p>Você ainda não realizou nenhum pedido.</p>
                <br>
                <a href="produtos.html">Ver produtos</a>
            `
            return
        }

        listaPedidos.innerHTML = ''

        pedidos.forEach(pedido => {
            const data = new Date(pedido.data_pedido)
            const dataFormatada = data.toLocaleDateString('pt-BR')

            // Itens associados ao pedido
            let htmlItens = ''

            if (pedido.itens && pedido.itens.length > 0) {
                htmlItens = pedido.itens.map(item => {
                    const produto = item.produto

                    return `
                        <div class="item-pedido">
                            <p><strong>Álbum:</strong> ${produto ? produto.album : 'Produto não encontrado'}</p>
                            <p><strong>Artista:</strong> ${produto ? produto.artista : '-'}</p>
                            <p><strong>Formato:</strong> ${produto ? produto.formato : '-'}</p>
                            <p><strong>Quantidade:</strong> ${item.quantidade}</p>
                            <p><strong>Preço unitário:</strong> R$ ${Number(item.preco_unitario).toFixed(2)}</p>
                            <p><strong>Subtotal:</strong> R$ ${Number(item.subtotal).toFixed(2)}</p>
                        </div>
                    `
                }).join('')
            } else {
                htmlItens = '<p>Nenhum item encontrado neste pedido.</p>'
            }

            listaPedidos.innerHTML += `
                <div class="pedido">
                    <h2>Pedido #${pedido.id}</h2>

                    <p><strong>Data:</strong> ${dataFormatada}</p>

                    <p><strong>Valor total:</strong>
                        R$ ${Number(pedido.valor_total).toFixed(2)}
                    </p>

                    <p><strong>Status:</strong> ${pedido.status}</p>

                    <h3>Itens comprados</h3>
                    ${htmlItens}
                </div>
                <br>
            `
        })

    } catch (erro) {
        console.error('Erro ao carregar pedidos:', erro)

        listaPedidos.innerHTML = `
            <p>Não foi possível carregar seus pedidos.</p>
        `
    }
}
