const conn = require('./db/conn')

const Categoria = require('./models/Categoria')
const Produto = require('./models/Produto')
const Estoque = require('./models/Estoque')

// Carrega os relacionamentos
require('./models/rel')

// Carrega descrições e configurações das capas
const {
    obterDescricao,
    obterArtistaParaCapa
} = require('./catalogoDetalhes')


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}


function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


// ======================================================
// BUSCAR CAPA AUTOMATICAMENTE
// ======================================================

async function buscarCapa(artista, album) {

    const artistaBusca = obterArtistaParaCapa(artista)

    const consultas = [
        `artist:"${artistaBusca}" AND releasegroup:"${album}"`,
        `releasegroup:"${album}"`
    ]

    for (const consulta of consultas) {

        try {

            const url =
                `https://musicbrainz.org/ws/2/release-group/` +
                `?query=${encodeURIComponent(consulta)}` +
                `&fmt=json&limit=10`

            const resposta = await fetch(url, {
                headers: {
                    'User-Agent':
                        'AnalogDreamsTechnologies/1.0 (school project)'
                }
            })

            if (!resposta.ok) {
                console.log(
                    `   ⚠️ MusicBrainz respondeu ${resposta.status}`
                )

                continue
            }

            const dados = await resposta.json()

            const resultados = dados['release-groups'] || []

            if (resultados.length === 0) {
                continue
            }

            const albumNormalizado = normalizarTexto(album)
            const artistaNormalizado = normalizarTexto(artistaBusca)

            // Primeiro tenta encontrar o álbum exatamente
            let resultado = resultados.find(item => {

                const titulo = normalizarTexto(item.title)

                return titulo === albumNormalizado
            })

            // Se não encontrar exatamente, usa o primeiro resultado
            if (!resultado) {
                resultado = resultados[0]
            }

            if (!resultado || !resultado.id) {
                continue
            }

            // Confere se existe artista no resultado quando possível
            if (resultado['artist-credit']) {

                const nomesArtistas =
                    resultado['artist-credit']
                        .map(a => a.name || a.artist?.name || '')
                        .join(' ')

                const nomesNormalizados =
                    normalizarTexto(nomesArtistas)

                // Não bloqueamos a capa se o MusicBrainz
                // usar uma variação do nome do artista.
                if (
                    !nomesNormalizados.includes(artistaNormalizado) &&
                    !albumNormalizado
                ) {
                    continue
                }
            }

            return `https://coverartarchive.org/release-group/${resultado.id}/front-500`
        }

        catch (erro) {

            console.log(
                `   ⚠️ Erro ao buscar capa: ${erro.message}`
            )
        }
    }

    return null
}


