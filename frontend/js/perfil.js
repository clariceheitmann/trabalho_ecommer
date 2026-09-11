const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

if (!token) {
    alert('Você precisa fazer login para acessar seu perfil!')
    window.location.href = 'login.html'
}


function pegarIdDoToken() {

    const partes = token.split('.')

    const payload = JSON.parse(atob(partes[1]))

    return payload.id
}


const usuarioId = pegarIdDoToken()

const formulario = document.getElementById('formPerfil')


async function carregarPerfil() {

    try {

        const resposta = await fetch(`${baseUrl}/usuario/${usuarioId}`, {

            method: 'GET',

            headers: {
                'Authorization': `Bearer ${token}`
            }

        })

        const dados = await resposta.json()

        if (!resposta.ok) {

            alert(dados.message || 'Não foi possível carregar o perfil.')

            return
        }


        const usuario = dados.usuario || dados


        document.getElementById('nome').value = usuario.nome || ''
        document.getElementById('sobreNome').value = usuario.sobreNome || ''
        document.getElementById('idade').value = usuario.idade || ''
        document.getElementById('email').value = usuario.email || ''
        document.getElementById('telefone').value = usuario.telefone || ''
        document.getElementById('cpf').value = usuario.cpf || ''
        document.getElementById('cep').value = usuario.cep || ''
        document.getElementById('rua').value = usuario.rua || ''
        document.getElementById('numero').value = usuario.numero || ''
        document.getElementById('bairro').value = usuario.bairro || ''
        document.getElementById('cidade').value = usuario.cidade || ''
        document.getElementById('estado').value = usuario.estado || ''

    } catch (erro) {

        console.error('Erro ao carregar perfil:', erro)

        alert('Não foi possível carregar seu perfil.')
    }
}


formulario.addEventListener('submit', async (event) => {

    event.preventDefault()


    const dadosUsuario = {

        nome: document.getElementById('nome').value,
        sobreNome: document.getElementById('sobreNome').value,
        idade: document.getElementById('idade').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value

    }


    try {

        const resposta = await fetch(`${baseUrl}/usuario/${usuarioId}`, {

            method: 'PUT',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': `Bearer ${token}`

            },

            body: JSON.stringify(dadosUsuario)

        })


        const dados = await resposta.json()


        if (!resposta.ok) {

            alert(dados.message || 'Não foi possível atualizar o perfil.')

            return
        }


        alert('Perfil atualizado com sucesso! 🎵')

        carregarPerfil()

    } catch (erro) {

        console.error('Erro ao atualizar perfil:', erro)

        alert('Não foi possível atualizar seu perfil.')
    }

})


carregarPerfil()