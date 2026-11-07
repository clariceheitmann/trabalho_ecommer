
const btnListar = document.getElementById('btnListar')
const tabela = document.getElementById('tabelaEntregas')
const mensagem = document.getElementById('mensagem')

btnListar.addEventListener('click', listarEntregas)

async function listarEntregas() {
    tabela.innerHTML = ''
    mensagem.textContent = ''

    try {
        const resposta = await fetch('http://localhost:3000/entregas')
        const entregas = await resposta.json()

        if (!resposta.ok) {
            mensagem.textContent = entregas.message || 'Erro ao listar entregas.'
            return
        }

        if (entregas.length === 0) {
            mensagem.textContent = 'Nenhuma entrega cadastrada.'
            return
        }

        entregas.forEach(entrega => {
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
                celula.textContent = valor
                linha.appendChild(celula)
            })

            tabela.appendChild(linha)
        })
    } catch (erro) {
        console.error(erro)
        mensagem.textContent = 'Não foi possível conectar ao servidor.'
    }
}

function formatarData(data) {
    return data ? new Date(data).toLocaleString('pt-BR') : '-'
}
