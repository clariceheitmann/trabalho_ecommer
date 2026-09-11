const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')
const listaPedidos = document.getElementById('listaPedidos')


if (!token) {

    alert('Você precisa fazer login para ver seus pedidos!')

    window.location.href = 'login.html'

}


function pegarIdDoToken() {

    const partes = token.split('.')

    const payload = JSON.parse(atob(partes[1]))

    return payload.id
}


const usuarioId = pegarIdDoToken()


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

            alert(dados.message || 'Não foi possível carregar seus pedidos.')

            return

        }


        const pedidos = dados.pedidos || dados


        const meusPedidos = pedidos.filter(
            pedido => pedido.usuario_id === usuarioId
        )


        if (meusPedidos.length === 0) {

            listaPedidos.innerHTML = `
                <p>Você ainda não realizou nenhum pedido.</p>
                <br>
                <a href="produtos.html">Ver produtos</a>
            `

            return

        }


        listaPedidos.innerHTML = ''


        meusPedidos.forEach(pedido => {

            const data = new Date(pedido.data_pedido)

            const dataFormatada = data.toLocaleDateString('pt-BR')


            listaPedidos.innerHTML += `

                <div class="pedido">

                    <h2>Pedido #${pedido.id}</h2>

                    <p>
                        <strong>Data:</strong>
                        ${dataFormatada}
                    </p>

                    <p>
                        <strong>Valor total:</strong>
                        R$ ${Number(pedido.valor_total).toFixed(2)}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${pedido.status}
                    </p>

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


carregarPedidos()