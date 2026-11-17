var database = require("../database/config");

function buscarGabaritoPersonagens() {
    var instrucaoSql = `
        SELECT 
            p.idPersonagem,
            p.nome,
            p.alinhamento,
            p.imagemUrl,
            p.tags,
            p.descricao,
            a.logica,
            a.trauma,
            a.brutalidade,
            a.influencia,
            a.intimidacao,
            a.moralidade
        FROM personagem p
        INNER JOIN atributo_personagem a ON p.idPersonagem = a.fkPersonagem;
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(fkUsuario, fkPersonagemSimilar, stats) {
    var instrucaoSql = `
        INSERT INTO resultado_quiz 
            (fkUsuario, fkPersonagemSimilar, logica, trauma, brutalidade, influencia, intimidacao, moralidade) 
        VALUES 
            (${fkUsuario}, ${fkPersonagemSimilar}, ${stats.logica}, ${stats.trauma}, ${stats.brutalidade}, ${stats.influencia}, ${stats.intimidacao}, ${stats.moralidade});
    `;
    return database.executar(instrucaoSql);
}

function buscarUltimoPorUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT 
            idResultado,
            fkUsuario,
            fkPersonagemSimilar,
            logica,
            trauma,
            brutalidade,
            influencia,
            intimidacao,
            moralidade,
            dtRealizacao
        FROM resultado_quiz
        WHERE fkUsuario = ${idUsuario}
        ORDER BY dtRealizacao DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarGabaritoPersonagens,
    cadastrar,
    buscarUltimoPorUsuario
};