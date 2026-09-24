const listaProdutos = document.getElementById('listaProdutos')

const baseUrl = 'http://localhost:3000'

let produtosEncontrados = []


// ======================================================
// CARREGAR PRODUTOS
// ======================================================

async function carregarProdutos() {

    try {

        const resposta =
            await fetch(`${baseUrl}/produtos`)


        if (!resposta.ok) {

            throw new Error(
                'Erro ao buscar produtos'
            )

        }


        produtosEncontrados =
            await resposta.json()


        mostrarProdutos()


    } catch (erro) {

        console.error(
            'Erro ao carregar produtos:',
            erro
        )


        listaProdutos.innerHTML = `
            <p class="erro">
                Não foi possível carregar os produtos.
            </p>
        `

    }
}


// ======================================================
// MOSTRAR PRODUTOS
// ======================================================

function mostrarProdutos() {

    listaProdutos.innerHTML = ''


    produtosEncontrados.forEach(produto => {


        const card =
            document.createElement('div')


        card.classList.add(
            'card-produto'
        )


        // ==============================================
        // CAPA
        // ==============================================

        let imagemHTML


        if (produto.imagem) {

            imagemHTML = `
                <img
                    src="${produto.imagem}"
                    alt="Capa de ${produto.album}"
                    loading="lazy"
                    onerror="mostrarCapaIndisponivel(this)"
                >
            `

        } else {

            imagemHTML = `
                <div class="capa-indisponivel">
                    🎵
                    <span>
                        Capa indisponível
                    </span>
                </div>
            `

        }


        // ==============================================
        // CATEGORIA
        // ==============================================

        const categoria =
            produto.categoria
                ? produto.categoria.nome
                : 'Categoria não informada'


        // ==============================================
        // CARD
        // ==============================================

        card.innerHTML = `

            <div class="imagem-produto">

                ${imagemHTML}

            </div>


            <div class="info-produto">

                <h3>
                    ${produto.album}
                </h3>


                <p class="artista">
                    ${produto.artista}
                </p>


                <p>
                    Gênero: ${categoria}
                </p>


                <p>
                    Formato: ${produto.formato}
                </p>


                <p>
                    Ano: ${produto.ano}
                </p>


                <p class="preco">
                    R$ ${Number(produto.preco).toFixed(2)}
                </p>

            </div>

        `


        // ==============================================
        // CLICAR NO CARD
        // ==============================================

        card.addEventListener(
            'click',
            () => abrirDetalhes(produto)
        )


        listaProdutos.appendChild(card)

    })

}


// ======================================================
// QUANDO A CAPA NÃO CARREGA
// ======================================================

function mostrarCapaIndisponivel(imagem) {

    const container =
        imagem.parentElement


    container.innerHTML = `
        <div class="capa-indisponivel">
            🎵
            <span>
                Capa indisponível
            </span>
        </div>
    `

}


// ======================================================
// DETALHES DO PRODUTO
// ======================================================

function abrirDetalhes(produto) {

    console.log(
        'Produto selecionado:',
        produto
    )

}


// ======================================================
// CARRINHO
// ======================================================

function adicionarAoCarrinho(id) {

    const produto =
        produtosEncontrados.find(
            produto => produto.id === id
        )


    if (!produto) {

        alert(
            'Produto não encontrado!'
        )

        return
    }


    const estoqueTotal =
        produto.estoque
            ? produto.estoque.quantidade
            : 0


    if (estoqueTotal <= 0) {

        alert(
            'Este produto está sem estoque!'
        )

        return
    }


    let carrinho =
        JSON.parse(
            localStorage.getItem('carrinho')
        ) || []


    const produtoExistente =
        carrinho.find(
            item => item.id === produto.id
        )


    const quantidadeNoCarrinho =
        produtoExistente
            ? produtoExistente.quantidade
            : 0


    const estoqueDisponivel =
        estoqueTotal -
        quantidadeNoCarrinho


    if (estoqueDisponivel <= 0) {

        alert(
            'Você já adicionou todo o estoque disponível ao carrinho!'
        )

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

            preco: Number(
                produto.preco
            ),

            quantidade: 1

        })

    }


    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    )


    alert(
        `${produto.nome} foi adicionado ao carrinho!`
    )

}


// ======================================================
// INICIAR
// ======================================================

carregarProdutos()