
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const formulario = document.getElementById('formConsulta')
const nome = document.getElementById('nome')
const mensagem = document.getElementById('mensagem')
const resultado = document.getElementById('resultado')

function criarTabelaUsuario(usuario) {
    const tabela = document.createElement('table')
    tabela.className = 'tabela-usuario'

    const campos = [
        ['Código', usuario.id],
        ['Nome', usuario.nome],
        ['Sobrenome', usuario.sobreNome],
        ['Idade', usuario.idade],
        ['E-mail', usuario.email],
        ['Telefone', usuario.telefone],
        ['CPF', usuario.cpf],
        ['CEP', usuario.cep],
        ['Rua', usuario.rua],
        ['Número', usuario.numero],
        ['Bairro', usuario.bairro],
        ['Cidade', usuario.cidade],
        ['Estado', usuario.estado]
    ]

    tabela.innerHTML = `
        <thead>
            <tr>
                <th>Campo</th>
                <th>Informação</th>
            </tr>
        </thead>
    `

    const tbody = document.createElement('tbody')

    campos.forEach(([nome, valor]) => {
        const linha = document.createElement('tr')
        const campo = document.createElement('td')
        const informacao = document.createElement('td')

        campo.textContent = nome
        informacao.textContent = valor ?? '-'

        linha.append(campo, informacao)
        tbody.appendChild(linha)
    })

    tabela.appendChild(tbody)

    return tabela
}

function mostrarUsuario(dados) {
    resultado.replaceChildren()

    const tabela = criarTabelaUsuario(dados)
    resultado.appendChild(tabela)
}


function criarCardUsuario(usuario) {
    const card = document.createElement('div')
    card.className = 'card-usuario'

    const titulo = document.createElement('h2')
    titulo.textContent = `${usuario.nome} ${usuario.sobreNome}`
    card.appendChild(titulo)

    const campos = [
        ['Código', usuario.id],
        ['Idade', usuario.idade],
        ['E-mail', usuario.email],
        ['Telefone', usuario.telefone],
        ['CPF', usuario.cpf],
        ['CEP', usuario.cep],
        ['Rua', usuario.rua],
        ['Número', usuario.numero],
        ['Bairro', usuario.bairro],
        ['Cidade', usuario.cidade],
        ['Estado', usuario.estado]
    ]

    campos.forEach(([nome, valor]) => {
        const paragrafo = document.createElement('p')
        const campo = document.createElement('strong')

        campo.textContent = nome + ': '
        paragrafo.appendChild(campo)
        paragrafo.append(valor ?? '-')

        card.appendChild(paragrafo)
    })

    return card
}


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

        mostrarUsuario(dados)

    } catch (erro) {
        console.error('Erro ao consultar usuário:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
