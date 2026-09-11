const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')


if (!token) {

    alert('Você precisa fazer login para acessar o painel administrativo!')

    window.location.href = 'login.html'

}


const quantidadeProdutos = document.getElementById('quantidadeProdutos')
const quantidadePedidos = document.getElementById('quantidadePedidos')
const valorVendas = document.getElementById('valorVendas')
const listaProdutosAdmin = document.getElementById('listaProdutosAdmin')
const listaPedidosAdmin = document.getElementById('listaPedidosAdmin')


async function carregarProdutos() {

    try {

        const resposta = await fetch(`${baseUrl}/produtos`)

        const dados = await resposta.json()

        if (!resposta.ok) {

            listaProdutosAdmin.innerHTML =
                '<p>Não foi possível carregar os produtos.</p>'

            return
        }


        const produtos = dados.produtos || dados


        quantidadeProdutos.textContent = produtos.length


        if (produtos.length === 0) {

            listaProdutosAdmin.innerHTML =
                '<p>Nenhum produto cadastrado.</p>'

            return
        }


        listaProdutosAdmin.innerHTML = ''


        produtos.forEach(produto => {

            listaProdutosAdmin.innerHTML += `

                <div class="card-admin">

                    <h3>${produto.nome}</h3>

                    <p>
                        Artista: ${produto.artista}
                    </p>

                    <p>
                        Formato: ${produto.formato}
                    </p>

                    <p>
                        Preço: R$ ${Number(produto.preco).toFixed(2)}
                    </p>

                    <br>

                    <button onclick="editarProduto(${produto.id})">
                        Editar
                    </button>

                    <button onclick="excluirProduto(${produto.id})">
                        Excluir
                    </button>

                </div>

                <br>

            `

        })


    } catch (erro) {

        console.error('Erro ao carregar produtos:', erro)

        listaProdutosAdmin.innerHTML =
            '<p>Erro ao carregar produtos.</p>'
    }

}


async function carregarPedidos() {

    try {

        const resposta = await fetch(`${baseUrl}/pedidos`, {

            headers: {
                'Authorization': `Bearer ${token}`
            }

        })


        const dados = await resposta.json()


        if (!resposta.ok) {

            listaPedidosAdmin.innerHTML =
                '<p>Não foi possível carregar os pedidos.</p>'

            return
        }


        const pedidos = dados.pedidos || dados


        quantidadePedidos.textContent = pedidos.length


        let totalVendas = 0


        pedidos.forEach(pedido => {

            totalVendas += Number(pedido.valor_total)

        })


        valorVendas.textContent =
            `R$ ${totalVendas.toFixed(2)}`


        if (pedidos.length === 0) {

            listaPedidosAdmin.innerHTML =
                '<p>Nenhum pedido realizado.</p>'

            return
        }


        listaPedidosAdmin.innerHTML = ''


        pedidos.forEach(pedido => {

            const data = new Date(pedido.data_pedido)

            const dataFormatada =
                data.toLocaleDateString('pt-BR')


            listaPedidosAdmin.innerHTML += `

                <div class="card-admin">

                    <h3>Pedido #${pedido.id}</h3>

                    <p>
                        Data: ${dataFormatada}
                    </p>

                    <p>
                        Valor:
                        R$ ${Number(pedido.valor_total).toFixed(2)}
                    </p>

                    <p>
                        Status: ${pedido.status}
                    </p>

                </div>

                <br>

            `

        })


    } catch (erro) {

        console.error('Erro ao carregar pedidos:', erro)

        listaPedidosAdmin.innerHTML =
            '<p>Erro ao carregar pedidos.</p>'
    }

}


function editarProduto(id) {

    window.location.href = `produto-form.html?id=${id}`

}


async function excluirProduto(id) {

    const confirmar = confirm(
        'Tem certeza que deseja excluir este produto?'
    )


    if (!confirmar) {
        return
    }


    try {

        const resposta = await fetch(
            `${baseUrl}/produto/${id}`,
            {
                method: 'DELETE',

                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )


        const dados = await resposta.json()


        if (!resposta.ok) {

            alert(
                dados.message ||
                'Não foi possível excluir o produto.'
            )

            return
        }


        alert('Produto excluído com sucesso! 🎵')


        carregarProdutos()


    } catch (erro) {

        console.error('Erro ao excluir produto:', erro)

        alert('Não foi possível excluir o produto.')
    }

}

function novoProduto() {

    window.location.href = 'produto-form.html'

}


carregarProdutos()
carregarPedidos()