
const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('token')

const btnConsultar = document.getElementById('btnConsultar')
const resultado = document.getElementById('resultado')
const mensagem = document.getElementById('mensagem')

btnConsultar.addEventListener('click', consultarEntrega)

async function consultarEntrega() {
    const id = document.getElementById('id').value

    resultado.replaceChildren()
    mensagem.textContent = ''

    if (!id || Number(id) < 1) {
        mensagem.textContent = 'Informe um código válido.'
        return
    }

    try {
        const resposta = await fetch(`${baseUrl}/entrega/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const entrega = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = entrega.message || 'Entrega não encontrada.'
            return
        }

        const linha = document.createElement('tr')

        const valores = [
            entrega.id,
            entrega.pedido_id,
            entrega.endereco,
            entrega.codigo_rastreio || '-',
            entrega.status,
            formatarData(entrega.data_envio),
            formatarData(entrega.data_entrega)
        ]

        valores.forEach(valor => {
            const celula = document.createElement('td')
            celula.textContent = valor ?? '-'
            linha.appendChild(celula)
        })

        resultado.appendChild(linha)
        mensagem.textContent = 'Entrega encontrada!'

    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}

function formatarData(data) {
    return data ? new Date(data).toLocaleString('pt-BR') : '-'
}
