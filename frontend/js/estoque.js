const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')
const listaEstoque = document.getElementById('listaEstoque')


if (!token) {

    alert('Você precisa fazer login para acessar o estoque!')

    window.location.href = 'login.html'

}


async function carregarEstoque() {

    try {

        const resposta = await fetch(`${baseUrl}/produtos`)

        const produtos = await resposta.json()


        if (!resposta.ok) {

            alert(produtos.message || 'Não foi possível carregar o estoque.')

            return

        }


        listaEstoque.innerHTML = ''


        if (produtos.length === 0) {

            listaEstoque.innerHTML = '<p>Nenhum produto cadastrado.</p>'

            return

        }


        produtos.forEach(produto => {

            const estoque = produto.estoque

            const quantidade = estoque ? estoque.quantidade : 0

            const estoqueId = estoque ? estoque.id : null


            listaEstoque.innerHTML += `

                <div class="card-admin">

                    <h2>${produto.nome}</h2>

                    <p>Artista: ${produto.artista}</p>

                    <p>Formato: ${produto.formato}</p>

                    <p>
                        Estoque atual:
                        <strong>${quantidade}</strong>
                    </p>

                    <br>

                    ${estoque
                    ?
                    `
                            <button onclick="alterarEstoque(${estoqueId}, ${quantidade})">
                                Atualizar estoque
                            </button>
                        `
                    :
                    `
                            <button onclick="cadastrarEstoque(${produto.id})">
                                Cadastrar estoque
                            </button>
                        `
                }

                </div>

                <br>

            `

        })


    } catch (erro) {

        console.error('Erro ao carregar estoque:', erro)

        listaEstoque.innerHTML =
            '<p>Erro ao carregar estoque.</p>'

    }

}


async function cadastrarEstoque(produtoId) {

    const novaQuantidade = prompt(
        'Digite a quantidade inicial em estoque:'
    )


    if (novaQuantidade === null) {
        return
    }


    const quantidade = Number(novaQuantidade)


    if (!Number.isInteger(quantidade) || quantidade < 0) {

        alert(
            'Digite uma quantidade inteira maior ou igual a zero!'
        )

        return

    }


    try {

        const resposta = await fetch(`${baseUrl}/estoque`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({
                produto_id: produtoId,
                quantidade: quantidade
            })

        })


        const dados = await resposta.json()


        if (!resposta.ok) {

            alert(
                dados.message ||
                'Não foi possível cadastrar o estoque.'
            )

            return

        }


        alert('Estoque cadastrado com sucesso!')

        carregarEstoque()


    } catch (erro) {

        console.error('Erro ao cadastrar estoque:', erro)

        alert('Não foi possível cadastrar o estoque.')

    }

}


async function alterarEstoque(estoqueId, quantidadeAtual) {

    const novaQuantidade = prompt(

        `Quantidade atual: ${quantidadeAtual}\n\n` +
        `Digite a nova quantidade:`,

        quantidadeAtual

    )


    if (novaQuantidade === null) {
        return
    }


    const quantidade = Number(novaQuantidade)


    if (!Number.isInteger(quantidade) || quantidade < 0) {

        alert(
            'Digite uma quantidade inteira maior ou igual a zero!'
        )

        return

    }


    try {

        const resposta = await fetch(
            `${baseUrl}/estoque/${estoqueId}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({
                    quantidade: quantidade
                })

            }
        )


        const dados = await resposta.json()


        if (!resposta.ok) {

            alert(
                dados.message ||
                'Não foi possível atualizar o estoque.'
            )

            return

        }


        alert('Estoque atualizado com sucesso!')

        carregarEstoque()


    } catch (erro) {

        console.error('Erro ao atualizar estoque:', erro)

        alert('Não foi possível atualizar o estoque.')

    }

}


carregarEstoque()