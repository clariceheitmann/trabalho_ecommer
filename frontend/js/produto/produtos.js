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


        produtosEncontrados = await resposta.json()

        localStorage.setItem('produtos', JSON.stringify(produtosEncontrados))

        preencherGeneros()
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

    const listaGeneros = document.getElementById('listaGeneros')

    const grupos = new Map()

    // Separa os produtos por gênero
    produtosEncontrados.forEach(produto => {

        const genero = produto.categoria
            ? produto.categoria.nome
            : 'Outros'

        if (!grupos.has(genero)) {
            grupos.set(genero, [])
        }

        grupos.get(genero).push(produto)

    })

    // Cria os atalhos dos gêneros
    listaGeneros.innerHTML = ''

    let numero = 0

    grupos.forEach((produtos, genero) => {

        numero++

        const id = genero
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')

        const atalho = document.createElement('a')

        atalho.href = `#genero-${id}`
        atalho.textContent = genero

        listaGeneros.appendChild(atalho)

    })

    // Mostra uma mensagem se não houver produtos
    if (grupos.size === 0) {

        listaProdutos.innerHTML = `
            <p class="sem-produtos">
                Nenhum produto encontrado. Tente outra busca!
            </p>
        `

        return
    }

    // Cria uma seção para cada gênero
    grupos.forEach((produtos, genero) => {

        const id = genero
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')

        const secao = document.createElement('section')
        secao.classList.add('secao-genero')
        secao.id = `genero-${id}`

        const titulo = document.createElement('div')
        titulo.classList.add('titulo-genero')

        titulo.innerHTML = `
            <div>
                <span>✿ NOSSA SELEÇÃO</span>
                <h2>${genero}</h2>
            </div>

            <p>${produtos.length} álbum(ns)</p>
        `

        const grade = document.createElement('div')
        grade.classList.add('grade-genero')

        produtos.forEach(produto => {

            const card = document.createElement('div')
            card.classList.add('card-produto')

            let imagemHTML

            if (produto.imagem) {

                let caminhoImagem = produto.imagem

                if (
                    caminhoImagem.startsWith('../imagens/') ||
                    caminhoImagem.startsWith('./imagens/')
                ) {

                    caminhoImagem = caminhoImagem.replace(
                        /^(\.\.\/|\.\/)/,
                        ''
                    )

                    caminhoImagem = `${baseUrl}/${caminhoImagem}`

                }

                imagemHTML = `
                    <img
                        src="${caminhoImagem}"
                        alt="Capa de ${produto.album}"
                        loading="lazy"
                        onerror="mostrarCapaIndisponivel(this)"
                    >
                `

            } else {

                imagemHTML = `
                    <div class="capa-indisponivel">
                        🎵
                        <span>Capa indisponível</span>
                    </div>
                `

            }

            card.innerHTML = `
                <div class="imagem-produto">
                    ${imagemHTML}
                </div>

                <div class="info-produto">

                    <span class="etiqueta-formato">
                        ${produto.formato || 'Formato não informado'}
                    </span>

                    <h3>${produto.album}</h3>

                    <p class="artista">${produto.artista}</p>

                    <p class="ano">Lançamento: ${produto.ano || 'Não informado'}</p>

                    <p class="preco">
                        R$ ${Number(produto.preco).toFixed(2)}
                    </p>

                    <span class="ver-detalhes">
                        Ver detalhes →
                    </span>

                </div>
            `

            card.addEventListener('click', () => {
                abrirDetalhes(produto)
            })

            grade.appendChild(card)

        })

        secao.appendChild(titulo)
        secao.appendChild(grade)

        listaProdutos.appendChild(secao)

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
// ABRIR DETALHES DO PRODUTO
// ======================================================

function abrirDetalhes(produto) {

    const modal = document.getElementById('modalProduto')
    const detalhes = document.getElementById('detalhesProduto')

    // Verifica a categoria do produto
    const categoria = produto.categoria
        ? produto.categoria.nome
        : 'Categoria não informada'

    // Verifica o estoque disponível
    const estoque = produto.estoque
        ? produto.estoque.quantidade
        : 0

    // Prepara a imagem do produto
    let imagemHTML

    if (produto.imagem) {

        let caminhoImagem = produto.imagem

        if (
            caminhoImagem.startsWith('../imagens/') ||
            caminhoImagem.startsWith('./imagens/')
        ) {
            caminhoImagem = caminhoImagem.replace(
                /^(\.\.\/|\.\/)/,
                ''
            )

            caminhoImagem = `${baseUrl}/${caminhoImagem}`
        }

        imagemHTML = `
            <img
                src="${caminhoImagem}"
                alt="Capa de ${produto.album}"
                class="imagem-detalhes"
                onerror="mostrarCapaIndisponivel(this)"
            >
        `

    } else {

        imagemHTML = `
            <div class="capa-indisponivel">
                🎵
                <span>Capa indisponível</span>
            </div>
        `
    }

    // Monta as informações completas do álbum
    detalhes.innerHTML = `
        <div class="detalhes-conteudo">

            <div class="detalhes-imagem">
                ${imagemHTML}
            </div>

            <div class="detalhes-informacoes">

                <h2>${produto.album}</h2>

                <p class="artista">
                    <strong>Artista:</strong> ${produto.artista}
                </p>

                <p>
                    <strong>Gênero:</strong> ${categoria}
                </p>

                <p>
                    <strong>Formato:</strong> ${produto.formato}
                </p>

                <p>
                    <strong>Ano:</strong> ${produto.ano}
                </p>

                <p class="preco">
                    R$ ${Number(produto.preco).toFixed(2)}
                </p>

                <p>
                    <strong>Descrição:</strong>
                    ${produto.descricao || 'Descrição não disponível.'}
                </p>

                <p>
                    <strong>Estoque disponível:</strong>
                    ${estoque}
                </p>

                <button
                    id="btnAdicionarCarrinho"
                    ${estoque <= 0 ? 'disabled' : ''}
                >
                    ${estoque <= 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}
                </button>

            </div>

        </div>
    `

    // Abre o modal
    modal.style.display = 'flex'

    // Permite adicionar o produto ao carrinho sem fechar o modal
    const botaoCarrinho = document.getElementById(
        'btnAdicionarCarrinho'
    )

    botaoCarrinho.addEventListener('click', (evento) => {
        evento.stopPropagation()
        adicionarAoCarrinho(produto.id)
    })
}


// ======================================================
// FECHAR DETALHES DO PRODUTO
// ======================================================

function fecharModal() {

    const modal = document.getElementById('modalProduto')

    modal.style.display = 'none'
}

// Fecha o modal ao clicar fora do conteúdo
document.getElementById('modalProduto').addEventListener(
    'click',
    function(evento) {

        if (evento.target === this) {
            fecharModal()
        }

    }
)

// Fecha o modal ao pressionar Esc
document.addEventListener('keydown', function(evento) {

    if (evento.key === 'Escape') {
        fecharModal()
    }

})


// ======================================================
// CARRINHO
// ======================================================


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

    // Prepara o caminho da imagem
    let caminhoImagem = produto.imagem

    if (
        caminhoImagem &&
        (
            caminhoImagem.startsWith('../imagens/') ||
            caminhoImagem.startsWith('./imagens/')
        )
    ) {
        caminhoImagem = caminhoImagem.replace(
            /^(\.\.\/|\.\/)/,
            ''
        )

        caminhoImagem = `${baseUrl}/${caminhoImagem}`
    }

    if (produtoExistente) {

        produtoExistente.quantidade++
        produtoExistente.imagem = caminhoImagem

    } else {

        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            artista: produto.artista,
            album: produto.album,
            formato: produto.formato,
            preco: Number(produto.preco),
            imagem: caminhoImagem,
            quantidade: 1
        })

    }

    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    )

    alert(`${produto.nome} foi adicionado ao carrinho!`)
}



