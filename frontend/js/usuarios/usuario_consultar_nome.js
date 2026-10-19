
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formConsulta')
const nome = document.getElementById('nome')
const mensagem = document.getElementById('mensagem')
const resultado = document.getElementById('resultado')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()
    resultado.replaceChildren()

    if (!token) {
        mensagem.textContent = 'Faça login para continuar.'
        return
    }

    try {
        const resposta = await fetch(
            `${baseUrl}/usuario/buscar/${encodeURIComponent(nome.value.trim())}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Usuário não encontrado.'
            return
        }

        mensagem.textContent = 'Usuário encontrado!'

        Object.entries(dados).forEach(([campo, valor]) => {
            if (campo === 'senha') return

            const paragrafo = document.createElement('p')
            paragrafo.textContent = `${campo}: ${valor ?? ''}`
            resultado.appendChild(paragrafo)
        })

    } catch (erro) {
        console.error('Erro ao consultar usuário:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
