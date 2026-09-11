const baseUrl = 'http://localhost:3000'

const token = localStorage.getItem('token')

const formulario = document.getElementById('formProduto')

const categoriaSelect = document.getElementById('categoria_id')

const tituloPagina = document.getElementById('tituloPagina')


if (!token) {

    alert('Você precisa fazer login para acessar esta página!')

    window.location.href = 'login.html'

}


// Verifica se estamos editando um produto
const parametros = new URLSearchParams(window.location.search)

const produtoId = parametros.get('id')


if (produtoId) {

    tituloPagina.textContent = 'Editar produto'

}

// CARREGAR CATEGORIAS
async function carregarCategorias() {

    try {

        const resposta = await fetch(`${baseUrl}/categorias`)

        const categorias = await resposta.json()

        if (!resposta.ok) {

            alert(
                categorias.message ||
                'Não foi possível carregar as categorias.'
            )

            return
        }


        categorias.forEach(categoria => {

            categoriaSelect.innerHTML += `
                <option value="${categoria.id}">
                    ${categoria.nome}
                </option>
            `

        })


    } catch (erro) {

        console.error(
            'Erro ao carregar categorias:',
            erro
        )

        alert('Não foi possível carregar as categorias.')

    }

}


// CARREGAR PRODUTO PARA EDIÇÃO
async function carregarProduto() {

    try {

        const resposta = await fetch(
            `${baseUrl}/produto/${produtoId}`,
            {
                method: 'GET',

                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )


        const dados = await resposta.json()


        if (!resposta.ok) {

            alert(
                dados.message ||
                'Não foi possível carregar o produto.'
            )

            return
        }


        const produto = dados.produto || dados


        document.getElementById('nome').value =
            produto.nome || ''

        document.getElementById('artista').value =
            produto.artista || ''

        document.getElementById('album').value =
            produto.album || ''

        document.getElementById('formato').value =
            produto.formato || ''

        document.getElementById('ano').value =
            produto.ano || ''

        document.getElementById('preco').value =
            produto.preco || ''

        document.getElementById('imagem').value =
            produto.imagem || ''

        document.getElementById('categoria_id').value =
            produto.categoria_id || ''


    } catch (erro) {

        console.error(
            'Erro ao carregar produto:',
            erro
        )

        alert(
            'Não foi possível carregar o produto.'
        )

    }

}


// SALVAR PRODUTO
formulario.addEventListener('submit', async (event) => {

    event.preventDefault()


    const dadosProduto = {

        nome: document.getElementById('nome').value,

        artista: document.getElementById('artista').value,

        album: document.getElementById('album').value,

        formato: document.getElementById('formato').value,

        ano: Number(
            document.getElementById('ano').value
        ),

        preco: Number(
            document.getElementById('preco').value
        ),

        imagem: document.getElementById('imagem').value,

        categoria_id: Number(
            document.getElementById('categoria_id').value
        )

    }


    try {

        let resposta


        // EDITAR
        if (produtoId) {

            resposta = await fetch(
                `${baseUrl}/produto/${produtoId}`,
                {

                    method: 'PUT',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(dadosProduto)

                }
            )

        }


        // CADASTRAR
        else {

            resposta = await fetch(
                `${baseUrl}/produto`,
                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(dadosProduto)

                }
            )

        }


        const dados = await resposta.json()


        if (!resposta.ok) {

            alert(
                dados.message ||
                'Não foi possível salvar o produto.'
            )

            return
        }


        alert(
            produtoId
                ? 'Produto atualizado com sucesso! 🎵'
                : 'Produto cadastrado com sucesso! 🎵'
        )


        window.location.href = 'admin.html'


    } catch (erro) {

        console.error(
            'Erro ao salvar produto:',
            erro
        )

        alert(
            'Não foi possível salvar o produto.'
        )

    }

})

carregarCategorias()

if (produtoId) {

    carregarProduto()

}