function preencherGeneros() {
    const filtroGenero = document.getElementById('filtroGenero')

    if (!filtroGenero) return

    const generos = [...new Set(
        produtosEncontrados
            .map(produto => produto.categoria?.nome)
            .filter(Boolean)
    )].sort()

    filtroGenero.innerHTML = '<option value="">Todos os gêneros</option>'

    generos.forEach(genero => {
        const opcao = document.createElement('option')
        opcao.value = genero
        opcao.textContent = genero
        filtroGenero.appendChild(opcao)
    })
}



/* BUSCA DE PRODUTOS */

function buscarProdutos() {
    const termo = document
        .getElementById('campoBusca')
        .value.trim()
        .toLowerCase()

    const formato = document
        .getElementById('filtroFormato')
        .value.toLowerCase()

    const genero = document
        .getElementById('filtroGenero')
        .value.toLowerCase()

    const resultado = produtosEncontrados.filter(produto => {
        const album = (produto.album || '').toLowerCase()
        const artista = (produto.artista || '').toLowerCase()
        const formatoProduto = (produto.formato || '').toLowerCase()
        const generoProduto =
            (produto.categoria?.nome || '').toLowerCase()

        const correspondeBusca =
            album.includes(termo) || artista.includes(termo)

        const correspondeFormato =
            !formato || formatoProduto === formato

        const correspondeGenero =
            !genero || generoProduto === genero

        return correspondeBusca &&
            correspondeFormato &&
            correspondeGenero
    })

    mostrarListaFiltrada(resultado)
}


function mostrarListaFiltrada(lista) {
    // Guarda a lista original para não perder os produtos
    const listaOriginal = produtosEncontrados

    produtosEncontrados = lista
    mostrarProdutos()
    produtosEncontrados = listaOriginal
}

document.getElementById('btnBuscar').addEventListener('click', buscarProdutos)
document.getElementById('campoBusca').addEventListener('input', buscarProdutos)

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('campoBusca').value = ''
    document.getElementById('filtroFormato').value = ''
    document.getElementById('filtroGenero').value = ''

    mostrarProdutos()
})







// ======================================================
// INICIAR
// ======================================================



carregarProdutos()