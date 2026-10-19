
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const btnListar = document.getElementById('btnListar')
const tabela = document.getElementById('tabelaUsuarios')
const mensagem = document.getElementById('mensagem')

btnListar.addEventListener('click', listarUsuarios)

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
            tabela.innerHTML =
                '<tr><td colspan="6">Nenhum usuário cadastrado.</td></tr>'
            mensagem.textContent = ''
            return
        }

        dados.forEach(usuario => {
            const linha = document.createElement('tr')

            const valores = [
                usuario.id,
                usuario.nome,
                usuario.sobreNome,
                usuario.email,
                usuario.telefone,
                usuario.cpf
            ]

            valores.forEach(valor => {
                const celula = document.createElement('td')
                celula.textContent = valor ?? ''
                linha.appendChild(celula)
            })

            tabela.appendChild(linha)
        })

        mensagem.textContent = `${dados.length} usuário(s) encontrado(s).`

    } catch (erro) {
        console.error('Erro ao listar usuários:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}
