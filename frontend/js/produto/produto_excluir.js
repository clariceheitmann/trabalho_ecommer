
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

const select = document.getElementById('id')

async function carregarProdutos() {
    try {
        const resposta = await fetch(`${baseUrl}/produtos`)
        const produtos = await resposta.json()

        select.innerHTML = '<option value="">Selecione</option>'

        if (!resposta.ok) {
            alert(produtos.message)
            return
        }

        produtos.forEach(produto => {
            select.innerHTML += `
                <option value="${produto.id}">
                    ${produto.nome} - ${produto.artista}
                </option>
            `
        })

    } catch (erro) {
        console.error(erro)
        alert('Erro ao carregar produtos!')
    }
}

document.getElementById('form_excluir').addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = select.value

    if (!confirm('Deseja realmente excluir este produto?')) {
        return
    }

    try {
        const resposta = await fetch(`${baseUrl}/produto/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        alert(dados.message)

        if (resposta.ok) {
            carregarProdutos()
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao excluir produto!')
    }
})

carregarProdutos()
