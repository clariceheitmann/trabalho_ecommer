
const baseUrl = 'http://localhost:3000'

const formulario = document.getElementById('formConsulta')
const nome = document.getElementById('nome')
const mensagem = document.getElementById('mensagem')
const resultado = document.getElementById('resultado')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()
    resultado.replaceChildren()

    try {
        const resposta = await fetch(
            `${baseUrl}/categoria/buscar/${encodeURIComponent(nome.value.trim())}`
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Categoria não encontrada.'
            return
        }

        mensagem.textContent = 'Categoria encontrada!'

        ;[
            ['Código', dados.id],
            ['Nome', dados.nome],
            ['Descrição', dados.descricao]
        ].forEach(([campo, valor]) => {
            const paragrafo = document.createElement('p')
            paragrafo.textContent = `${campo}: ${valor ?? ''}`
            resultado.appendChild(paragrafo)
        })

    } catch (erro) {
        console.error('Erro ao consultar categoria:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