const produtos = [

    // =========================
    // 2PAC
    // =========================

    {
        artista: '2Pac',
        album: 'Greatest Hits',
        ano: 1998,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 89.90,
        estoque: 10
    },

    {
        artista: '2Pac',
        album: 'All Eyez on Me',
        ano: 1996,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: '2Pac',
        album: 'R U Still Down? (Remember Me)',
        ano: 1997,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: '2Pac',
        album: 'Me Against the World',
        ano: 1995,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: '2Pac',
        album: 'Strictly 4 My N.I.G.G.A.Z...',
        ano: 1993,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 74.90,
        estoque: 7
    },

    {
        artista: '2Pac',
        album: 'The Don Killuminati: The 7 Day Theory',
        ano: 1996,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 129.90,
        estoque: 6
    },


    // =========================
    // ABBA
    // =========================

    {
        artista: 'ABBA',
        album: 'Super Trouper',
        ano: 1980,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 129.90,
        estoque: 5
    },

    {
        artista: 'ABBA',
        album: 'Arrival',
        ano: 1976,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 119.90,
        estoque: 6
    },

    {
        artista: 'ABBA',
        album: 'Voulez-Vous',
        ano: 1979,
        categoria: 'Pop',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },

    {
        artista: 'ABBA',
        album: 'ABBA',
        ano: 1975,
        categoria: 'Pop',
        formato: 'CD',
        preco: 64.90,
        estoque: 8
    },

    {
        artista: 'ABBA',
        album: 'The Album',
        ano: 1977,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 119.90,
        estoque: 5
    },

    {
        artista: 'ABBA',
        album: 'Waterloo',
        ano: 1974,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 109.90,
        estoque: 5
    },


    // =========================
    // ALICE IN CHAINS
    // =========================

    {
        artista: 'Alice In Chains',
        album: 'Dirt',
        ano: 1992,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Alice In Chains',
        album: 'Facelift',
        ano: 1990,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'Alice In Chains',
        album: 'Jar of Flies',
        ano: 1994,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Alice In Chains',
        album: 'Alice in Chains',
        ano: 1995,
        categoria: 'Rock',
        formato: 'CD',
        preco: 89.90,
        estoque: 6
    },

    {
        artista: 'Alice In Chains',
        album: 'Unplugged',
        ano: 1996,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // THE BEATLES
    // =========================

    {
        artista: 'The Beatles',
        album: 'Abbey Road',
        ano: 1969,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'The Beatles',
        album: 'Please Please Me',
        ano: 1963,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 4
    },

    {
        artista: 'The Beatles',
        album: 'Sgt. Pepper’s Lonely Hearts Club Band',
        ano: 1967,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'The Beatles',
        album: 'Rubber Soul',
        ano: 1965,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Beatles',
        album: 'The Beatles (White Album)',
        ano: 1968,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 189.90,
        estoque: 4
    },

    {
        artista: 'The Beatles',
        album: 'Revolver',
        ano: 1966,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Beatles',
        album: 'Help!',
        ano: 1965,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'The Beatles',
        album: 'Let It Be',
        ano: 1970,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Beatles',
        album: 'Magical Mystery Tour',
        ano: 1967,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'The Beatles',
        album: 'A Hard Day’s Night',
        ano: 1964,
        categoria: 'Rock',
        formato: 'CD',
        preco: 74.90,
        estoque: 7
    },


    // =========================
    // DEFTONES
    // =========================

    {
        artista: 'Deftones',
        album: 'Around the Fur',
        ano: 1997,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Deftones',
        album: 'Diamond Eyes',
        ano: 2010,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Deftones',
        album: 'Koi No Yokan',
        ano: 2012,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Deftones',
        album: 'White Pony',
        ano: 2000,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 4
    },

    {
        artista: 'Deftones',
        album: 'Adrenaline',
        ano: 1995,
        categoria: 'Metal',
        formato: 'CD',
        preco: 89.90,
        estoque: 7
    },

    {
        artista: 'Deftones',
        album: 'Deftones',
        ano: 2003,
        categoria: 'Metal',
        formato: 'CD',
        preco: 89.90,
        estoque: 7
    },

    {
        artista: 'Deftones',
        album: 'Ohms',
        ano: 2020,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // FLEETWOOD MAC
    // =========================

    {
        artista: 'Fleetwood Mac',
        album: 'Rumours',
        ano: 1977,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Fleetwood Mac',
        album: 'Fleetwood Mac',
        ano: 1975,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Fleetwood Mac',
        album: 'Tusk',
        ano: 1979,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 4
    },


    // =========================
    // GORILLAZ
    // =========================

    {
        artista: 'Gorillaz',
        album: 'Demon Days',
        ano: 2005,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Gorillaz',
        album: 'Plastic Beach',
        ano: 2010,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Gorillaz',
        album: 'Gorillaz',
        ano: 2001,
        categoria: 'Pop',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'Gorillaz',
        album: 'Humanz',
        ano: 2017,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Gorillaz',
        album: 'The Now Now',
        ano: 2018,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // HER'S
    // =========================

    {
        artista: "Her's",
        album: 'Invitation to Her’s',
        ano: 2018,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // JORDANA / TV GIRL
    // =========================

    {
        artista: 'Jordana, TV Girl',
        album: 'Summer’s Over',
        ano: 2021,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // LADY GAGA
    // =========================

    {
        artista: 'Lady Gaga',
        album: 'Born This Way',
        ano: 2011,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Lady Gaga',
        album: 'The Fame',
        ano: 2008,
        categoria: 'Pop',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'Lady Gaga',
        album: 'The Fame Monster',
        ano: 2009,
        categoria: 'Pop',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'Lady Gaga',
        album: 'ARTPOP',
        ano: 2013,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Lady Gaga',
        album: 'Chromatica',
        ano: 2020,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // LANA DEL REY
    // =========================

    {
        artista: 'Lana Del Rey',
        album: 'Born to Die',
        ano: 2012,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Honeymoon',
        ano: 2015,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Lust for Life',
        ano: 2017,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Norman Fucking Rockwell!',
        ano: 2019,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Ultraviolence',
        ano: 2014,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Paradise',
        ano: 2012,
        categoria: 'Pop',
        formato: 'CD',
        preco: 74.90,
        estoque: 7
    },

    {
        artista: 'Lana Del Rey',
        album: 'Chemtrails over the Country Club',
        ano: 2021,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Blue Banisters',
        ano: 2021,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Lana Del Rey',
        album: 'Did you know that there’s a tunnel under Ocean Blvd',
        ano: 2023,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },


    // =========================
    // LINKIN PARK
    // =========================

    {
        artista: 'Linkin Park',
        album: 'From Zero',
        ano: 2024,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Linkin Park',
        album: 'Hybrid Theory',
        ano: 2000,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Linkin Park',
        album: 'Meteora',
        ano: 2003,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Linkin Park',
        album: 'Minutes to Midnight',
        ano: 2007,
        categoria: 'Rock',
        formato: 'CD',
        preco: 89.90,
        estoque: 8
    },

    {
        artista: 'Linkin Park',
        album: 'A Thousand Suns',
        ano: 2010,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Linkin Park',
        album: 'Living Things',
        ano: 2012,
        categoria: 'Rock',
        formato: 'CD',
        preco: 89.90,
        estoque: 8
    },

    {
        artista: 'Linkin Park',
        album: 'The Hunting Party',
        ano: 2014,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Linkin Park',
        album: 'One More Light',
        ano: 2017,
        categoria: 'Rock',
        formato: 'CD',
        preco: 89.90,
        estoque: 8
    },


    // =========================
    // MAC DEMARCO
    // =========================

    {
        artista: 'Mac DeMarco',
        album: '2',
        ano: 2012,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Mac DeMarco',
        album: 'Salad Days',
        ano: 2014,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Mac DeMarco',
        album: 'This Old Dog',
        ano: 2017,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // MASAYOSHI TAKANAKA
    // =========================

    {
        artista: 'Masayoshi Takanaka',
        album: 'All of Me',
        ano: 1979,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 4
    },


    // =========================
    // MASSIVE ATTACK
    // =========================

    {
        artista: 'Massive Attack',
        album: 'Mezzanine',
        ano: 1998,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // MY BLOODY VALENTINE
    // =========================

    {
        artista: 'My Bloody Valentine',
        album: 'Loveless',
        ano: 1991,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'My Bloody Valentine',
        album: 'mbv',
        ano: 2013,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // NIRVANA
    // =========================

    {
        artista: 'Nirvana',
        album: 'Bleach',
        ano: 1989,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Nirvana',
        album: 'In Utero',
        ano: 1993,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Nirvana',
        album: 'Nevermind',
        ano: 1991,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Nirvana',
        album: 'MTV Unplugged in New York',
        ano: 1994,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Nirvana',
        album: 'Incesticide',
        ano: 1992,
        categoria: 'Rock',
        formato: 'CD',
        preco: 89.90,
        estoque: 7
    },


    // =========================
    // THE NOTORIOUS B.I.G.
    // =========================

    {
        artista: 'The Notorious B.I.G.',
        album: 'Life After Death',
        ano: 1997,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'The Notorious B.I.G.',
        album: 'Ready to Die',
        ano: 1994,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Notorious B.I.G.',
        album: 'Born Again',
        ano: 1999,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },


    // =========================
    // PEARL JAM
    // =========================

    {
        artista: 'Pearl Jam',
        album: 'Ten',
        ano: 1991,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Pearl Jam',
        album: 'Vs.',
        ano: 1993,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Pearl Jam',
        album: 'Vitalogy',
        ano: 1994,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // PINK FLOYD
    // =========================

    {
        artista: 'Pink Floyd',
        album: 'Wish You Were Here',
        ano: 1975,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Pink Floyd',
        album: 'The Dark Side of the Moon',
        ano: 1973,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 189.90,
        estoque: 5
    },

    {
        artista: 'Pink Floyd',
        album: 'The Wall',
        ano: 1979,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 189.90,
        estoque: 5
    },

    {
        artista: 'Pink Floyd',
        album: 'Animals',
        ano: 1977,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Pink Floyd',
        album: 'Meddle',
        ano: 1971,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // QUEEN
    // =========================

    {
        artista: 'Queen',
        album: 'A Night at the Opera',
        ano: 1975,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'Jazz',
        ano: 1978,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'The Game',
        ano: 1980,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'Queen',
        album: 'A Day at the Races',
        ano: 1976,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'Queen',
        ano: 1973,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'Sheer Heart Attack',
        ano: 1974,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'News of the World',
        ano: 1977,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'Queen II',
        ano: 1974,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Queen',
        album: 'A Kind of Magic',
        ano: 1986,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },


    // =========================
    // RADIOHEAD
    // =========================

    {
        artista: 'Radiohead',
        album: 'Pablo Honey',
        ano: 1993,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'Radiohead',
        album: 'OK Computer',
        ano: 1997,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Radiohead',
        album: 'The Bends',
        ano: 1995,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Radiohead',
        album: 'In Rainbows',
        ano: 2007,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Radiohead',
        album: 'Kid A',
        ano: 2000,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Radiohead',
        album: 'Amnesiac',
        ano: 2001,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'Radiohead',
        album: 'Hail to the Thief',
        ano: 2003,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Radiohead',
        album: 'A Moon Shaped Pool',
        ano: 2016,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // RED HOT CHILI PEPPERS
    // =========================

    {
        artista: 'Red Hot Chili Peppers',
        album: 'Blood Sugar Sex Magik',
        ano: 1991,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Red Hot Chili Peppers',
        album: 'Californication',
        ano: 1999,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Red Hot Chili Peppers',
        album: 'By the Way',
        ano: 2002,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Red Hot Chili Peppers',
        album: 'Mother’s Milk',
        ano: 1989,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'Red Hot Chili Peppers',
        album: 'One Hot Minute',
        ano: 1995,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'Red Hot Chili Peppers',
        album: 'Stadium Arcadium',
        ano: 2006,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Red Hot Chili Peppers',
        album: 'Unlimited Love',
        ano: 2022,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // SKANK
    // =========================

    {
        artista: 'Skank',
        album: 'Estandarte',
        ano: 2008,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },

    {
        artista: 'Skank',
        album: 'Calango',
        ano: 1994,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },

    {
        artista: 'Skank',
        album: 'Samba Poconé',
        ano: 1996,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },


    // =========================
    // SLOWDIVE
    // =========================

    {
        artista: 'Slowdive',
        album: 'Souvlaki',
        ano: 1993,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Slowdive',
        album: 'Just for a Day',
        ano: 1991,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Slowdive',
        album: 'Slowdive',
        ano: 2017,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // THE SMITHS
    // =========================

    {
        artista: 'The Smiths',
        album: 'The Smiths',
        ano: 1984,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'The Smiths',
        album: 'The Queen Is Dead',
        ano: 1986,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Smiths',
        album: 'Hatful of Hollow',
        ano: 1984,
        categoria: 'Rock',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'The Smiths',
        album: 'Louder Than Bombs',
        ano: 1987,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'The Smiths',
        album: 'Meat Is Murder',
        ano: 1985,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'The Smiths',
        album: 'Strangeways, Here We Come',
        ano: 1987,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // SUBLIME
    // =========================

    {
        artista: 'Sublime',
        album: 'Sublime',
        ano: 1996,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // TV GIRL
    // =========================

    {
        artista: 'TV Girl',
        album: 'French Exit',
        ano: 2014,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'TV Girl',
        album: 'Who Really Cares',
        ano: 2016,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'TV Girl',
        album: 'Death of a Party Girl',
        ano: 2018,
        categoria: 'Pop',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // WALLOWS
    // =========================

    {
        artista: 'Wallows',
        album: 'Nothing Happens',
        ano: 2019,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Wallows',
        album: 'Tell Me That It’s Over',
        ano: 2022,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // MY CHEMICAL ROMANCE
    // =========================

    {
        artista: 'My Chemical Romance',
        album: 'The Black Parade',
        ano: 2006,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'My Chemical Romance',
        album: 'Three Cheers for Sweet Revenge',
        ano: 2004,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'My Chemical Romance',
        album: 'I Brought You My Bullets, You Brought Me Your Love',
        ano: 2002,
        categoria: 'Rock',
        formato: 'CD',
        preco: 89.90,
        estoque: 7
    },

    {
        artista: 'My Chemical Romance',
        album: 'Danger Days: The True Lives of the Fabulous Killjoys',
        ano: 2010,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // SNOOP DOGG
    // =========================

    {
        artista: 'Snoop Dogg',
        album: 'Doggystyle',
        ano: 1993,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Snoop Dogg',
        album: 'Tha Doggfather',
        ano: 1996,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: 'Snoop Dogg',
        album: 'R&G (Rhythm & Gangsta): The Masterpiece',
        ano: 2004,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },


    // =========================
    // 50 CENT
    // =========================

    {
        artista: '50 Cent',
        album: 'Get Rich or Die Tryin’',
        ano: 2003,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: '50 Cent',
        album: 'The Massacre',
        ano: 2005,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },

    {
        artista: '50 Cent',
        album: 'Curtis',
        ano: 2007,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },


    // =========================
    // DR. DRE
    // =========================

    {
        artista: 'Dr. Dre',
        album: 'The Chronic',
        ano: 1992,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Dr. Dre',
        album: '2001',
        ano: 1999,
        categoria: 'Hip Hop / Rap',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Dr. Dre',
        album: 'Compton',
        ano: 2015,
        categoria: 'Hip Hop / Rap',
        formato: 'CD',
        preco: 79.90,
        estoque: 8
    },


    // =========================
    // JORGE BEN JOR
    // =========================

    {
        artista: 'Jorge Ben Jor',
        album: 'Samba Esquema Novo',
        ano: 1963,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Jorge Ben Jor',
        album: 'A Tábua de Esmeralda',
        ano: 1974,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Jorge Ben Jor',
        album: 'África Brasil',
        ano: 1976,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Jorge Ben Jor',
        album: 'Ben',
        ano: 1972,
        categoria: 'MPB',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },


    // =========================
    // O RAPPA
    // =========================

    {
        artista: 'O Rappa',
        album: 'O Rappa',
        ano: 1994,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },

    {
        artista: 'O Rappa',
        album: 'Rappa Mundi',
        ano: 1996,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },

    {
        artista: 'O Rappa',
        album: 'Lado B Lado A',
        ano: 1999,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'O Rappa',
        album: 'O Silêncio Q Precede O Esporro',
        ano: 2003,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 8
    },


    // =========================
    // TOQUINHO
    // =========================

    {
        artista: 'Toquinho',
        album: 'Toquinho',
        ano: 1970,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 129.90,
        estoque: 5
    },

    {
        artista: 'Toquinho',
        album: 'Toquinho & Vinicius',
        ano: 1971,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Toquinho',
        album: 'Casa de Brinquedos',
        ano: 1983,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 7
    },


    // =========================
    // VINICIUS DE MORAES
    // =========================

    {
        artista: 'Vinicius de Moraes',
        album: 'Vinicius de Moraes',
        ano: 1968,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Vinicius de Moraes',
        album: 'Vinicius & Odette Lara',
        ano: 1963,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Vinicius de Moraes',
        album: 'Vinicius & Toquinho',
        ano: 1971,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // CARTOLA
    // =========================

    {
        artista: 'Cartola',
        album: 'Cartola',
        ano: 1974,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Cartola',
        album: 'Cartola 2',
        ano: 1976,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // GAL COSTA
    // =========================

    {
        artista: 'Gal Costa',
        album: 'Gal Costa',
        ano: 1969,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Gal Costa',
        album: 'Índia',
        ano: 1973,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Gal Costa',
        album: 'Fa-Tal – Gal a Todo Vapor',
        ano: 1971,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Gal Costa',
        album: 'Gal Tropical',
        ano: 1979,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // CAZUZA
    // =========================

    {
        artista: 'Cazuza',
        album: 'Exagerado',
        ano: 1985,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Cazuza',
        album: 'Só Se For a Dois',
        ano: 1987,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 7
    },

    {
        artista: 'Cazuza',
        album: 'Ideologia',
        ano: 1988,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Cazuza',
        album: 'O Tempo Não Para',
        ano: 1988,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 7
    },


    // =========================
    // ANA FRANGO ELÉTRICO
    // =========================

    {
        artista: 'Ana Frango Elétrico',
        album: 'Mormaço Queima',
        ano: 2018,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Ana Frango Elétrico',
        album: 'Little Electric Chicken Heart',
        ano: 2019,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // RITA LEE
    // =========================

    {
        artista: 'Rita Lee',
        album: 'Fruto Proibido',
        ano: 1975,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Rita Lee',
        album: 'Rita Lee',
        ano: 1980,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },

    {
        artista: 'Rita Lee',
        album: 'Build Up',
        ano: 1970,
        categoria: 'MPB',
        formato: 'CD',
        preco: 79.90,
        estoque: 7
    },

    {
        artista: 'Rita Lee',
        album: 'Entradas e Bandeiras',
        ano: 1976,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // TIM MAIA
    // =========================

    {
        artista: 'Tim Maia',
        album: 'Tim Maia',
        ano: 1970,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Tim Maia',
        album: 'Racional Vol. 1',
        ano: 1975,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 4
    },

    {
        artista: 'Tim Maia',
        album: 'Racional Vol. 2',
        ano: 1976,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 4
    },


    // =========================
    // ELIS REGINA
    // =========================

    {
        artista: 'Elis Regina',
        album: 'Elis & Tom',
        ano: 1974,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Elis Regina',
        album: 'Falso Brilhante',
        ano: 1976,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // MILTON NASCIMENTO
    // =========================

    {
        artista: 'Milton Nascimento',
        album: 'Clube da Esquina',
        ano: 1972,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Milton Nascimento',
        album: 'Minas',
        ano: 1975,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },


    // =========================
    // CHICO BUARQUE
    // =========================

    {
        artista: 'Chico Buarque',
        album: 'Construção',
        ano: 1971,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Chico Buarque',
        album: 'Meus Caros Amigos',
        ano: 1976,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // DJAVAN
    // =========================

    {
        artista: 'Djavan',
        album: 'Luz',
        ano: 1982,
        categoria: 'MPB',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Djavan',
        album: 'Seduz',
        ano: 1981,
        categoria: 'MPB',
        formato: 'CD',
        preco: 69.90,
        estoque: 7
    },


    // =========================
    // LEGIÃO URBANA
    // =========================

    {
        artista: 'Legião Urbana',
        album: 'Legião Urbana',
        ano: 1985,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Legião Urbana',
        album: 'Dois',
        ano: 1986,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Legião Urbana',
        album: 'Que País É Este',
        ano: 1987,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },


    // =========================
    // ROCK CLÁSSICO
    // =========================

    {
        artista: 'Led Zeppelin',
        album: 'Led Zeppelin',
        ano: 1969,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Led Zeppelin',
        album: 'Led Zeppelin II',
        ano: 1969,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Led Zeppelin',
        album: 'Led Zeppelin IV',
        ano: 1971,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Led Zeppelin',
        album: 'Physical Graffiti',
        ano: 1975,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 189.90,
        estoque: 4
    },

    {
        artista: 'The Rolling Stones',
        album: 'Let It Bleed',
        ano: 1969,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'The Rolling Stones',
        album: 'Sticky Fingers',
        ano: 1971,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'The Rolling Stones',
        album: 'Exile on Main St.',
        ano: 1972,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'The Doors',
        album: 'The Doors',
        ano: 1967,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Doors',
        album: 'Strange Days',
        ano: 1967,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Doors',
        album: 'L.A. Woman',
        ano: 1971,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'David Bowie',
        album: 'The Rise and Fall of Ziggy Stardust and the Spiders from Mars',
        ano: 1972,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'David Bowie',
        album: 'Hunky Dory',
        ano: 1971,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'The Clash',
        album: 'London Calling',
        ano: 1979,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'The Cure',
        album: 'Disintegration',
        ano: 1989,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Joy Division',
        album: 'Unknown Pleasures',
        ano: 1979,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'R.E.M.',
        album: 'Automatic for the People',
        ano: 1992,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'The Strokes',
        album: 'Is This It',
        ano: 2001,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'The White Stripes',
        album: 'Elephant',
        ano: 2003,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'U2',
        album: 'The Joshua Tree',
        ano: 1987,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Green Day',
        album: 'Dookie',
        ano: 1994,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Green Day',
        album: 'American Idiot',
        ano: 2004,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'blink-182',
        album: 'Enema of the State',
        ano: 1999,
        categoria: 'Rock',
        formato: 'VINIL',
        preco: 139.90,
        estoque: 5
    },


    // =========================
    // METAL
    // =========================

    {
        artista: 'Black Sabbath',
        album: 'Black Sabbath',
        ano: 1970,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Black Sabbath',
        album: 'Paranoid',
        ano: 1970,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Black Sabbath',
        album: 'Master of Reality',
        ano: 1971,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Metallica',
        album: 'Kill ’Em All',
        ano: 1983,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Metallica',
        album: 'Ride the Lightning',
        ano: 1984,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Metallica',
        album: 'Master of Puppets',
        ano: 1986,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Metallica',
        album: '...And Justice for All',
        ano: 1988,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Metallica',
        album: 'Metallica',
        ano: 1991,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Iron Maiden',
        album: 'The Number of the Beast',
        ano: 1982,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Iron Maiden',
        album: 'Piece of Mind',
        ano: 1983,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Iron Maiden',
        album: 'Powerslave',
        ano: 1984,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Megadeth',
        album: 'Peace Sells... but Who’s Buying?',
        ano: 1986,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Megadeth',
        album: 'Rust in Peace',
        ano: 1990,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Slayer',
        album: 'Reign in Blood',
        ano: 1986,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'System of a Down',
        album: 'Toxicity',
        ano: 2001,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'System of a Down',
        album: 'Mezmerize',
        ano: 2005,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Slipknot',
        album: 'Slipknot',
        ano: 1999,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Slipknot',
        album: 'Iowa',
        ano: 2001,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Korn',
        album: 'Korn',
        ano: 1994,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 149.90,
        estoque: 5
    },

    {
        artista: 'Korn',
        album: 'Follow the Leader',
        ano: 1998,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Rage Against the Machine',
        album: 'Rage Against the Machine',
        ano: 1992,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Tool',
        album: 'Ænima',
        ano: 1996,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Tool',
        album: 'Lateralus',
        ano: 2001,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Pantera',
        album: 'Cowboys from Hell',
        ano: 1990,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Pantera',
        album: 'Vulgar Display of Power',
        ano: 1992,
        categoria: 'Metal',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },


    // =========================
    // JAZZ
    // =========================

    {
        artista: 'Miles Davis',
        album: 'Kind of Blue',
        ano: 1959,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Miles Davis',
        album: 'Bitches Brew',
        ano: 1970,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'Dave Brubeck',
        album: 'Time Out',
        ano: 1959,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'John Coltrane',
        album: 'A Love Supreme',
        ano: 1965,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 179.90,
        estoque: 5
    },

    {
        artista: 'John Coltrane',
        album: 'Blue Train',
        ano: 1957,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Charles Mingus',
        album: 'Mingus Ah Um',
        ano: 1959,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Ella Fitzgerald & Louis Armstrong',
        album: 'Ella and Louis',
        ano: 1956,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Cannonball Adderley',
        album: 'Somethin’ Else',
        ano: 1958,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Herbie Hancock',
        album: 'Head Hunters',
        ano: 1973,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 159.90,
        estoque: 5
    },

    {
        artista: 'Stan Getz & João Gilberto',
        album: 'Getz/Gilberto',
        ano: 1964,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Sonny Rollins',
        album: 'Saxophone Colossus',
        ano: 1956,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    },

    {
        artista: 'Ornette Coleman',
        album: 'The Shape of Jazz to Come',
        ano: 1959,
        categoria: 'Jazz',
        formato: 'VINIL',
        preco: 169.90,
        estoque: 5
    }

]


// ======================================================
// FUNÇÃO PRINCIPAL
// ======================================================

async function adicionarProdutos() {

    try {

        console.log('\n========================================')
        console.log('   CADASTRO / ATUALIZAÇÃO DE PRODUTOS')
        console.log('========================================\n')

        await conn.authenticate()

        await conn.sync()


        // ==================================================
        // CATEGORIAS
        // ==================================================

        const nomesCategorias = [
            'Rock',
            'Metal',
            'Pop',
            'Hip Hop / Rap',
            'MPB',
            'Jazz'
        ]

        const categorias = {}

        for (const nome of nomesCategorias) {

            const [categoria] =
                await Categoria.findOrCreate({
                    where: { nome }
                })

            categorias[nome] = categoria.id

            console.log(
                `Categoria: ${nome} → ID ${categoria.id}`
            )
        }


        // ==================================================
        // CONTADORES
        // ==================================================

        let adicionados = 0
        let atualizados = 0
        let existentes = 0
        let estoquesCriados = 0
        let capasEncontradas = 0
        let capasNaoEncontradas = 0


        // ==================================================
        // PRODUTOS
        // ==================================================

        for (const item of produtos) {

            const categoriaId =
                categorias[item.categoria]

            if (!categoriaId) {

                console.log(
                    `⚠️ Categoria não encontrada: ${item.categoria}`
                )

                continue
            }


            // ==============================================
            // VERIFICA SE O PRODUTO JÁ EXISTE
            // ==============================================

            const existente =
                await Produto.findOne({
                    where: {
                        artista: item.artista,
                        album: item.album
                    }
                })


            // ==============================================
            // SE JÁ EXISTE
            // ==============================================

            if (existente) {

                existentes++

                console.log(
                    `\n🔄 Atualizando: ${item.artista} - ${item.album}`
                )


                // ------------------------------------------
                // DESCRIÇÃO
                // ------------------------------------------

                const descricao =
                    obterDescricao(
                        item.artista,
                        item.album
                    )


                // ------------------------------------------
                // CAPA
                // ------------------------------------------

                let imagem = existente.imagem


                if (!imagem) {

                    console.log('   🔎 Procurando capa...')

                    imagem =
                        await buscarCapa(
                            item.artista,
                            item.album
                        )

                    if (imagem) {

                        capasEncontradas++

                        console.log(
                            '   🖼️ Capa encontrada!'
                        )

                    } else {

                        capasNaoEncontradas++

                        console.log(
                            '   ⚠️ Capa não encontrada.'
                        )
                    }

                    // Evita mandar muitas requisições
                    // seguidas para o MusicBrainz.
                    await esperar(1100)
                }


                // ------------------------------------------
                // ATUALIZA PRODUTO
                // ------------------------------------------

                await existente.update({

                    descricao: descricao,

                    imagem: imagem,

                    categoria_id: categoriaId

                })

                atualizados++


                // ------------------------------------------
                // ESTOQUE
                // ------------------------------------------

                const estoqueExistente =
                    await Estoque.findOne({
                        where: {
                            produto_id: existente.id
                        }
                    })


                if (!estoqueExistente) {

                    await Estoque.create({

                        produto_id: existente.id,

                        quantidade: item.estoque

                    })

                    estoquesCriados++

                    console.log(
                        `   📦 Estoque criado: ${item.estoque}`
                    )

                }


                continue
            }


            // ==============================================
            // NOVO PRODUTO
            // ==============================================

            console.log(
                `\n➕ Adicionando: ${item.artista} - ${item.album}`
            )


            // ------------------------------------------
            // DESCRIÇÃO
            // ------------------------------------------

            const descricao =
                obterDescricao(
                    item.artista,
                    item.album
                )


            // ------------------------------------------
            // CAPA
            // ------------------------------------------

            console.log('   🔎 Procurando capa...')

            const imagem =
                await buscarCapa(
                    item.artista,
                    item.album
                )


            if (imagem) {

                capasEncontradas++

                console.log(
                    '   🖼️ Capa encontrada!'
                )

            } else {

                capasNaoEncontradas++

                console.log(
                    '   ⚠️ Capa não encontrada.'
                )
            }


            await esperar(1100)


            // ------------------------------------------
            // CRIA PRODUTO
            // ------------------------------------------

            const produto =
                await Produto.create({

                    nome: item.album,

                    artista: item.artista,

                    album: item.album,

                    formato: item.formato,

                    ano: item.ano,

                    preco: item.preco,

                    imagem: imagem,

                    descricao: descricao,

                    categoria_id: categoriaId

                })


            adicionados++


            console.log(
                `   ✅ Produto criado (ID ${produto.id})`
            )


            // ------------------------------------------
            // CRIA ESTOQUE
            // ------------------------------------------

            await Estoque.create({

                produto_id: produto.id,

                quantidade: item.estoque

            })

            estoquesCriados++

            console.log(
                `   📦 Estoque: ${item.estoque}`
            )
        }


        // ==================================================
        // RESUMO
        // ==================================================

        console.log('\n')
        console.log('========================================')
        console.log('       CADASTRO FINALIZADO!')
        console.log('========================================')

        console.log(
            `🆕 Produtos adicionados: ${adicionados}`
        )

        console.log(
            `🔄 Produtos atualizados: ${atualizados}`
        )

        console.log(
            `📋 Produtos já existentes: ${existentes}`
        )

        console.log(
            `📦 Estoques criados: ${estoquesCriados}`
        )

        console.log(
            `🖼️ Capas encontradas: ${capasEncontradas}`
        )

        console.log(
            `⚠️ Capas não encontradas: ${capasNaoEncontradas}`
        )

        console.log('========================================\n')


    } catch (err) {

        console.error(
            '\n❌ Erro ao cadastrar produtos:'
        )

        console.error(err)

    } finally {

        await conn.close()
    }
}


adicionarProdutos()