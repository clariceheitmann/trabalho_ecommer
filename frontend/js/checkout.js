const resumoCheckout = document.getElementById('resumoCheckout')
const formulario = document.getElementById('formCheckout')
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
const baseUrl = 'http://localhost:3000'


if (carrinho.length === 0) {

    resumoCheckout.innerHTML = `
        <p>Seu carrinho está vazio.</p>

        <br>

        <a href="produtos.html">
            Voltar para produtos
        </a>
    `

    formulario.style.display = 'none'

}


function mostrarResumo() {

    if (carrinho.length === 0) return


    let total = 0


    let html = `
        <h2>Resumo do pedido</h2>
    `


    carrinho.forEach(produto => {

        const subtotal =
            Number(produto.preco) * produto.quantidade

        total += subtotal


        html += `
            <p>
                ${produto.nome}
                — ${produto.quantidade}x
                — R$ ${subtotal.toFixed(2)}
            </p>
        `

    })


    html += `
        <br>

        <h2>
            Total:
            R$ ${total.toFixed(2)}
        </h2>

        <br>
    `


    resumoCheckout.innerHTML = html

}


mostrarResumo()


formulario.addEventListener('submit', async (event) => {

    event.preventDefault()


    const token = localStorage.getItem('token')


    if (!token) {

        alert('Você precisa fazer login para finalizar a compra!')

        window.location.href = 'login.html'

        return

    }


    const endereco =
        document.getElementById('endereco').value


    let total = 0


    carrinho.forEach(produto => {

        total +=
            Number(produto.preco) * produto.quantidade

    })


    try {


        const respostaPedido = await fetch(
            `${baseUrl}/pedido`,
            {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                    'Authorization':
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    valor_total: total

                })

            }
        )


        const dadosPedido =
            await respostaPedido.json()


        if (!respostaPedido.ok) {

            alert(dadosPedido.message)

            return

        }


        const pedidoId =
            dadosPedido.pedido.id


        for (const produto of carrinho) {

            const respostaItem = await fetch(
                `${baseUrl}/itemPedido`,
                {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization':
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        pedido_id: pedidoId,

                        produto_id: produto.id,

                        quantidade: produto.quantidade

                    })

                }
            )


            const dadosItem =
                await respostaItem.json()


            if (!respostaItem.ok) {

                alert(dadosItem.message)

                return

            }

        }


        const respostaEntrega = await fetch(
            `${baseUrl}/entrega`,
            {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                    'Authorization':
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    pedido_id: pedidoId,

                    endereco: endereco

                })

            }
        )


        const dadosEntrega =
            await respostaEntrega.json()


        if (!respostaEntrega.ok) {

            alert(dadosEntrega.message)

            return

        }


        const respostaFinalizar = await fetch(
            `${baseUrl}/pedido/${pedidoId}/finalizar`,
            {

                method: 'POST',

                headers: {

                    'Authorization':
                        `Bearer ${token}`

                }

            }
        )


        const dadosFinalizar =
            await respostaFinalizar.json()


        if (!respostaFinalizar.ok) {

            alert(dadosFinalizar.message)

            return

        }


        localStorage.removeItem('carrinho')


        alert('Compra realizada com sucesso! 🎵')


        window.location.href = 'produtos.html'


    } catch (erro) {

        console.error(
            'Erro ao finalizar compra:',
            erro
        )

        alert(
            'Não foi possível finalizar a compra.'
        )

    }

})