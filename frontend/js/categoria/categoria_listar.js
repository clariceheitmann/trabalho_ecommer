
const baseUrl = 'http://localhost:3000'

const btnListar = document.getElementById('btnListar')
const tabela = document.getElementById('tabelaCategorias')
const mensagem = document.getElementById('mensagem')

btnListar.addEventListener('click', listarCategorias)

async function listarCategorias() {
    try {
        const resposta = await fetch(`${baseUrl}/categorias`)
        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao listar categorias.'
            return
        }

        tabela.replaceChildren()

        if (dados.length === 0) {
            tabela.innerHTML =
                '<tr><td colspan="3">Nenhuma categoria cadastrada.</td></tr>'
            mensagem.textContent = ''
            return
        }

        dados.forEach(categoria => {
            const linha = document.createElement('tr')

            ;[
                categoria.id,
                categoria.nome,
                categoria.descricao
            ].forEach(valor => {
                const celula = document.createElement('td')
                celula.textContent = valor ?? ''
                linha.appendChild(celula)
            })

            tabela.appendChild(linha)
        })

        mensagem.textContent = `${dados.length} categoria(s) encontrada(s).`

    } catch (erro) {
        console.error('Erro ao listar categorias:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}
