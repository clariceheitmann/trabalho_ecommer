
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const codigo = document.getElementById('codigo')
const btnBuscar = document.getElementById('btnBuscar')
const listaEstoque = document.getElementById('listaEstoque')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
}

// Consulta pelo código
async function buscarEstoque() {

    if (!codigo.value) {
        mensagem.textContent = 'Informe o código do estoque!'
        return
    }

    try {

        const resposta = await fetch(`${baseUrl}/estoque/${codigo.value}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message
            listaEstoque.innerHTML = ''
            return
        }

        listaEstoque.innerHTML = ''

        const linha = document.createElement('tr')

        const valores = [
            dados.id,
            dados.produto_id,
            dados.quantidade
        ]

        valores.forEach(valor => {
            const celula = document.createElement('td')
            celula.textContent = valor
            linha.appendChild(celula)
        })

        listaEstoque.appendChild(linha)
        mensagem.textContent = ''

    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Erro ao consultar estoque!'
    }

}

btnBuscar.addEventListener('click', buscarEstoque)
