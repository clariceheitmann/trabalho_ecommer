
const btnConsultar = document.getElementById('btnConsultar')
const resultado = document.getElementById('resultado')
const mensagem = document.getElementById('mensagem')

btnConsultar.addEventListener('click', consultarEntrega)

async function consultarEntrega() {
    const id = document.getElementById('id').value

    resultado.innerHTML = ''
    mensagem.textContent = ''

    if (!id || Number(id) < 1) {
        mensagem.textContent = 'Informe um código válido.'
        return
    }

    try {
        const resposta = await fetch(`http://localhost:3000/entrega/${id}`)
        const entrega = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = entrega.message || 'Entrega não encontrada.'
            return
        }

        const campos = {
            'Código': entrega.id,
            'Pedido': entrega.pedido_id,
            'Endereço': entrega.endereco,
            'Código de rastreio': entrega.codigo_rastreio || '-',
            'Status': entrega.status,
            'Data de envio': formatarData(entrega.data_envio),
            'Data de entrega': formatarData(entrega.data_entrega)
        }

        Object.entries(campos).forEach(([nome, valor]) => {
            const paragrafo = document.createElement('p')
            paragrafo.textContent = `${nome}: ${valor}`
            resultado.appendChild(paragrafo)
        })
    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}

function formatarData(data) {
    return data ? new Date(data).toLocaleString('pt-BR') : '-'
}
