
const codigo = document.getElementById('codigo')
const nome = document.getElementById('nome')
const btnBuscarCodigo = document.getElementById('btnBuscarCodigo')
const btnBuscarNome = document.getElementById('btnBuscarNome')
const btnListar = document.getElementById('btnListar')
const tabelaUsuarios = document.getElementById('tabelaUsuarios')
const mensagem = document.getElementById('mensagem')

const baseUrl = 'http://localhost:3000'

// Recupera o token salvo durante o login
const token = localStorage.getItem('token')

// Mostra uma mensagem na página
function mostrarMensagem(texto) {
    mensagem.textContent = texto
}

// Faz requisições protegidas ao backend
async function requisicao(url) {
    if (!token) {
        mostrarMensagem('Faça login antes de acessar esta página.')
        return null
    }

    try {
        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mostrarMensagem(
                dados.message || 'Não foi possível realizar a consulta.'
            )
            return null
        }

        mostrarMensagem('')
        return dados

    } catch (erro) {
        console.error('Erro na requisição:', erro)
        mostrarMensagem('Não foi possível conectar ao servidor.')
        return null
    }
}

// Monta a tabela com os usuários recebidos
function mostrarUsuarios(usuarios) {
    tabelaUsuarios.replaceChildren()

    // A consulta por código retorna um objeto; a listagem retorna um array
    const lista = Array.isArray(usuarios) ? usuarios : [usuarios]

    if (lista.length === 0 || !lista[0]) {
        tabelaUsuarios.innerHTML =
            '<tr><td colspan="6">Nenhum usuário encontrado.</td></tr>'
        return
    }

    lista.forEach(usuario => {
        const linha = document.createElement('tr')

        const valores = [
            usuario.id,
            usuario.nome,
            usuario.sobreNome,
            usuario.email,
            usuario.telefone,
            usuario.tipo || 'usuario'
        ]


        const celulaAcoes = document.createElement('td')

        const btnExcluir = document.createElement('button')
        btnExcluir.textContent = 'Excluir'

        // Guarda o código do usuário no botão
        btnExcluir.addEventListener('click', () => {
            excluirUsuario(usuario.id, usuario.nome)
        })

        celulaAcoes.appendChild(btnExcluir)
        linha.appendChild(celulaAcoes)


        valores.forEach(valor => {
            const celula = document.createElement('td')
            celula.textContent = valor ?? ''
            linha.appendChild(celula)
        })

        tabelaUsuarios.appendChild(linha)
    })
}

// Lista todos os usuários (rota exclusiva para administradores)
btnListar.addEventListener('click', async () => {
    const dados = await requisicao(`${baseUrl}/usuarios`)

    if (dados !== null) {
        mostrarUsuarios(dados)
    }
})

// Consulta um usuário pelo código
btnBuscarCodigo.addEventListener('click', async () => {
    if (!codigo.value || Number(codigo.value) < 1) {
        mostrarMensagem('Digite um código válido.')
        return
    }

    const dados = await requisicao(
        `${baseUrl}/usuario/${encodeURIComponent(codigo.value)}`
    )

    if (dados !== null) {
        mostrarUsuarios(dados)
    }
})

// Consulta por nome (rota exclusiva para administradores)
btnBuscarNome.addEventListener('click', async () => {
    if (!nome.value.trim()) {
        mostrarMensagem('Digite o nome do usuário.')
        return
    }

    const dados = await requisicao(
        `${baseUrl}/usuario/buscar/${encodeURIComponent(nome.value.trim())}`
    )

    if (dados !== null) {
        mostrarUsuarios(dados)
    }
})


async function excluirUsuario(id, nome) {
    const confirmar = confirm(
        `Tem certeza que deseja excluir o usuário ${nome} (código ${id})?`
    )

    if (!confirmar) {
        return
    }

    if (!token) {
        mostrarMensagem('Faça login antes de continuar.')
        return
    }

    try {
        const resposta = await fetch(`${baseUrl}/usuario/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const texto = await resposta.text()
        let dados = {}

        try {
            dados = texto ? JSON.parse(texto) : {}
        } catch (erro) {
            mostrarMensagem('O servidor retornou uma resposta inválida.')
            return
        }

        if (!resposta.ok) {
            mostrarMensagem(
                dados.message || `Erro HTTP ${resposta.status}`
            )
            return
        }

        mostrarMensagem('Usuário excluído com sucesso!')

        // Atualiza a tabela depois da exclusão
        btnListar.click()

    } catch (erro) {
        console.error('Erro ao excluir usuário:', erro)
        mostrarMensagem('Não foi possível conectar ao servidor.')
    }
}

