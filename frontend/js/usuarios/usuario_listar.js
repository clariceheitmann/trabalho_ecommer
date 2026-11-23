
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const btnListar = document.getElementById('btnListar')
const tabela = document.getElementById('tabelaUsuarios')
const mensagem = document.getElementById('mensagem')

btnListar.addEventListener('click', listarUsuarios)

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

async function listarUsuarios() {
    if (!token) {
        mensagem.textContent = 'Faça login para continuar.'
        return
    }

    try {
        const resposta = await fetch(`${baseUrl}/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao listar usuários.'
            return
        }

        tabela.replaceChildren()

        if (dados.length === 0) {
            mensagem.textContent = 'Nenhum usuário cadastrado.'
            return
        }

        dados.forEach(usuario => {
            tabela.appendChild(criarTabelaUsuario(usuario))
        })

        mensagem.textContent = `${dados.length} usuário(s) encontrado(s).`

    } catch (erro) {
        console.error('Erro ao listar usuários:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}
