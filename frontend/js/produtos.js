const listaProdutos = document.getElementById('listaProdutos')
const baseUrl = 'http://localhost:3000'

let produtosEncontrados = []


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


function mostrarProdutos() {

    listaProdutos.innerHTML = ''

    const carrinho = JSON.parse(
        localStorage.getItem('carrinho')
    ) || []


    produtosEncontrados.forEach(produto => {

        const card = document.createElement('div')

        card.classList.add('card-produto')


        const estoqueTotal = produto.estoque
            ? produto.estoque.quantidade
            : 0


        const produtoNoCarrinho = carrinho.find(
            item => item.id === produto.id
        )


        const quantidadeNoCarrinho = produtoNoCarrinho
            ? produtoNoCarrinho.quantidade
            : 0


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
                            Adicionar ao carrinho
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


function adicionarAoCarrinho(id) {

    const produto = produtosEncontrados.find(
        produto => produto.id === id
    )


    if (!produto) {

        alert('Produto não encontrado!')

        return
    }


    const estoqueTotal = produto.estoque
        ? produto.estoque.quantidade
        : 0


    if (estoqueTotal <= 0) {

        alert('Este produto está sem estoque!')

        return
    }


    let carrinho = JSON.parse(
        localStorage.getItem('carrinho')
    ) || []


    const produtoExistente = carrinho.find(
        item => item.id === produto.id
    )


    const quantidadeNoCarrinho = produtoExistente
        ? produtoExistente.quantidade
        : 0


    const estoqueDisponivel =
        estoqueTotal - quantidadeNoCarrinho


    if (estoqueDisponivel <= 0) {

        alert('Você já adicionou todo o estoque disponível ao carrinho!')

        return
    }


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


    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    )


    mostrarProdutos()


    alert(`${produto.nome} foi adicionado ao carrinho!`)
}


carregarProdutos()