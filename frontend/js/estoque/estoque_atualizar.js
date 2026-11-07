const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formEstoque')
const estoque = document.getElementById('estoque_id')
const quantidade = document.getElementById('quantidade')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

// Carrega os estoques existentes
async function carregarEstoque() {

    try {

        const resposta = await fetch(`${baseUrl}/estoques`, {
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
            opcao.textContent =
                `Estoque ${item.id} - Produto ${item.produto_id} (${item.quantidade} unidades)`

            estoque.appendChild(opcao)

        })

    } catch (erro) {

        console.error(erro)
        mensagem.textContent = 'Erro ao carregar estoques!'

    }

}

// Atualiza a quantidade
formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    const id = estoque.value
    const novaQuantidade = Number(quantidade.value)

    if (!id || novaQuantidade < 0 ||
        !Number.isInteger(novaQuantidade)) {

        mensagem.textContent = 'Preencha os campos corretamente!'
        return

    }

    try {

        const resposta = await fetch(`${baseUrl}/estoque/${id}`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({
                quantidade: novaQuantidade
            })

        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message
            return
        }

        alert('Estoque atualizado com sucesso!')

        formulario.reset()

        estoque.innerHTML =
            '<option value="">Selecione um estoque</option>'

        carregarEstoque()

    } catch (erro) {

        console.error(erro)
        mensagem.textContent = 'Erro ao atualizar estoque!'

    }

})

carregarEstoque()