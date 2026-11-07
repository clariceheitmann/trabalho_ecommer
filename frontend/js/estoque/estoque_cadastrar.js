const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formEstoque')
const produto = document.getElementById('produto_id')
const quantidade = document.getElementById('quantidade')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

// Carrega os produtos disponíveis
async function carregarProdutos() {

    try {

        const resposta = await fetch(`${baseUrl}/produtos`)
        const produtos = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = 'Erro ao carregar produtos!'
            return
        }

        produtos.forEach(item => {

            if (!item.estoque) {

                const opcao = document.createElement('option')
                opcao.value = item.id
                opcao.textContent = `${item.nome} - ${item.artista}`

                produto.appendChild(opcao)

            }

        })

    } catch (erro) {

        console.error(erro)
        mensagem.textContent = 'Não foi possível carregar os produtos!'

    }
}

// Cadastra o estoque
formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    const dados = {
        produto_id: Number(produto.value),
        quantidade: Number(quantidade.value)
    }

    if (!dados.produto_id || dados.quantidade < 0 ||
        !Number.isInteger(dados.quantidade)) {

        mensagem.textContent = 'Preencha os campos corretamente!'
        return

    }

    try {

        const resposta = await fetch(`${baseUrl}/estoque`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify(dados)

        })

        const resultado = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = resultado.message
            return
        }

        alert('Estoque cadastrado com sucesso!')

        formulario.reset()
        produto.innerHTML = '<option value="">Selecione um produto</option>'

        carregarProdutos()

    } catch (erro) {

        console.error(erro)
        mensagem.textContent = 'Erro ao realizar cadastro!'

    }

})

carregarProdutos()