// ======================================================
// DETALHES DOS PRODUTOS
// ======================================================
//
// Aqui ficam as descrições individuais dos álbuns.
// A capa será buscada automaticamente pelo adicionarProdutos.js
// usando o artista + álbum.
//
// Se um álbum não tiver uma descrição específica aqui,
// o sistema gera uma descrição automática.
//

const descricoes = {

    // ==================================================
    // 2PAC
    // ==================================================

    "2Pac|Greatest Hits":
        "Coletânea que reúne alguns dos maiores sucessos de 2Pac, passando por diferentes momentos de sua carreira e mostrando sua força como rapper e compositor.",

    "2Pac|All Eyez on Me":
        "Um dos trabalhos mais marcantes de 2Pac, apresentado originalmente como um álbum duplo e conhecido por sua mistura de rap, narrativa urbana e produção da Costa Oeste.",

    "2Pac|R U Still Down? (Remember Me)":
        "Álbum que reúne gravações de diferentes períodos da carreira de 2Pac, explorando temas pessoais, sociais e a realidade das ruas.",

    "2Pac|Me Against the World":
        "Um dos trabalhos mais pessoais de 2Pac, com letras introspectivas sobre conflitos, violência, relações e as dificuldades de sua trajetória.",

    "2Pac|Strictly 4 My N.I.G.G.A.Z...":
        "Segundo álbum de estúdio de 2Pac, marcado por sua energia característica e por letras que abordam a vida nas ruas, questões sociais e sua identidade.",

    "2Pac|The Don Killuminati: The 7 Day Theory":
        "Álbum lançado sob o nome Makaveli, conhecido por sua atmosfera mais sombria, letras intensas e produção característica do período final da carreira de 2Pac.",


    // ==================================================
    // ABBA
    // ==================================================

    "ABBA|Super Trouper":
        "Álbum de 1980 que apresenta alguns dos grandes sucessos do ABBA, combinando pop melódico, harmonias vocais e produções características da banda.",

    "ABBA|Arrival":
        "Um dos álbuns mais conhecidos do ABBA, reunindo clássicos do pop dos anos 1970 e consolidando a sonoridade característica do grupo.",

    "ABBA|Voulez-Vous":
        "Álbum que incorpora elementos da música disco à sonoridade pop do ABBA, criando uma coleção dançante e marcante do final dos anos 1970.",

    "ABBA|ABBA":
        "Terceiro álbum de estúdio do grupo sueco, representando uma fase importante na construção da identidade pop que marcaria a carreira do ABBA.",

    "ABBA|The Album":
        "Trabalho que combina o pop característico do ABBA com composições mais elaboradas e algumas das canções mais lembradas da banda.",

    "ABBA|Waterloo":
        "Álbum que marcou uma etapa decisiva na carreira do ABBA, trazendo a música que deu ao grupo grande destaque internacional.",


    // ==================================================
    // ALICE IN CHAINS
    // ==================================================

    "Alice In Chains|Dirt":
        "Um dos trabalhos mais importantes do Alice in Chains, marcado por riffs pesados, atmosfera sombria e letras introspectivas.",

    "Alice In Chains|Facelift":
        "Álbum de estreia do Alice in Chains, combinando elementos do hard rock e do grunge com vocais marcantes e guitarras pesadas.",

    "Alice In Chains|Jar of Flies":
        "EP conhecido por sua atmosfera melancólica e por explorar uma abordagem mais acústica e introspectiva da banda.",

    "Alice In Chains|Alice in Chains":
        "Álbum homônimo que apresenta uma sonoridade pesada e sombria, com forte presença de guitarras e vocais característicos da banda.",

    "Alice In Chains|Unplugged":
        "Registro acústico que apresenta versões mais intimistas das músicas do Alice in Chains, destacando a força das composições.",


    // ==================================================
    // THE BEATLES
    // ==================================================

    "The Beatles|Abbey Road":
        "Um dos álbuns mais celebrados dos Beatles, conhecido por suas composições marcantes, produção sofisticada e pela famosa sequência final de músicas.",

    "The Beatles|Sgt. Pepper's Lonely Hearts Club Band":
        "Álbum conceitual que marcou uma importante transformação artística dos Beatles, explorando novas possibilidades de composição e produção.",

    "The Beatles|Revolver":
        "Trabalho que mostra os Beatles experimentando diferentes estilos, técnicas de estúdio e novas possibilidades sonoras.",

    "The Beatles|Rubber Soul":
        "Álbum que representa uma fase de amadurecimento artístico dos Beatles, combinando folk, rock e letras mais introspectivas.",

    "The Beatles|The Beatles":
        "Também conhecido como White Album, apresenta uma grande variedade de estilos e reúne algumas das composições mais marcantes da fase final dos Beatles.",

    "The Beatles|Let It Be":
        "Último álbum lançado pelos Beatles, reunindo músicas de diferentes momentos das últimas sessões de gravação do grupo.",


    // ==================================================
    // PINK FLOYD
    // ==================================================

    "Pink Floyd|The Dark Side of the Moon":
        "Álbum conceitual que explora temas como tempo, dinheiro, pressão social e mortalidade através de uma produção sonora cuidadosamente construída.",

    "Pink Floyd|Wish You Were Here":
        "Trabalho marcado por temas de ausência, distância e perda, com uma sonoridade progressiva e algumas das composições mais conhecidas do Pink Floyd.",

    "Pink Floyd|The Wall":
        "Álbum conceitual que acompanha uma narrativa sobre isolamento, trauma e construção de barreiras emocionais.",

    "Pink Floyd|Animals":
        "Álbum conceitual inspirado em uma visão crítica da sociedade, utilizando diferentes animais como metáforas para grupos e comportamentos humanos.",


    // ==================================================
    // NIRVANA
    // ==================================================

    "Nirvana|Nevermind":
        "Álbum que colocou o Nirvana no centro da explosão do grunge, combinando guitarras distorcidas, melodias marcantes e letras introspectivas.",

    "Nirvana|In Utero":
        "Trabalho que apresenta uma sonoridade mais crua e agressiva, mantendo o caráter introspectivo e experimental do Nirvana.",

    "Nirvana|Bleach":
        "Álbum de estreia do Nirvana, marcado por uma sonoridade mais pesada e crua, anterior ao sucesso mundial da banda.",

    "Nirvana|MTV Unplugged in New York":
        "Registro acústico que apresenta uma interpretação mais intimista de músicas do Nirvana e de outras composições escolhidas para a apresentação.",


    // ==================================================
    // METALLICA
    // ==================================================

    "Metallica|Kill 'Em All":
        "Álbum de estreia do Metallica e um dos trabalhos fundamentais para o desenvolvimento do thrash metal.",

    "Metallica|Ride the Lightning":
        "Segundo álbum do Metallica, expandindo a sonoridade da banda com composições mais elaboradas e uma abordagem mais diversificada.",

    "Metallica|Master of Puppets":
        "Um dos trabalhos mais conhecidos do Metallica, combinando riffs complexos, velocidade e temas relacionados ao controle e à dependência.",

    "Metallica|...And Justice for All":
        "Álbum marcado por composições longas, estruturas complexas e uma abordagem mais progressiva dentro do thrash metal.",

    "Metallica|Metallica":
        "Conhecido como Black Album, apresenta uma sonoridade mais acessível sem abandonar o peso característico do Metallica.",


    // ==================================================
    // BLACK SABBATH
    // ==================================================

    "Black Sabbath|Black Sabbath":
        "Álbum de estreia do Black Sabbath, considerado um dos trabalhos fundamentais para o desenvolvimento do heavy metal.",

    "Black Sabbath|Paranoid":
        "Um dos álbuns mais conhecidos do heavy metal, reunindo riffs marcantes e algumas das músicas mais importantes da carreira do Black Sabbath.",

    "Black Sabbath|Master of Reality":
        "Trabalho que aprofunda o som pesado e sombrio do Black Sabbath, com riffs densos e forte influência sobre o metal posterior.",


    // ==================================================
    // IRON MAIDEN
    // ==================================================

    "Iron Maiden|The Number of the Beast":
        "Álbum que consolidou o Iron Maiden como uma das grandes bandas da New Wave of British Heavy Metal, com vocais poderosos e guitarras marcantes.",

    "Iron Maiden|Piece of Mind":
        "Trabalho que mantém a identidade épica do Iron Maiden, combinando narrativas históricas, riffs rápidos e melodias elaboradas.",

    "Iron Maiden|Powerslave":
        "Álbum conhecido por sua atmosfera épica e por explorar temas históricos e mitológicos através do heavy metal.",


    // ==================================================
    // LED ZEPPELIN
    // ==================================================

    "Led Zeppelin|Led Zeppelin":
        "Álbum de estreia que apresenta a mistura de blues, rock pesado e experimentação que se tornaria característica do Led Zeppelin.",

    "Led Zeppelin|Led Zeppelin II":
        "Segundo álbum da banda, marcado por riffs poderosos e uma combinação de blues e hard rock que influenciou gerações.",

    "Led Zeppelin|Led Zeppelin IV":
        "Um dos trabalhos mais conhecidos do Led Zeppelin, reunindo diferentes influências e algumas das músicas mais famosas da banda.",

    "Led Zeppelin|Physical Graffiti":
        "Álbum duplo que reúne diferentes momentos e estilos do Led Zeppelin, explorando blues, rock, folk e experimentações sonoras.",


    // ==================================================
    // THE ROLLING STONES
    // ==================================================

    "The Rolling Stones|Let It Bleed":
        "Álbum que combina blues, rock e elementos country, representando uma fase importante da evolução musical dos Rolling Stones.",

    "The Rolling Stones|Sticky Fingers":
        "Trabalho conhecido por sua mistura de blues, rock e soul, além de apresentar algumas das composições mais marcantes dos Rolling Stones.",

    "The Rolling Stones|Exile on Main St.":
        "Álbum duplo com uma sonoridade ampla e influenciada por blues, rock, country e gospel.",


    // ==================================================
    // THE DOORS
    // ==================================================

    "The Doors|The Doors":
        "Álbum de estreia que apresenta a combinação de rock psicodélico, blues e a presença vocal característica de Jim Morrison.",

    "The Doors|Strange Days":
        "Segundo álbum do The Doors, explorando atmosferas psicodélicas, letras surrealistas e diferentes texturas sonoras.",

    "The Doors|L.A. Woman":
        "Um dos trabalhos finais do The Doors, marcado por uma forte influência do blues e por uma sonoridade mais crua.",


    // ==================================================
    // DAVID BOWIE
    // ==================================================

    "David Bowie|The Rise and Fall of Ziggy Stardust and the Spiders from Mars":
        "Álbum conceitual que apresenta o personagem Ziggy Stardust e combina glam rock, ficção e uma estética marcante.",

    "David Bowie|Hunky Dory":
        "Trabalho que mostra Bowie explorando diferentes estilos e personagens, com composições sofisticadas e forte identidade artística.",


    // ==================================================
    // THE CLASH
    // ==================================================

    "The Clash|London Calling":
        "Álbum que amplia os limites do punk ao incorporar reggae, ska, rockabilly e outros estilos, criando uma das obras mais diversas da banda.",


    // ==================================================
    // THE CURE
    // ==================================================

    "The Cure|Disintegration":
        "Álbum marcado por atmosferas melancólicas, sintetizadores e guitarras envolventes, representando uma fase importante da sonoridade do The Cure.",


    // ==================================================
    // JOY DIVISION
    // ==================================================

    "Joy Division|Unknown Pleasures":
        "Álbum de estreia conhecido por sua atmosfera sombria, baixo marcante e abordagem experimental que influenciou o pós-punk.",


    // ==================================================
    // R.E.M.
    // ==================================================

    "R.E.M.|Automatic for the People":
        "Trabalho introspectivo que combina rock alternativo, arranjos acústicos e letras sobre temas pessoais e sociais.",


    // ==================================================
    // THE STROKES
    // ==================================================

    "The Strokes|Is This It":
        "Álbum de estreia que ajudou a renovar o rock de garagem no início dos anos 2000, com guitarras diretas e produção enxuta.",


    // ==================================================
    // THE WHITE STRIPES
    // ==================================================

    "The White Stripes|Elephant":
        "Álbum que combina blues, garage rock e riffs marcantes, apresentando uma das fases mais conhecidas da dupla.",


    // ==================================================
    // U2
    // ==================================================

    "U2|The Joshua Tree":
        "Álbum que combina rock e elementos de música americana, com letras que abordam questões sociais, políticas e espirituais.",


    // ==================================================
    // GREEN DAY
    // ==================================================

    "Green Day|Dookie":
        "Álbum que levou o Green Day a um grande público, combinando punk rock, melodias acessíveis e letras sobre juventude e cotidiano.",

    "Green Day|American Idiot":
        "Álbum conceitual que apresenta uma narrativa sobre juventude, alienação e sociedade através de uma abordagem mais ambiciosa do punk rock.",


    // ==================================================
    // BLINK-182
    // ==================================================

    "blink-182|Enema of the State":
        "Álbum que consolidou o blink-182 no pop punk, combinando músicas rápidas, melodias pegajosas e letras bem-humoradas.",


    // ==================================================
    // JAZZ
    // ==================================================

    "Miles Davis|Kind of Blue":
        "Um dos álbuns mais influentes do jazz, conhecido por sua abordagem modal, improvisações e performances marcantes.",

    "Miles Davis|Bitches Brew":
        "Álbum experimental que mistura jazz, rock e elementos elétricos, sendo uma obra importante do jazz fusion.",

    "Dave Brubeck|Time Out":
        "Álbum conhecido por explorar diferentes compassos e estruturas rítmicas, combinando experimentação com melodias acessíveis.",

    "John Coltrane|A Love Supreme":
        "Suíte em quatro partes que apresenta uma abordagem espiritual e profundamente expressiva do jazz de John Coltrane.",

    "John Coltrane|Blue Train":
        "Um dos trabalhos mais conhecidos de John Coltrane, combinando hard bop, improvisação e performances marcantes.",

    "Charles Mingus|Mingus Ah Um":
        "Álbum que combina composição sofisticada, improvisação e diferentes influências do jazz, blues e gospel.",

    "Ella Fitzgerald & Louis Armstrong|Ella and Louis":
        "Colaboração entre duas grandes vozes do jazz, marcada por interpretações de standards e uma atmosfera intimista.",

    "Cannonball Adderley|Somethin' Else":
        "Álbum de hard bop conhecido pelas performances de Cannonball Adderley e Miles Davis e por suas improvisações marcantes.",

    "Herbie Hancock|Head Hunters":
        "Trabalho fundamental do jazz fusion e funk, combinando instrumentos elétricos, grooves e experimentação.",

    "Stan Getz & João Gilberto|Getz/Gilberto":
        "Álbum que ajudou a popularizar a bossa nova internacionalmente através da colaboração entre Stan Getz e João Gilberto.",

    "Sonny Rollins|Saxophone Colossus":
        "Um dos trabalhos mais conhecidos de Sonny Rollins, apresentando improvisações e composições fundamentais do hard bop.",

    "Ornette Coleman|The Shape of Jazz to Come":
        "Álbum que rompeu com algumas estruturas tradicionais do jazz e se tornou uma referência importante para o desenvolvimento do free jazz."
};


// ======================================================
// FUNÇÃO PARA PEGAR A DESCRIÇÃO
// ======================================================

function obterDescricao(artista, album) {

    const chave = `${artista}|${album}`

    if (descricoes[chave]) {
        return descricoes[chave]
    }

    // Descrição automática caso algum produto ainda
    // não tenha sido cadastrado acima.
    return `${album} é um trabalho de ${artista}, lançado em sua respectiva fase da carreira, reunindo características marcantes de sua sonoridade e identidade artística.`
}


// ======================================================
// ALIASES PARA BUSCA DAS CAPAS
// ======================================================

const aliasesArtistas = {
    "Piny Floyd": "Pink Floyd",
    "Pink Floyd": "Pink Floyd"
}

function obterArtistaParaCapa(artista) {
    return aliasesArtistas[artista] || artista
}


module.exports = {
    obterDescricao,
    obterArtistaParaCapa
}