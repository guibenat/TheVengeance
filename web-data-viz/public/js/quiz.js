let pontuacaoQuiz = {
    logica: 0,
    trauma: 0,
    brutalidade: 0,
    influencia: 0,
    intimidacao: 0,
    moralidade: 0
};

let indicePerguntaAtual = 0;

const iconesCaracteristicas = {
    Moralidade: "./assets/icon/moralidade.png",
    Lógica: "./assets/icon/logica.png",
    Influência: "./assets/icon/influencia.png",
    Trauma: "./assets/icon/trauma.png",
    Intimidação: "./assets/icon/intimidacao.png",
    Brutalidade: "./assets/icon/brutalidade.png"
};

// Perguntas
const perguntas = [
    {
        caracteristica: "Moralidade",
        texto: "Você descobre que um aliado de confiança está vendendo informações para a máfia. O que você faz?",
        respostas: [
            { texto: "Confronto-o diretamente para entender o motivo e dou uma chance de ele consertar o erro.", impacto: { moralidade: 10, influencia: 5 } },
            { texto: "Faço uma emboscada. Ele sai com ossos quebrados para servir de exemplo aos outros.", impacto: { brutalidade: 10, trauma: 5 } },
            { texto: "Uso as provas da traição para chantageá-lo. Agora ele trabalha para mim em dobro.", impacto: { influencia: 10, intimidacao: 8 } },
            { texto: "Não digo nada. Passo a alimentá-lo com informações falsas para desmantelar a máfia por dentro.", impacto: { logica: 10, intimidacao: 2 } }
        ]
    },
    {
        caracteristica: "Lógica",
        texto: "O Charada tranca você em uma sala com uma bomba e um refém. Faltam 2 minutos. Sua ação:",
        respostas: [
            { texto: "Ignoro o pânico, analiso o circuito e resolvo o enigma lógico antes do tempo zerar.", impacto: { logica: 10, moralidade: 2 } },
            { texto: "Acalmo o refém, encontro uma saída estrutural e tiro nós dois da sala.", impacto: { influencia: 8, moralidade: 10 } },
            { texto: "Explodo a dobradiça da porta com uma carga própria e saio puxando o refém.", impacto: { brutalidade: 8, trauma: 5 } },
            { texto: "Aciono meus contatos do submundo pelo rádio para forçar quem montou a bomba a dar o código.", impacto: { influencia: 10, intimidacao: 5 } }
        ]
    },
    {
        caracteristica: "Influência",
        texto: "Você precisa entrar no Iceberg Lounge para recuperar um arquivo sigiloso no cofre VIP.",
        respostas: [
            { texto: "Corto a energia do quarteirão, invado pelos dutos e pego o arquivo sem ser visto.", impacto: { logica: 10, intimidacao: 5 } },
            { texto: "Entro pela porta da frente derrubando os seguranças e arrombo o cofre na força.", impacto: { brutalidade: 10, trauma: 8 } },
            { texto: "Suborno o gerente do clube para me entregar o arquivo sem disparar um único alarme.", impacto: { influencia: 10, logica: 5 } },
            { texto: "Falsifico um convite VIP, uso minha lábia na segurança e copio os dados discretamente.", impacto: { influencia: 8, moralidade: 5 } }
        ]
    },
    {
        caracteristica: "Trauma",
        texto: "Você encurrala o responsável pelas maiores perdas do seu passado. Ele está desarmado e rindo.",
        respostas: [
            { texto: "Controlo a raiva e o entrego às autoridades. Não vou cruzar essa linha.", impacto: { moralidade: 10, logica: 5 } },
            { texto: "Atiro no joelho dele. Ele vai sobreviver, mas nunca mais vai esquecer o que fez.", impacto: { brutalidade: 10, trauma: 10 } },
            { texto: "Começo a rir junto com ele. A justiça é uma piada e o caos é a única resposta.", impacto: { trauma: 10, brutalidade: 8 } },
            { texto: "Tranco-o em um galpão para usá-lo como informante forçado sobre o submundo.", impacto: { intimidacao: 10, influencia: 8 } }
        ]
    },
    {
        caracteristica: "Intimidação",
        texto: "Uma fuga em massa de Arkham coloca Gotham no caos. Qual é a sua prioridade imediata?",
        respostas: [
            { texto: "Assumir o controle dos territórios e lucrar com a desordem nas ruas.", impacto: { influencia: 10, brutalidade: 5 } },
            { texto: "Proteger os civis e montar perímetros seguros de evacuação.", impacto: { moralidade: 10, influencia: 5 } },
            { texto: "Caçar os líderes da fuga nas sombras e espalhar o pavor para que se rendam.", impacto: { intimidacao: 10, trauma: 5 } },
            { texto: "Rastrear o padrão de invasão nos servidores de Arkham para prever o próximo ataque.", impacto: { logica: 10, influencia: 3 } }
        ]
    },
    {
        caracteristica: "Brutalidade",
        texto: "Um informante de rua tenta te enganar e te leva para uma emboscada armada.",
        respostas: [
            { texto: "Desarmo o grupo com golpes precisos e imobilizo todos sem ferimentos letais.", impacto: { moralidade: 8, logica: 6 } },
            { texto: "Uso força máxima, quebro ossos e deixo o informante por último para interrogatório.", impacto: { brutalidade: 10, intimidacao: 8 } },
            { texto: "Eu já sabia da armadilha e cerquei o quarteirão antes mesmo de entrar no beco.", impacto: { logica: 10, influencia: 4 } },
            { texto: "Compro a lealdade dos atiradores na hora oferecendo o dobro do que o informante pagou.", impacto: { influencia: 10, intimidacao: 4 } }
        ]
    },
    {
        caracteristica: "Lógica",
        texto: "Você intercepta uma transmissão criptografada sobre um carregamento ilegal nas docas.",
        respostas: [
            { texto: "Decodifico o algoritmo na minha base para descobrir o mandante antes de agir.", impacto: { logica: 10, moralidade: 4 } },
            { texto: "Vou direto às docas e interrogo os estivadores pendurando-os sobre a água.", impacto: { intimidacao: 10, brutalidade: 6 } },
            { texto: "Aviso meus aliados para interceptarmos o carregamento juntos em equipe.", impacto: { moralidade: 8, influencia: 8 } },
            { texto: "Intercepto a carga para mim e revendo no mercado negro de Gotham.", impacto: { influencia: 10, trauma: 4 } }
        ]
    },
    {
        caracteristica: "Moralidade",
        texto: "Um jovem recrutado por uma gangue por desespero financeiro pede clemência após ser rendido.",
        respostas: [
            { texto: "Dou um aviso firme, deixo ele ir e garanto anonimamente um emprego honesto.", impacto: { moralidade: 10, influencia: 6 } },
            { texto: "Ninguém recebe tratamento especial nas ruas. Ele paga pelo crime como qualquer outro.", impacto: { brutalidade: 8, trauma: 6 } },
            { texto: "Transformo o garoto nos meus olhos e ouvidos dentro da gangue dele.", impacto: { logica: 8, intimidacao: 6 } },
            { texto: "Faço ele trabalhar na minha folha de pagamento para pagar a dívida com juros.", impacto: { influencia: 10, intimidacao: 5 } }
        ]
    },
    {
        caracteristica: "Trauma",
        texto: "Exposto a um alucinógeno, suas piores memórias e culpas começam a tomar conta da sua mente.",
        respostas: [
            { texto: "Uso disciplina mental e lógica para isolar a toxina e retomar o controle.", impacto: { logica: 10, moralidade: 5 } },
            { texto: "Canalizo toda a dor e o trauma do passado em fúria pura para esmagar o inimigo.", impacto: { trauma: 10, brutalidade: 8 } },
            { texto: "Abraço a loucura das visões e uso o imprevisível para confundir meu oponente.", impacto: { trauma: 10, intimidacao: 6 } },
            { texto: "Confio no meu treinamento e na memória daqueles que juraram proteger a cidade comigo.", impacto: { moralidade: 8, influencia: 6 } }
        ]
    },
    {
        caracteristica: "Intimidação",
        texto: "Como você prefere que os criminosos de Gotham enxerguem a sua presença na cidade?",
        respostas: [
            { texto: "Como um símbolo de esperança e justiça para quem precisa de proteção.", impacto: { moralidade: 10, influencia: 8 } },
            { texto: "Como uma lenda urbana aterrorizante que espreita em cada sombra.", impacto: { intimidacao: 10, logica: 6 } },
            { texto: "Como uma ameaça letal e implacável que não dá segunda chance.", impacto: { brutalidade: 10, trauma: 6 } },
            { texto: "Como a mente intocável que controla todas as peças do tabuleiro.", impacto: { influencia: 10, logica: 8 } }
        ]
    }
];

