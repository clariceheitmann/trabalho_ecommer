
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

        select.innerHTML = '<option value="">Selecione</option>'

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

    const produto = {
        nome: document.getElementById('nome').value,
        artista: document.getElementById('artista').value,
        album: document.getElementById('album').value,
        formato: document.getElementById('formato').value,
        ano: Number(document.getElementById('ano').value),
        preco: Number(document.getElementById('preco').value),
        imagem: document.getElementById('imagem').value,
        descricao: document.getElementById('descricao').value,
        categoria_id: Number(document.getElementById('categoria_id').value)
    }

    try {
        const resposta = await fetch(`${baseUrl}/produto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produto)
        })

        const dados = await resposta.json()

        alert(resposta.ok ? 'Produto atualizado com sucesso!' : dados.message)

        if (resposta.ok) {
            window.location.href = 'produto_listar.html'
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao atualizar produto!')
    }
})

carregarCategorias()
