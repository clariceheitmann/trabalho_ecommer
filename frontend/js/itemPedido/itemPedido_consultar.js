
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const codigo = document.getElementById('codigo')
const btnBuscar = document.getElementById('btnBuscar')
const listaItens = document.getElementById('listaItens')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
} else {

    // Consulta pelo código
    async function buscarItem() {

        if (!codigo.value) {
            mensagem.textContent = 'Informe o código do item!'
            return
        }

        try {

            const resposta = await fetch(`${baseUrl}/itemPedido/${codigo.value}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                listaItens.innerHTML = ''
                return
            }

            listaItens.innerHTML = ''

            const linha = document.createElement('tr')

            const valores = [
                dados.id,
                dados.pedido_id,
                dados.produto_id,
                dados.quantidade,
                `R$ ${Number(dados.preco_unitario).toFixed(2)}`,
                `R$ ${Number(dados.subtotal).toFixed(2)}`
            ]

            valores.forEach(valor => {
                const celula = document.createElement('td')
                celula.textContent = valor
                linha.appendChild(celula)
            })

            listaItens.appendChild(linha)
            mensagem.textContent = ''

        } catch (erro) {

            console.error(erro)
            mensagem.textContent = 'Erro ao consultar item!'

        }

    }

    btnBuscar.addEventListener('click', buscarItem)

}
