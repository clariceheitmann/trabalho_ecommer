const listaProdutos = document.getElementById('listaProdutos')

const baseUrl = 'http://localhost:3000'

let produtosEncontrados = []


// =====================================================
// CARREGAR PRODUTOS
// =====================================================

async function carregarProdutos() {

    try {

        const resposta = await fetch(`${baseUrl}/produtos`)

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos')
        }

        produtosEncontrados = await resposta.json()

        mostrarProdutos()

    } catch (erro) {

        console.error('Erro ao carregar produtos:', erro)

        listaProdutos.innerHTML = `
            <p class="erro">
                Não foi possível carregar os produtos.
            </p>
        `
    }
}


// =====================================================
// MOSTRAR PRODUTOS
// =====================================================

function mostrarProdutos() {

    listaProdutos.innerHTML = ''

    // Recupera o carrinho atual
    const carrinho = JSON.parse(
        localStorage.getItem('carrinho')
    ) || []


    produtosEncontrados.forEach(produto => {

        const card = document.createElement('div')

        card.classList.add('card-produto')


        // Estoque cadastrado no banco
        const estoqueTotal = produto.estoque
            ? produto.estoque.quantidade
            : 0


        // Procura o produto no carrinho
        const produtoNoCarrinho = carrinho.find(
            item => item.id === produto.id
        )


        // Quantidade desse produto que já está no carrinho
        const quantidadeNoCarrinho = produtoNoCarrinho
            ? produtoNoCarrinho.quantidade
            : 0


        // Estoque que ainda pode ser adicionado
        const estoqueDisponivel =
            estoqueTotal - quantidadeNoCarrinho


        card.innerHTML = `
            
            <div class="imagem-produto">
                <span>🎵</span>
            </div>

            <div class="info-produto">

                <h3>${produto.nome}</h3>

                <p class="artista">
                    ${produto.artista}
                </p>

                <p>
                    ${produto.album}
                </p>

                <p>
                    Formato: ${produto.formato}
                </p>

                <p class="preco">
                    R$ ${Number(produto.preco).toFixed(2)}
                </p>

                <p class="estoque">
                    Estoque disponível: 
                    <strong>${estoqueDisponivel}</strong>
                </p>


                ${
                    estoqueDisponivel > 0

                    ? `
                        <button onclick="adicionarAoCarrinho(${produto.id})">
                            🛒 Adicionar ao carrinho
                        </button>
                    `

                    : `
                        <button disabled>
                            Sem estoque
                        </button>
                    `
                }

            </div>

        `


        listaProdutos.appendChild(card)

    })
}


// =====================================================
// ADICIONAR AO CARRINHO
// =====================================================

function adicionarAoCarrinho(id) {

    const produto = produtosEncontrados.find(
        produto => produto.id === id
    )


    if (!produto) {

        alert('Produto não encontrado!')

        return
    }


    // Estoque total do produto
    const estoqueTotal = produto.estoque
        ? produto.estoque.quantidade
        : 0


    // Se não possui estoque
    if (estoqueTotal <= 0) {

        alert('Este produto está sem estoque!')

        return
    }


    // Recupera o carrinho
    let carrinho = JSON.parse(
        localStorage.getItem('carrinho')
    ) || []


    // Procura o produto no carrinho
    const produtoExistente = carrinho.find(
        item => item.id === produto.id
    )


    // Quantidade que já está no carrinho
    const quantidadeNoCarrinho = produtoExistente
        ? produtoExistente.quantidade
        : 0


    // Calcula quanto ainda pode ser adicionado
    const estoqueDisponivel =
        estoqueTotal - quantidadeNoCarrinho


    // Impede ultrapassar o estoque
    if (estoqueDisponivel <= 0) {

        alert('Você já adicionou todo o estoque disponível ao carrinho!')

        return
    }


    // Se o produto já está no carrinho
    if (produtoExistente) {

        produtoExistente.quantidade++

    } else {

        carrinho.push({

            id: produto.id,

            nome: produto.nome,

            artista: produto.artista,

            album: produto.album,

            formato: produto.formato,

            preco: Number(produto.preco),

            quantidade: 1

        })
    }


    // Salva o carrinho
    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    )


    // Atualiza os cards
    mostrarProdutos()


    alert(`${produto.nome} foi adicionado ao carrinho!`)
}


// =====================================================
// INICIAR
// =====================================================

carregarProdutos()