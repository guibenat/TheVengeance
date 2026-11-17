const CONFIG_CARACTERISTICAS = [
    { chave: "moralidade", rotulo: "Moralidade", classeCor: "cor-moralidade", icone: "./assets/icon/moralidade.png" },
    { chave: "logica", rotulo: "Lógica", classeCor: "cor-logica", icone: "./assets/icon/logica.png" },
    { chave: "trauma", rotulo: "Trauma", classeCor: "cor-trauma", icone: "./assets/icon/trauma.png" },
    { chave: "intimidacao", rotulo: "Intimidação", classeCor: "cor-intimidacao", icone: "./assets/icon/intimidacao.png" },
    { chave: "brutalidade", rotulo: "Brutalidade", classeCor: "cor-brutalidade", icone: "./assets/icon/brutalidade.png" },
    { chave: "influencia", rotulo: "Influência", classeCor: "cor-influencia", icone: "./assets/icon/influencia.png" }
];

let instanciaRadarChart = null;

function criarHtmlItemStat(config, valor) {
    const nota = valor ?? 0;
    return `
        <div class="item-stat ${config.classeCor}">
            <div class="stat-info-esq">
                <div class="icone-stat-box">
                    <img src="${config.icone}" alt="${config.rotulo}">
                </div>
                <span class="stat-nome">${config.rotulo}</span>
            </div>
            <div class="stat-progresso-dir">
                <span class="stat-valor">${nota}%</span>
                <div class="trilho-barra">
                    <div class="preenchimento-barra" style="width: ${nota}%"></div>
                </div>
            </div>
        </div>
    `;
}

// Grafico

