
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

async function carregarCategorias() {
    const select = document.getElementById('categoria_id')

    try {
        const resposta = await fetch(`${baseUrl}/categorias`)
        const categorias = await resposta.json()

        categorias.forEach(categoria => {
            select.innerHTML += `
                <option value="${categoria.id}">
                    ${categoria.nome}
                </option>
            `
        })

    } catch (erro) {
        console.error(erro)
        alert('Erro ao carregar categorias!')
    }
}

document.getElementById('form_atualizar').addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value

    const produto = {}

    const campos = [
        'nome', 'artista', 'album', 'formato',
        'ano', 'preco', 'imagem', 'descricao', 'categoria_id'
    ]

    campos.forEach(campo => {
        const valor = document.getElementById(campo).value

        if (valor !== '') {
            produto[campo] = valor
        }
    })

    if (Object.keys(produto).length === 0) {
        alert('Informe pelo menos um campo para atualizar!')
        return
    }

    if (produto.ano !== undefined) {
        produto.ano = Number(produto.ano)
    }

    if (produto.preco !== undefined) {
        produto.preco = Number(produto.preco)
    }

    if (produto.categoria_id !== undefined) {
        produto.categoria_id = Number(produto.categoria_id)
    }

    try {
        const resposta = await fetch(`${baseUrl}/produto/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produto)
        })

        const dados = await resposta.json()

        alert(resposta.ok ? 'Produto atualizado parcialmente!' : dados.message)

        if (resposta.ok) {
            window.location.href = 'produto_listar.html'
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao atualizar produto!')
    }
})

carregarCategorias()
