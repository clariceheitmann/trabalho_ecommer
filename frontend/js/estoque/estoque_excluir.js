
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const estoque_id = document.getElementById('estoque_id')
const btnExcluir = document.getElementById('btnExcluir')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

// Carrega os estoques
async function carregarEstoque() {

    try {

        const resposta = await fetch(`${baseUrl}/estoques`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message
            return
        }

        dados.forEach(estoque => {

            const opcao = document.createElement('option')

            opcao.value = estoque.id
            opcao.textContent = `Estoque ${estoque.id} - Produto ${estoque.produto_id}`

            estoque_id.appendChild(opcao)

        })

    } catch (erro) {

        console.error(erro)
        mensagem.textContent = 'Erro ao carregar estoques!'

    }

}

// Exclui o estoque selecionado
async function excluirEstoque() {

    const id = estoque_id.value

    if (!id) {
        mensagem.textContent = 'Selecione um estoque!'
        return
    }

    if (!confirm('Deseja realmente excluir este estoque?')) {
        return
    }

    try {

        const resposta = await fetch(`${baseUrl}/estoque/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message
            return
        }

        alert(dados.message)

        estoque_id.innerHTML = '<option value="">Selecione</option>'

        carregarEstoque()

    } catch (erro) {

        console.error(erro)
        mensagem.textContent = 'Erro ao excluir estoque!'

    }

}

btnExcluir.addEventListener('click', excluirEstoque)

carregarEstoque()
