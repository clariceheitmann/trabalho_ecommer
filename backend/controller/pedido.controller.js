const Pedido = require('../models/Pedido')
const Usuario = require('../models/Usuario')
const ItemPedido = require('../models/ItemPedido')
const Estoque = require('../models/Estoque')

const cadastrar = async (req, res) => {

    const { valor_total } = req.body

    if (valor_total === undefined) {
        return res.status(400).json({
            message: 'Valor total é obrigatório!'
        })
    }

    try {

        // O ID do usuário vem do token JWT
        const usuario_id = req.usuario.id

        const usuario = await Usuario.findByPk(usuario_id)

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario não encontrado!'
            })
        }

        const pedido = await Pedido.create({
            usuario_id,
            valor_total
        })

        res.status(201).json({
            message: 'Pedido cadastrado com sucesso!',
            pedido
        })

    } catch (err) {

        console.error('Erro ao cadastrar pedido!', err)

        res.status(500).json({
            message: 'Erro ao cadastrar pedido!'
        })
    }
}


const listar = async (req, res) => {

    try {

        const pedidos = await Pedido.findAll()

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

        const pedido = await Pedido.findByPk(id)

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


const excluir = async (req, res) => {

    const id = req.params.id

    try {

        const pedido = await Pedido.findByPk(id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }

        await Pedido.destroy({
            where: {
                id: id
            }
        })

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


const atualizar = async (req, res) => {

    const id = req.params.id
    const valores = req.body

    try {

        const pedido = await Pedido.findByPk(id)

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
    const valores = req.body

    try {

        const pedido = await Pedido.findByPk(id)

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

const finalizar = async (req, res) => {

    const id = req.params.id

    try {

        // Procura o pedido
        const pedido = await Pedido.findByPk(id)

        if (!pedido) {
            return res.status(404).json({
                message: 'Pedido não encontrado!'
            })
        }


        // Verifica se o pedido já foi finalizado
        if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {

            return res.status(400).json({
                message: 'Este pedido não pode ser finalizado!'
            })

        }


        // Busca os itens desse pedido
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


        // Primeiro verifica TODO o estoque
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


        // Agora que todos possuem estoque suficiente,
        // podemos diminuir as quantidades
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


        // Atualiza o status do pedido
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
    excluir,
    atualizar,
    atualizarParcial,
    finalizar
}