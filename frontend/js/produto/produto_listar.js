
const baseUrl = 'http://localhost:3000'

async function listarProdutos() {
    const lista = document.getElementById('lista_produtos')

    try {
        const resposta = await fetch(`${baseUrl}/produtos`)
        const produtos = await resposta.json()

        if (!resposta.ok) {
            alert(produtos.message)
            return
        }

        if (produtos.length === 0) {
            lista.innerHTML = '<p>Nenhum produto encontrado!</p>'
            return
        }

        lista.innerHTML = ''

        produtos.forEach(produto => {
            const imagem = produto.imagem
                ? (produto.imagem.startsWith('http')
                    ? produto.imagem
                    : `${baseUrl}${produto.imagem.startsWith('/') ? '' : '/'}${produto.imagem}`)
                : ''

            lista.innerHTML += `
                <div class="card">

                    ${imagem ? `<img src="${imagem}" alt="${produto.album}" width="150">` : ''}

                    <h3>${produto.nome}</h3>

                    <p>Artista: ${produto.artista}</p>
                    <p>Álbum: ${produto.album}</p>
                    <p>Formato: ${produto.formato}</p>
                    <p>Ano: ${produto.ano}</p>
                    <p>Preço: R$ ${Number(produto.preco).toFixed(2)}</p>

                    <p>Categoria: ${produto.categoria?.nome || produto.categoria_id}</p>

                    <p>Estoque: ${
                        produto.estoque
                            ? produto.estoque.quantidade
                            : 'Não cadastrado'
                    }</p>

                    <p>${produto.descricao || ''}</p>

                </div>
            `
        })

    } catch (erro) {
        console.error(erro)
        alert('Erro ao listar produtos!')
    }
}

listarProdutos()
