const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Faça login para continuar!')
    window.location.replace('../../html/login.html')
}

const select = document.getElementById('id')

async function carregarProdutos() {
    try {
        const resposta = await fetch(`${baseUrl}/produtos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const produtos = await resposta.json()

        if (resposta.status === 401) {
            localStorage.removeItem('token')
            alert('Sua sessão expirou. Faça login novamente!')
            window.location.replace('../../html/login.html')
            return
        }

        if (!resposta.ok) {
            alert(produtos.message || 'Erro ao carregar produtos!')
            return
        }

        select.innerHTML = '<option value="">Selecione</option>'

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

    if (!id) {
        alert('Selecione um produto!')
        return
    }

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

        if (resposta.status === 401) {
            localStorage.removeItem('token')
            alert('Sua sessão expirou. Faça login novamente!')
            window.location.replace('../../html/login.html')
            return
        }

        alert(dados.message)

        if (resposta.ok) {
            carregarProdutos()
        }

    } catch (erro) {
        console.error(erro)
        alert('Erro ao excluir produto!')
    }
})

if (token) {
    carregarProdutos()
}
