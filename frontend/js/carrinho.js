// =====================================================
// CARRINHO DE COMPRAS
// =====================================================

// Recupera o carrinho salvo no LocalStorage
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []


// =====================================================
// SALVAR CARRINHO
// =====================================================

function salvarCarrinho() {

    localStorage.setItem('carrinho', JSON.stringify(carrinho))

}


// =====================================================
// ADICIONAR PRODUTO
// =====================================================

function adicionarCarrinho(produto) {

    const produtoExistente = carrinho.find(
        item => item.id === produto.id
    )

    if (produtoExistente) {

        produtoExistente.quantidade++

    } else {

        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        })

    }

    salvarCarrinho()

    alert(`${produto.nome} foi adicionado ao carrinho!`)

}


// =====================================================
// REMOVER PRODUTO
// =====================================================

function removerDoCarrinho(id) {

    carrinho = carrinho.filter(
        item => item.id !== id
    )

    salvarCarrinho()

    exibirCarrinho()

}


// =====================================================
// AUMENTAR QUANTIDADE
// =====================================================

function aumentarQuantidade(id) {

    const produto = carrinho.find(
        item => item.id === id
    )

    if (produto) {

        produto.quantidade++

        salvarCarrinho()

        exibirCarrinho()

    }

}


// =====================================================
// DIMINUIR QUANTIDADE
// =====================================================

function diminuirQuantidade(id) {

    const produto = carrinho.find(
        item => item.id === id
    )

    if (!produto) return

    if (produto.quantidade > 1) {

        produto.quantidade--

    } else {

        removerDoCarrinho(id)

        return

    }

    salvarCarrinho()

    exibirCarrinho()

}


// =====================================================
// CALCULAR SUBTOTAL
// =====================================================

function calcularSubtotal(produto) {

    return produto.preco * produto.quantidade

}


// =====================================================
// CALCULAR TOTAL
// =====================================================

function calcularTotal() {

    return carrinho.reduce(
        (total, produto) => {
            return total + calcularSubtotal(produto)
        },
        0
    )

}


// =====================================================
// EXIBIR CARRINHO
// =====================================================

function exibirCarrinho() {

    const container = document.getElementById('carrinho')

    if (!container) return

    container.innerHTML = ''

    if (carrinho.length === 0) {

        container.innerHTML = `
            <p>Seu carrinho está vazio.</p>
        `

        return

    }

    carrinho.forEach(produto => {

        const subtotal = calcularSubtotal(produto)

        container.innerHTML += `

            <div class="item-carrinho">

                <img 
                    src="${produto.imagem}" 
                    alt="${produto.nome}"
                >

                <div>

                    <h3>${produto.nome}</h3>

                    <p>
                        R$ ${produto.preco.toFixed(2)}
                    </p>

                    <div>

                        <button onclick="diminuirQuantidade(${produto.id})">
                            -
                        </button>

                        <span>
                            ${produto.quantidade}
                        </span>

                        <button onclick="aumentarQuantidade(${produto.id})">
                            +
                        </button>

                    </div>

                    <p>
                        Subtotal:
                        R$ ${subtotal.toFixed(2)}
                    </p>

                    <button onclick="removerDoCarrinho(${produto.id})">
                        Remover
                    </button>

                </div>

            </div>

        `

    })

    const total = calcularTotal()

    container.innerHTML += `

        <div class="total-carrinho">

            <h2>
                Total:
                R$ ${total.toFixed(2)}
            </h2>

            <button onclick="finalizarCompra()">
                Finalizar compra
            </button>

        </div>

    `

}


// =====================================================
// FINALIZAR COMPRA
// =====================================================

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert('Seu carrinho está vazio!')

        return

    }

    alert('Vamos para o checkout!')

}

// =====================================================
// CARREGAR CARRINHO AO ABRIR A PÁGINA
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

    exibirCarrinho()

})






const produtoTeste = {
    id: 1,
    nome: 'Abbey Road',
    preco: 120,
    imagem: '../img/abbey-road.jpg'
}

if (carrinho.length === 0) {

    adicionarCarrinho(produtoTeste)

}