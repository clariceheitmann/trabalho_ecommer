
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const item_id = document.getElementById('item_id')
const btnExcluir = document.getElementById('btnExcluir')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
} else {

    // Carrega os itens
    async function carregarItens() {

        try {

            const resposta = await fetch(`${baseUrl}/itemPedidos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            dados.forEach(item => {

                const opcao = document.createElement('option')

                opcao.value = item.id
                opcao.textContent = `Item ${item.id} - Pedido ${item.pedido_id} - Produto ${item.produto_id}`

                item_id.appendChild(opcao)

            })

        } catch (erro) {

            console.error(erro)
            mensagem.textContent = 'Erro ao carregar itens!'

        }

    }

    // Exclui o item selecionado
    async function excluirItem() {

        const id = item_id.value

        if (!id) {
            mensagem.textContent = 'Selecione um item!'
            return
        }

        if (!confirm('Deseja realmente excluir este item?')) {
            return
        }

        try {

            const resposta = await fetch(`${baseUrl}/itemPedido/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            alert(dados.message)

            item_id.innerHTML = '<option value="">Selecione um item</option>'

            carregarItens()

        } catch (erro) {

            console.error(erro)
            mensagem.textContent = 'Erro ao excluir item!'

        }

    }

    btnExcluir.addEventListener('click', excluirItem)

    carregarItens()

}
