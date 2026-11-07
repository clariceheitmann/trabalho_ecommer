
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const form = document.getElementById('formItem')
const codigo = document.getElementById('codigo')
const quantidade = document.getElementById('quantidade')
const mensagem = document.getElementById('mensagem')

// Verifica o login
if (!token) {
    alert('Faça login para continuar!')
    window.location.href = '../../html/login.html'
} else {

    // Atualiza o item
    form.addEventListener('submit', async (e) => {

        e.preventDefault()

        const valores = {
            quantidade: Number(quantidade.value)
        }

        try {

            const resposta = await fetch(`${baseUrl}/itemPedido/${codigo.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(valores)
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                mensagem.textContent = dados.message
                return
            }

            alert(dados.message)
            form.reset()
            mensagem.textContent = ''

        } catch (erro) {

            console.error(erro)
            mensagem.textContent = 'Erro ao atualizar item!'

        }

    })

}