function renderizarRadarChart(statsUsuario) {
    const ctx = document.getElementById("radarChart").getContext("2d");

    if (instanciaRadarChart) {
        instanciaRadarChart.destroy();
    }

    instanciaRadarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: ["Lógica", "Trauma", "Intimidação", "Brutalidade", "Influência", "Moralidade"],
            datasets: [{
                label: "Persona",
                data: [
                    statsUsuario.logica,
                    statsUsuario.trauma,
                    statsUsuario.intimidacao,
                    statsUsuario.brutalidade,
                    statsUsuario.influencia,
                    statsUsuario.moralidade
                ],
                backgroundColor: "rgba(180, 0, 0, 0.25)",
                borderColor: "#cc1111",
                borderWidth: 2,
                pointBackgroundColor: "#ff2a2a",
                pointBorderColor: "#ff2a2a",
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: "#777777",
                        backdropColor: "transparent",
                        font: { size: 9 }
                    },
                    grid: {
                        color: "rgba(180, 20, 20, 0.28)"
                    },
                    angleLines: {
                        color: "rgba(180, 20, 20, 0.28)"
                    },
                    pointLabels: {
                        color: "#d4d4d4",
                        font: {
                            family: "Barlow Condensed",
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#d4d4d4",
                        usePointStyle: true,
                        pointStyle: "circle",
                        boxWidth: 6,
                        font: {
                            family: "Barlow Condensed",
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function preencherDashboard(dados) {
    const { statsUsuario, similar, outros, oposto } = dados;

    const nomeUsuarioLogado = sessionStorage.NOME_USUARIO || "USUÁRIO";
    document.getElementById("nav-nome-usuario").innerText = nomeUsuarioLogado;

    const navAvatar = document.getElementById("nav-avatar-usuario");
    navAvatar.src = similar.imagemUrl;
    navAvatar.alt = similar.nome;

    const sidebarAvatar = document.getElementById("sidebar-avatar");
    sidebarAvatar.src = similar.imagemUrl;
    sidebarAvatar.alt = similar.nome;

    document.getElementById("sidebar-nome-personagem").innerText = similar.nome;

    const containerTags = document.getElementById("sidebar-tags");
    containerTags.innerHTML = "";
    similar.tags.split(",").forEach(tag => {
        containerTags.innerHTML += `<span class="tag-pill">${tag.trim()}</span>`;
    });

    const listaStatsUsuario = document.getElementById("lista-stats-usuario");
    listaStatsUsuario.innerHTML = CONFIG_CARACTERISTICAS
        .map(cfg => criarHtmlItemStat(cfg, statsUsuario[cfg.chave]))
        .join("");

    const sidebarOthers = document.getElementById("sidebar-others");
    sidebarOthers.innerHTML = outros.slice(0, 3).map(personagem => `
        <div class="item-other-sidebar">
            <div class="other-esq">
                <img src="${personagem.imagemUrl}" alt="${personagem.nome}" class="avatar-mini">
                <span class="nome-other-mini">${personagem.nome}</span>
            </div>
            <span class="pct-other-mini">${personagem.afinidade}%</span>
        </div>
    `).join("");

    const sidebarNemesisAvatar = document.getElementById("sidebar-nemesis-avatar");
    sidebarNemesisAvatar.src = oposto.imagemUrl;
    sidebarNemesisAvatar.alt = oposto.nome;

    document.getElementById("sidebar-nemesis-nome").innerText = oposto.nome;
    document.getElementById("sidebar-nemesis-porcentagem").innerText = `${oposto.afinidade}%`;

    const statsOposto = oposto.atributos || statsUsuario;
    const topDoisAtributosNemesis = [...CONFIG_CARACTERISTICAS]
        .sort((a, b) => statsOposto[b.chave] - statsOposto[a.chave])
        .slice(0, 2);

    document.getElementById("sidebar-nemesis-stats").innerHTML = topDoisAtributosNemesis
        .map(cfg => criarHtmlItemStat(cfg, statsOposto[cfg.chave]))
        .join("");

    const badgeAlinhamento = document.getElementById("similar-badge-alinhamento");
    badgeAlinhamento.innerText = similar.alinhamento === "Vilão" ? "Villain" : "Hero";
    badgeAlinhamento.className = `badge-alinhamento ${similar.alinhamento === "Vilão" ? "vilao" : "hero"}`;

    const similarAvatar = document.getElementById("similar-avatar");
    similarAvatar.src = similar.imagemUrl;
    similarAvatar.alt = similar.nome;

    document.getElementById("similar-nome").innerText = similar.nome;
    document.getElementById("similar-porcentagem").innerText = `${similar.afinidade}%`;

    const statsSimilar = similar.atributos || statsUsuario;
    const ordemGridDireito = ["moralidade", "intimidacao", "logica", "brutalidade", "trauma", "influencia"];
    document.getElementById("grid-stats-similar").innerHTML = ordemGridDireito
        .map(chave => {
            const cfg = CONFIG_CARACTERISTICAS.find(c => c.chave === chave);
            return criarHtmlItemStat(cfg, statsSimilar[chave]);
        })
        .join("");

    renderizarRadarChart(statsUsuario);

    const mainNemesisAvatar = document.getElementById("main-nemesis-avatar");
    mainNemesisAvatar.src = oposto.imagemUrl;
    mainNemesisAvatar.alt = oposto.nome;

    document.getElementById("main-nemesis-nome").innerText = oposto.nome;
    document.getElementById("main-nemesis-descricao").innerText = oposto.descricao;
    document.getElementById("main-nemesis-porcentagem").innerText = `${oposto.afinidade}%`;

    const gridOthersCards = document.getElementById("grid-others-cards");
    gridOthersCards.innerHTML = outros.slice(0, 3).map(personagem => {
        const primeiraTag = personagem.tags.split(",")[0];
        return `
            <div class="card-other-item">
                <img src="${personagem.imagemUrl}" alt="${personagem.nome}" class="avatar-mini">
                <div class="other-card-bottom">
                    <div>
                        <span class="other-subtitulo">${primeiraTag} • ${personagem.alinhamento}</span>
                        <h4 class="other-nome">${personagem.nome}</h4>
                    </div>
                    <span class="other-porcentagem">${personagem.afinidade}%</span>
                </div>
            </div>
        `;
    }).join("");
}

async function inicializarDashboard() {
    const idUsuario = sessionStorage.ID_USUARIO;

    if (!idUsuario) {
        window.location.href = "./login.html";
        return;
    }

    try {
        const resposta = await fetch(`/resultados/dashboard/${idUsuario}`);

        if (resposta.status === 204) {
            window.location.href = "./quiz.html";
            return;
        }

        if (resposta.ok) {
            const dados = await resposta.json();
            preencherDashboard(dados);
        }
    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
    }
}

inicializarDashboard();