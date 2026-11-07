
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const form = document.getElementById('formItem')
const pedido_id = document.getElementById('pedido_id')
const produto_id = document.getElementById('produto_id')
const quantidade = document.getElementById('quantidade')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
} else {

    // Carrega os pedidos
    async function carregarPedidos() {

        try {

            const resposta = await fetch(`${baseUrl}/pedidos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            dados.forEach(pedido => {

                const opcao = document.createElement('option')

                opcao.value = pedido.id
                opcao.textContent = `Pedido ${pedido.id}`

                pedido_id.appendChild(opcao)

            })

        } catch (erro) {
            console.error(erro)
            mensagem.textContent = 'Erro ao carregar pedidos!'
        }

    }

    // Carrega os produtos
    async function carregarProdutos() {

        try {

            const resposta = await fetch(`${baseUrl}/produtos`)
            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            dados.forEach(produto => {

                const opcao = document.createElement('option')

                opcao.value = produto.id
                opcao.textContent = `${produto.nome} - ${produto.artista}`

                produto_id.appendChild(opcao)

            })

        } catch (erro) {
            console.error(erro)
            mensagem.textContent = 'Erro ao carregar produtos!'
        }

    }

    // Cadastra o item
    form.addEventListener('submit', async (e) => {

        e.preventDefault()

        const valores = {
            pedido_id: Number(pedido_id.value),
            produto_id: Number(produto_id.value),
            quantidade: Number(quantidade.value)
        }

        try {

            const resposta = await fetch(`${baseUrl}/itemPedido`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(valores)
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            alert(dados.message)

            form.reset()

        } catch (erro) {
            console.error(erro)
            mensagem.textContent = 'Erro ao cadastrar item!'
        }

    })

    carregarPedidos()
    carregarProdutos()

}
