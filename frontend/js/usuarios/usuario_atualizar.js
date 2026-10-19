
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')
const formulario = document.getElementById('formAtualizar')
const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!token) {
        mensagem.textContent = 'Faça login para continuar.'
        return
    }

    const id = document.getElementById('id').value

    const dadosUsuario = {
        nome: document.getElementById('nome').value.trim(),
        sobreNome: document.getElementById('sobreNome').value.trim(),
        idade: document.getElementById('idade').value,
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        rua: document.getElementById('rua').value.trim(),
        numero: document.getElementById('numero').value.trim(),
        bairro: document.getElementById('bairro').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value.trim().toUpperCase()
    }

    try {
        const resposta = await fetch(`${baseUrl}/usuario/${encodeURIComponent(id)}`, {
            method: 'PUT',
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

        mensagem.textContent = 'Usuário atualizado com sucesso!'

    } catch (erro) {
        console.error('Erro ao atualizar usuário:', erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
})
