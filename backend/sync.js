const conn = require('./db/conn')

require('./models/rel')

async function syncDataBase() {
    try {
        // Sincroniza as tabelas e seus relacionamentos
        await conn.sync()

        console.log('Tabelas sincronizadas com sucesso!')

    } catch (err) {
        console.error('Erro ao sincronizar as tabelas:', err)

    } finally {
        await conn.close()
        console.log('Fechando a conexão com o banco de dados no sync.js')
    }
}

syncDataBase()