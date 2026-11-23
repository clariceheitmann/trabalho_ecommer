
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const produtoSelect = document.getElementById('produto_id')
const quantidadeInput = document.getElementById('quantidade')
const listaItens = document.getElementById('lista_itens')

let itens = []

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}


// CARREGAR PRODUTOS

async function carregarProdutos() {

    try {

        const resposta = await fetch(`${baseUrl}/produtos`)

        const produtos = await resposta.json()

        produtos.forEach(produto => {

            produtoSelect.innerHTML += `
                <option value="${produto.id}">
                    ${produto.nome} - ${produto.album}
                </option>
            `

        })

    } catch (erro) {
        console.error(erro)
        alert('Erro ao carregar produtos!')
    }

}


// ADICIONAR PRODUTO

document.getElementById('adicionar').addEventListener('click', () => {

    const produto_id = Number(produtoSelect.value)
    const quantidade = Number(quantidadeInput.value)

    if (!produto_id || quantidade <= 0) {
        alert('Selecione um produto e uma quantidade válida!')
        return
    }

    const existente = itens.find(item => item.produto_id === produto_id)

    if (existente) {
        existente.quantidade += quantidade
    } else {
        itens.push({
            produto_id,
            quantidade
        })
    }

    mostrarItens()

})


// MOSTRAR PRODUTOS

function mostrarItens() {

    listaItens.innerHTML = ''

    itens.forEach(item => {

        const produto = produtoSelect.options[
            produtoSelect.selectedIndex
        ]

        listaItens.innerHTML += `
            <p>
                Produto ID: ${item.produto_id}
                | Quantidade: ${item.quantidade}
            </p>
        `

    })

}


// CADASTRAR PEDIDO

document.getElementById('form_pedido').addEventListener('submit', async (e) => {

    e.preventDefault()

    if (itens.length === 0) {
        alert('Adicione pelo menos um produto!')
        return
    }

    try {

        const resposta = await fetch(`${baseUrl}/pedido`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({
                itens: itens
            })

        })

        const dados = await resposta.json()

        alert(dados.message)

        if (resposta.ok) {
            window.location.href = 'pedido_listar.html'
        }

    } catch (erro) {

        console.error(erro)
        alert('Erro ao cadastrar pedido!')

    }

})


carregarProdutos()
