var resultadoModel = require("../models/resultadoModel");

const TETO_PONTOS = {
    logica: 91,
    trauma: 59,
    brutalidade: 85,
    influencia: 94,
    intimidacao: 78,
    moralidade: 89
};

function normalizarPontuacao(bruta) {
    return {
        logica: Math.min(100, Math.round((bruta.logica / TETO_PONTOS.logica) * 100)),
        trauma: Math.min(100, Math.round((bruta.trauma / TETO_PONTOS.trauma) * 100)),
        brutalidade: Math.min(100, Math.round((bruta.brutalidade / TETO_PONTOS.brutalidade) * 100)),
        influencia: Math.min(100, Math.round((bruta.influencia / TETO_PONTOS.influencia) * 100)),
        intimidacao: Math.min(100, Math.round((bruta.intimidacao / TETO_PONTOS.intimidacao) * 100)),
        moralidade: Math.min(100, Math.round((bruta.moralidade / TETO_PONTOS.moralidade) * 100))
    };
}

function calcularAfinidades(statsUsuario, listaPersonagens) {
    const ranking = listaPersonagens.map(personagem => {
        const diffTotal =
            Math.abs(statsUsuario.logica - personagem.logica) +
            Math.abs(statsUsuario.trauma - personagem.trauma) +
            Math.abs(statsUsuario.brutalidade - personagem.brutalidade) +
            Math.abs(statsUsuario.influencia - personagem.influencia) +
            Math.abs(statsUsuario.intimidacao - personagem.intimidacao) +
            Math.abs(statsUsuario.moralidade - personagem.moralidade);

        const diffMedia = diffTotal / 6;
        const afinidade = Math.max(0, Math.round(100 - diffMedia));

        return {
            idPersonagem: personagem.idPersonagem,
            nome: personagem.nome,
            alinhamento: personagem.alinhamento,
            imagemUrl: personagem.imagemUrl,
            tags: personagem.tags,
            descricao: personagem.descricao,
            afinidade: afinidade,
            atributos: {
                logica: personagem.logica,
                trauma: personagem.trauma,
                brutalidade: personagem.brutalidade,
                influencia: personagem.influencia,
                intimidacao: personagem.intimidacao,
                moralidade: personagem.moralidade
            }
        };
    });

    return ranking.sort((a, b) => b.afinidade - a.afinidade);
}

async function cadastrar(req, res) {
    var idUsuario = req.body.idUsuario;
    var pontuacoesBrutas = req.body.pontuacoes;

    if (!idUsuario || !pontuacoesBrutas) {
        return res.status(400).send("Dados do usuário ou pontuações ausentes.");
    }

    try {
        const statsNormalizados = normalizarPontuacao(pontuacoesBrutas);
        const personagens = await resultadoModel.buscarGabaritoPersonagens();
        const ranking = calcularAfinidades(statsNormalizados, personagens);

        const maisSimilar = ranking[0];

        await resultadoModel.cadastrar(idUsuario, maisSimilar.idPersonagem, statsNormalizados);
        res.status(201).json({ mensagem: "Resultado salvo com sucesso!", match: maisSimilar.nome });
    } catch (erro) {
        console.error("Erro ao cadastrar resultado:", erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

async function obterDashboard(req, res) {
    var idUsuario = req.params.idUsuario;

    try {
        const resultados = await resultadoModel.buscarUltimoPorUsuario(idUsuario);

        if (resultados.length === 0) {
            return res.status(204).send("Nenhum quiz realizado por este usuário.");
        }

        const ultimoQuiz = resultados[0];
        const statsUsuario = {
            logica: ultimoQuiz.logica,
            trauma: ultimoQuiz.trauma,
            brutalidade: ultimoQuiz.brutalidade,
            influencia: ultimoQuiz.influencia,
            intimidacao: ultimoQuiz.intimidacao,
            moralidade: ultimoQuiz.moralidade
        };

        const personagens = await resultadoModel.buscarGabaritoPersonagens();
        const ranking = calcularAfinidades(statsUsuario, personagens);

        res.status(200).json({
            statsUsuario: statsUsuario,
            similar: ranking[0],
            outros: ranking.slice(1, ranking.length - 1),
            oposto: ranking[ranking.length - 1]
        });
    } catch (erro) {
        console.error("Erro ao carregar dados da dashboard:", erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports = {
    cadastrar,
    obterDashboard
};