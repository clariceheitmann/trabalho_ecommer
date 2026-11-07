
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const listaItens = document.getElementById('listaItens')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
} else {

    // Lista os itens
    async function listarItens() {

        try {

            const resposta = await fetch(`${baseUrl}/itemPedidos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            listaItens.innerHTML = ''

            if (dados.length === 0) {
                mensagem.textContent = 'Nenhum item encontrado!'
                return
            }

            dados.forEach(item => {

                const linha = document.createElement('tr')

                const valores = [
                    item.id,
                    item.pedido_id,
                    item.produto_id,
                    item.quantidade,
                    `R$ ${Number(item.preco_unitario).toFixed(2)}`,
                    `R$ ${Number(item.subtotal).toFixed(2)}`
                ]

                valores.forEach(valor => {
                    const celula = document.createElement('td')
                    celula.textContent = valor
                    linha.appendChild(celula)
                })

                listaItens.appendChild(linha)

            })

            mensagem.textContent = ''

        } catch (erro) {

            console.error(erro)
            mensagem.textContent = 'Erro ao listar itens!'

        }

    }

    listarItens()

}
