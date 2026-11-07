
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const listaEstoque = document.getElementById('listaEstoque')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

// Lista os estoques
async function listarEstoque() {

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

        listaEstoque.innerHTML = ''

        if (dados.length === 0) {
            mensagem.textContent = 'Nenhum estoque encontrado!'
            return
        }

        dados.forEach(estoque => {

            const linha = document.createElement('tr')

            const valores = [
                estoque.id,
                estoque.produto_id,
                estoque.quantidade
            ]

            valores.forEach(valor => {
                const celula = document.createElement('td')
                celula.textContent = valor
                linha.appendChild(celula)
            })

            listaEstoque.appendChild(linha)

        })

        mensagem.textContent = ''

    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Erro ao listar estoque!'
    }

}

listarEstoque()
