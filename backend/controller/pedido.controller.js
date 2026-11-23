const Pedido = require('../models/Pedido')
const Usuario = require('../models/Usuario')
const ItemPedido = require('../models/ItemPedido')
const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')
const conn = require('../db/conn')

const cadastrar = async (req, res) => {

    const { itens } = req.body

    if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
            message: 'Informe os produtos do pedido!'
        })
    }

    const transacao = await conn.transaction()

    try {

        const usuario_id = req.usuario.id

        const usuario = await Usuario.findByPk(usuario_id, {
            transaction: transacao
        })

        if (!usuario) {
            await transacao.rollback()

            return res.status(404).json({
                message: 'Usuário não encontrado!'
            })
        }

        let totalCentavos = 0
        const itensPedido = []

        for (const item of itens) {

            const produto_id = Number(item.produto_id)
            const quantidade = Number(item.quantidade)

            if (
                !Number.isInteger(produto_id) ||
                !Number.isInteger(quantidade) ||
                produto_id <= 0 ||
                quantidade <= 0
            ) {
                await transacao.rollback()

                return res.status(400).json({
                    message: 'Produto ou quantidade inválida!'
                })
            }

            const produto = await Produto.findByPk(produto_id, {
                transaction: transacao
            })

            if (!produto) {
                await transacao.rollback()

                return res.status(404).json({
                    message: `Produto ${produto_id} não encontrado!`
                })
            }

            const precoCentavos = Math.round(
                Number(produto.preco) * 100
            )

            const subtotalCentavos = precoCentavos * quantidade

            totalCentavos += subtotalCentavos

            itensPedido.push({
                produto_id,
                quantidade,
                preco_unitario: precoCentavos / 100,
                subtotal: subtotalCentavos / 100
            })

        }

        const valor_total = totalCentavos / 100

        const pedido = await Pedido.create({
            usuario_id,
            valor_total
        }, {
            transaction: transacao
        })

        const itensComPedido = itensPedido.map(item => ({
            ...item,
            pedido_id: pedido.id
        }))

        await ItemPedido.bulkCreate(itensComPedido, {
            transaction: transacao
        })

        await transacao.commit()

        res.status(201).json({
            message: 'Pedido cadastrado com sucesso!',
            pedido
        })

    } catch (err) {

        await transacao.rollback()

        console.error('Erro ao cadastrar pedido!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar pedido!'
        })
    }
}


const listar = async (req, res) => {
    try {
        // Busca somente os pedidos do usuário autenticado
        const pedidos = await Pedido.findAll({
            where: {
                usuario_id: req.usuario.id
            },
            include: [
                {
                    model: ItemPedido,
                    as: 'itens',
                    include: [
                        {
                            model: require('../models/Produto'),
                            as: 'produto',
                            attributes: ['id', 'nome', 'artista', 'album', 'formato', 'preco']
                        }
                    ]
                }
            ],
            order: [['data_pedido', 'DESC']]
        })

        res.status(200).json(pedidos)

    } catch (err) {
        console.error('Erro ao listar pedidos!', err)

        res.status(500).json({
            message: 'Erro ao listar pedidos!'
        })
    }
}



const consultarPorCod = async (req, res) => {

    const id = req.params.id

    try {

        const pedido = await Pedido.findOne({
            where: {
                id: id,
                usuario_id: req.usuario.id
            }
        })

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        res.status(200).json(pedido)

    } catch (err) {

        console.error('Erro ao consultar pedido!', err)

        res.status(500).json({
            message: 'Erro ao consultar pedido!'
        })
    }
}


const atualizar = async (req, res) => {

    const id = req.params.id
    const { status } = req.body

const valores = { status }

    try {

        const pedido = await Pedido.findOne({
            where: {
                id: id,
                usuario_id: req.usuario.id
            }
        })

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await pedido.update(valores)

        res.status(200).json(pedido)

    } catch (err) {

        console.error('Erro ao atualizar pedido!', err)

        res.status(500).json({
            message: 'Erro ao atualizar pedido!'
        })
    }
}


const atualizarParcial = async (req, res) => {

    const id = req.params.id
    const { status } = req.body

const valores = { status }

    try {

        const pedido = await Pedido.findOne({
            where: {
                id: id,
                usuario_id: req.usuario.id
            }
        })

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await pedido.update(valores)

        res.status(200).json(pedido)

    } catch (err) {

        console.error('Erro ao atualizar pedido!', err)

        res.status(500).json({
            message: 'Erro ao atualizar pedido!'
        })
    }
}


const excluir = async (req, res) => {

    const id = req.params.id

    try {

        const pedido = await Pedido.findOne({
            where: {
                id: id,
                usuario_id: req.usuario.id
            }
        })

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await pedido.destroy()

        res.status(200).json({
            message: 'Pedido excluído com sucesso!'
        })

    } catch (err) {

        console.error('Erro ao excluir pedido!', err)

        res.status(500).json({
            message: 'Erro ao excluir pedido!'
        })
    }
}


const finalizar = async (req, res) => {

    const id = req.params.id

    try {

        const pedido = await Pedido.findOne({
            where: {
                id: id,
                usuario_id: req.usuario.id
            }
        })

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }


        if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {

            return res.status(400).json({
                message: 'Este pedido não pode ser finalizado!'
            })

        }


        const itens = await ItemPedido.findAll({
            where: {
                pedido_id: id
            }
        })


        if (itens.length === 0) {

            return res.status(400).json({
                message: 'Este pedido não possui itens!'
            })

        }


        for (const item of itens) {

            const estoque = await Estoque.findOne({
                where: {
                    produto_id: item.produto_id
                }
            })


            if (!estoque) {

                return res.status(404).json({
                    message:
                        `Estoque do produto ${item.produto_id} não encontrado!`
                })

            }


            if (estoque.quantidade < item.quantidade) {

                return res.status(400).json({
                    message:
                        `Estoque insuficiente para o produto ${item.produto_id}!`
                })

            }

        }


        for (const item of itens) {

            const estoque = await Estoque.findOne({
                where: {
                    produto_id: item.produto_id
                }
            })

            await estoque.update({
                quantidade: estoque.quantidade - item.quantidade
            })

        }


        await pedido.update({
            status: 'PAGO'
        })


        res.status(200).json({

            message: 'Pedido finalizado com sucesso!',

            pedido

        })

    } catch (err) {

        console.error(
            'Erro ao finalizar pedido!',
            err
        )

        res.status(500).json({
            message: 'Erro ao finalizar pedido!'
        })

    }
}


module.exports = {
    cadastrar,
    listar,
    consultarPorCod,
    atualizar,
    atualizarParcial,
    excluir,
    finalizar
}