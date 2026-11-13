
const baseUrl = 'http://localhost:3000'

const token = localStorage.getItem('token')


// ======================================================
// VERIFICAR LOGIN
// ======================================================

if (!token) {

    alert('Faça login para acessar os relatórios!')

    window.location.href = 'login.html'

}


// ======================================================
// CONFIGURAÇÃO DOS GRÁFICOS
// ======================================================

let graficoVendas = null
let graficoEstoque = null


// ======================================================
// RELATÓRIO DE VENDAS
// ======================================================

async function carregarVendas() {

    try {

        const resposta = await fetch(
            `${baseUrl}/relatorios/vendas`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.message || 'Erro ao carregar vendas.')
        }

        // Agrupar vendas por data

        const vendasPorData = {}

        dados.forEach(pedido => {

            const data = new Date(pedido.data)
                .toLocaleDateString('pt-BR')

            vendasPorData[data] =
                (vendasPorData[data] || 0) +
                Number(pedido.valor_total)

        })

        const datas = Object.keys(vendasPorData)

        const valores = Object.values(vendasPorData)

        const totalVendido = valores.reduce(
            (total, valor) => total + valor,
            0
        )

        document.getElementById('resumoVendas').innerHTML = `
            <h3>Total vendido: R$ ${totalVendido.toFixed(2)}</h3>
            <p>Pedidos pagos: ${dados.length}</p>
        `

        const contexto = document
            .getElementById('graficoVendas')
            .getContext('2d')

        if (graficoVendas) {
            graficoVendas.destroy()
        }

        graficoVendas = new Chart(contexto, {

            type: 'bar',

            data: {
                labels: datas,

                datasets: [{
                    label: 'Vendas (R$)',
                    data: valores,
                    backgroundColor: '#397F79',
                    borderColor: '#633C25',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: true
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }

        })

    } catch (erro) {

        console.error('Erro nas vendas:', erro)

        document.getElementById('resumoVendas').innerHTML =
            `<p>Não foi possível carregar o relatório de vendas.</p>`

    }

}


// ======================================================
// RELATÓRIO DE ESTOQUE
// ======================================================

async function carregarEstoque() {

    try {

        const resposta = await fetch(
            `${baseUrl}/relatorios/estoque`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.message || 'Erro ao carregar estoque.')
        }

        const nomes = dados.map(produto => produto.nome)

        const quantidades = dados.map(
            produto => Number(produto.quantidade)
        )

        const totalEstoque = quantidades.reduce(
            (total, quantidade) => total + quantidade,
            0
        )

        document.getElementById('resumoEstoque').innerHTML = `
            <h3>Unidades em estoque: ${totalEstoque}</h3>
            <p>Produtos cadastrados: ${dados.length}</p>
        `

                const contexto = document
            .getElementById('graficoEstoque')
            .getContext('2d')

        if (graficoEstoque) {
            graficoEstoque.destroy()
        }

        // Aumentar a altura conforme a quantidade de produtos
        const alturaGrafico = Math.max(400, dados.length * 35)

        document.getElementById('graficoEstoque').parentElement.style.height =
            `${alturaGrafico}px`

        graficoEstoque = new Chart(contexto, {

            type: 'bar',

            data: {
                labels: nomes,

                datasets: [{
                    label: 'Quantidade disponível',
                    data: quantidades,
                    backgroundColor: '#E7B13E',
                    borderColor: '#633C25',
                    borderWidth: 1,
                    borderRadius: 8,
                    barPercentage: 0.65,
                    categoryPercentage: 0.8
                }]
            },

            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: true
                    }
                },

                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    },

                    y: {
                        ticks: {
                            autoSkip: false
                        }
                    }
                }
            }

        })

    } catch (erro) {

        console.error('Erro no estoque:', erro)

        document.getElementById('resumoEstoque').innerHTML =
            `<p>Não foi possível carregar o relatório de estoque.</p>`

    }

}


// ======================================================
// INICIAR RELATÓRIOS
// ======================================================

if (token) {
    carregarVendas()
    carregarEstoque()
}