function carregarProgressoSalvo() {
    const pontuacaoSalva = sessionStorage.getItem('pontuacaoParcial');
    const indiceSalvo = sessionStorage.getItem('indicePerguntaAtual');

    if (pontuacaoSalva && indiceSalvo !== null) {
        const indiceNumerico = Number(indiceSalvo);
        if (indiceNumerico < perguntas.length) {
            pontuacaoQuiz = JSON.parse(pontuacaoSalva);
            indicePerguntaAtual = indiceNumerico;
        }
    }
}

function renderizarPergunta() {
    const perguntaAtual = perguntas[indicePerguntaAtual];
    const iconeElemento = document.getElementById('icone-caracteristica');

    // Atualiza imagem e nome da característica
    iconeElemento.classList.remove('oculto');
    iconeElemento.src = iconesCaracteristicas[perguntaAtual.caracteristica];
    iconeElemento.alt = `Ícone ${perguntaAtual.caracteristica}`;

    document.getElementById('texto-caracteristica').innerText = perguntaAtual.caracteristica;
    document.getElementById('texto-pergunta').innerText = perguntaAtual.texto;

    const segmentos = document.querySelectorAll('.segmento');
    segmentos.forEach((segmento, index) => {
        if (index <= indicePerguntaAtual) {
            segmento.classList.add('ativo');
        } else {
            segmento.classList.remove('ativo');
        }
    });

    const caixaAlternativas = document.getElementById('caixa-alternativas');
    caixaAlternativas.innerHTML = '';

    perguntaAtual.respostas.forEach(resposta => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.classList.add('btn-resposta');
        botao.innerHTML = `
            <span>${resposta.texto}</span>
            <span class="radio-indicador"></span>
        `;
        botao.addEventListener('click', () => registrarResposta(resposta.impacto));
        caixaAlternativas.appendChild(botao);
    });
}
function registrarResposta(impacto) {
    for (let traco in impacto) {
        pontuacaoQuiz[traco] += impacto[traco];
    }
    indicePerguntaAtual++;
    sessionStorage.setItem('pontuacaoParcial', JSON.stringify(pontuacaoQuiz));
    sessionStorage.setItem('indicePerguntaAtual', indicePerguntaAtual);

    if (indicePerguntaAtual < perguntas.length) {
        renderizarPergunta();
    } else {
        finalizarQuiz();
    }
}
async function finalizarQuiz() {
    document.getElementById('icone-caracteristica').classList.add('oculto');
    document.getElementById('texto-caracteristica').innerText = "Concluído";
    document.getElementById('texto-pergunta').innerText = "Processando perfil psicológico e compatibilidade...";
    document.getElementById('caixa-alternativas').innerHTML = '';

    sessionStorage.removeItem('pontuacaoParcial');
    sessionStorage.removeItem('indicePerguntaAtual');

    console.log("Pontuação Final:", pontuacaoQuiz);
    try {
        const resposta = await fetch('/resultados/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuario: sessionStorage.ID_USUARIO,
                pontuacoes: pontuacaoQuiz
            })
        });

        if (resposta.ok) {
            window.location.href = './dashboard.html';
        }
    } catch (erro) {
        console.error("Erro ao enviar resultado do quiz:", erro);
    }
}

document.getElementById('btn-reiniciar').addEventListener('click', () => {
    pontuacaoQuiz = {
        logica: 0,
        trauma: 0,
        brutalidade: 0,
        influencia: 0,
        intimidacao: 0,
        moralidade: 0
    };
    indicePerguntaAtual = 0;

    sessionStorage.removeItem('pontuacaoParcial');
    sessionStorage.removeItem('indicePerguntaAtual');

    renderizarPergunta();
});

carregarProgressoSalvo();
renderizarPergunta();