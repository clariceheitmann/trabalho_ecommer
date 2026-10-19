
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')
const formulario = document.getElementById('formAtualizarParcial')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!token) {
        mensagem.textContent = 'Faça login para continuar.'
        return
    }

    const id = document.getElementById('id').value

    const campos = [
        'nome', 'sobreNome', 'idade', 'email', 'telefone',
        'cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'
    ]

    const dadosUsuario = {}

    campos.forEach(campo => {
        const valor = document.getElementById(campo).value.trim()

        if (valor !== '') {
            dadosUsuario[campo] = valor
        }
    })

    if (Object.keys(dadosUsuario).length === 0) {
        mensagem.textContent = 'Preencha pelo menos um campo para atualizar.'
        return
    }

    if (dadosUsuario.cpf) {
        dadosUsuario.cpf = dadosUsuario.cpf.replace(/\D/g, '')
    }

    if (dadosUsuario.cep) {
        dadosUsuario.cep = dadosUsuario.cep.replace(/\D/g, '')
    }

    if (dadosUsuario.estado) {
        dadosUsuario.estado = dadosUsuario.estado.toUpperCase()
    }

    try {
        const resposta = await fetch(`${baseUrl}/usuario/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dadosUsuario)
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = dados.message || 'Erro ao atualizar usuário.'
            return
        }

        mensagem.textContent = 'Dados atualizados com sucesso!'

    } catch (erro) {
        console.error('Erro na atualização parcial:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
