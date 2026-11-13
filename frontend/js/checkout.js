
const resumoCheckout = document.getElementById('resumoCheckout')
const formulario = document.getElementById('formCheckout')

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []

const baseUrl = 'http://localhost:3000'


// ======================================================
// VERIFICAR CARRINHO
// ======================================================

if (carrinho.length === 0) {

    resumoCheckout.innerHTML = `
        <p>Seu carrinho está vazio.</p>
        <br>
        <a href="produto/produtos.html">
            Voltar para produtos
        </a>
    `

    formulario.style.display = 'none'

}


// ======================================================
// MOSTRAR RESUMO DO PEDIDO
// ======================================================

function mostrarResumo() {

    if (carrinho.length === 0) return

    let total = 0

    let html = `<h2>Resumo do pedido</h2>`

    carrinho.forEach(produto => {

        const subtotal =
            Number(produto.preco) * produto.quantidade

        total += subtotal

        html += `
            <p>
                ${produto.album || produto.nome}
                — ${produto.quantidade}x
                — R$ ${subtotal.toFixed(2)}
            </p>
        `

    })

    html += `
        <br>
        <h2>Total: R$ ${total.toFixed(2)}</h2>
        <br>
    `

    resumoCheckout.innerHTML = html

}

mostrarResumo()


// ======================================================
// LER RESPOSTA DA API
// ======================================================

async function lerResposta(resposta) {

    try {
        return await resposta.json()
    } catch {
        return {}
    }

}


// ======================================================
// FINALIZAR COMPRA
// ======================================================

formulario.addEventListener('submit', async (event) => {

    event.preventDefault()

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!')
        return
    }

    const token = localStorage.getItem('token')

    if (!token) {

        alert('Você precisa fazer login para finalizar a compra!')

        window.location.href = 'login.html'

        return

    }


    // Pegar os campos do HTML

    const cep = document.getElementById('cep').value.trim()
    const rua = document.getElementById('rua').value.trim()
    const numero = document.getElementById('numero').value.trim()
    const bairro = document.getElementById('bairro').value.trim()
    const cidade = document.getElementById('cidade').value.trim()
    const estado = document.getElementById('estado').value.trim()


    // Juntar os campos em um endereço completo

    const endereco = `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado}, CEP: ${cep}`


    // Calcular o valor total

    let total = 0

    carrinho.forEach(produto => {

        total += Number(produto.preco) * produto.quantidade

    })


    try {

        // ==============================================
        // CADASTRAR PEDIDO
        // ==============================================

        const respostaPedido = await fetch(`${baseUrl}/pedido`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({
                valor_total: total
            })

        })

        const dadosPedido = await lerResposta(respostaPedido)

        if (!respostaPedido.ok) {

            alert(dadosPedido.message || 'Erro ao cadastrar pedido.')

            return

        }

        const pedidoId = dadosPedido.pedido.id


        // ==============================================
        // CADASTRAR ITENS DO PEDIDO
        // ==============================================

        for (const produto of carrinho) {

            const respostaItem = await fetch(`${baseUrl}/itemPedido`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({

                    pedido_id: pedidoId,

                    produto_id: produto.id,

                    quantidade: produto.quantidade

                })

            })

            const dadosItem = await lerResposta(respostaItem)

            if (!respostaItem.ok) {

                alert(dadosItem.message || 'Erro ao cadastrar item do pedido.')

                return

            }

        }


        // ==============================================
        // CADASTRAR ENTREGA
        // ==============================================

        const respostaEntrega = await fetch(`${baseUrl}/entrega`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({

                pedido_id: pedidoId,

                endereco: endereco

            })

        })

        const dadosEntrega = await lerResposta(respostaEntrega)

        if (!respostaEntrega.ok) {

            alert(dadosEntrega.message || 'Erro ao cadastrar entrega.')

            return

        }


        // ==============================================
        // FINALIZAR PEDIDO
        // ==============================================

        const respostaFinalizar = await fetch(
            `${baseUrl}/pedido/${pedidoId}/finalizar`,
            {

                method: 'POST',

                headers: {
                    'Authorization': `Bearer ${token}`
                }

            }
        )

        const dadosFinalizar = await lerResposta(respostaFinalizar)

        if (!respostaFinalizar.ok) {

            alert(dadosFinalizar.message || 'Erro ao finalizar pedido.')

            return

        }


        // ==============================================
        // LIMPAR CARRINHO
        // ==============================================

        localStorage.removeItem('carrinho')

        alert('Compra realizada com sucesso! 🎵')

        window.location.href = 'historico.html'


    } catch (erro) {

        console.error('Erro ao finalizar compra:', erro)

        alert('Não foi possível finalizar a compra. Verifique sua conexão com o servidor.')

    }

})
