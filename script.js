console.log("GameLog funcionando!");


// ==============================
// CONFIGURAÇÕES
// ==============================

const API_KEY = "5bd24c4fdd2b410babf0136e7d09aa0d";

const pesquisa =
    document.getElementById("pesquisa");

const botaoPesquisar =
    document.getElementById("botaoPesquisar");

const resultados =
    document.getElementById("resultados");

const biblioteca =
    document.getElementById("biblioteca");

const filtroStatus =
    document.getElementById("filtroStatus");

const totalJogos =
    document.getElementById("totalJogos");

const jogosZerados =
    document.getElementById("jogosZerados");

const jogosJogando =
    document.getElementById("jogosJogando");

const jogosQueroJogar =
    document.getElementById("jogosQueroJogar");

const mediaNotas =
    document.getElementById("mediaNotas");


// ==============================
// ELEMENTOS DA JANELA DE EDIÇÃO
// ==============================

const janelaEdicao =
    document.getElementById("janelaEdicao");

const nomeJogoEdicao =
    document.getElementById("nomeJogoEdicao");

const notaEdicao =
    document.getElementById("notaEdicao");

const statusEdicao =
    document.getElementById("statusEdicao");

const salvarEdicao =
    document.getElementById("salvarEdicao");

const cancelarEdicao =
    document.getElementById("cancelarEdicao");


// ==============================
// JOGOS SALVOS
// ==============================

let jogosSalvos =
    JSON.parse(localStorage.getItem("jogos")) || [];


// ==============================
// BOTÃO PESQUISAR
// ==============================

botaoPesquisar.addEventListener("click", function() {

    pesquisarJogo(pesquisa.value);

});


// ==============================
// PESQUISAR JOGO NA RAWG
// ==============================

async function pesquisarJogo(nome) {

    if (nome.trim() === "") {

        return;

    }


    const resposta = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(nome)}`
    );


    const dados = await resposta.json();


    const jogos = dados.results;


    console.log(jogos);


    if (!jogos || jogos.length === 0) {

        resultados.innerHTML = `
            <p style="color:white;">
                Nenhum jogo encontrado.
            </p>
        `;

        return;

    }


    // ==============================
    // MOSTRAR VÁRIOS RESULTADOS
    // ==============================

    resultados.innerHTML = jogos
        .slice(0, 10)
        .map(function(jogo) {

            return `

                <div class="card resultadoJogo">

                    <img
                        src="${jogo.background_image || ""}"
                        alt="Capa de ${jogo.name}"
                    >

                    <h2>${jogo.name}</h2>

                    <button class="selecionarJogo">
                        🎮 Selecionar
                    </button>

                </div>

            `;

        })
        .join("");


    // ==============================
    // BOTÕES SELECIONAR
    // ==============================

    const botoesSelecionar =
        document.querySelectorAll(".selecionarJogo");


    botoesSelecionar.forEach(
        function(botao, indice) {

            botao.addEventListener(
                "click",
                function() {

                    const jogoSelecionado =
                        jogos[indice];


                    mostrarJogoSelecionado(
                        jogoSelecionado
                    );

                }
            );

        }
    );

}


// ==============================
// MOSTRAR JOGO SELECIONADO
// ==============================

function mostrarJogoSelecionado(jogo) {

    resultados.innerHTML = `

        <div class="card">

            <img
                src="${jogo.background_image}"
                alt="Capa de ${jogo.name}"
            >

            <h2>${jogo.name}</h2>


            <div class="estrelas">

                <span class="estrela">★</span>
                <span class="estrela">★</span>
                <span class="estrela">★</span>
                <span class="estrela">★</span>
                <span class="estrela">★</span>

            </div>


            <p class="nota">
                Nota: 0/10
            </p>


            <select class="status">

                <option value="quero-jogar">
                    📋 Quero jogar
                </option>

                <option value="jogando">
                    🎮 Jogando
                </option>

                <option value="zerado">
                    ✅ Zerado
                </option>

            </select>


            <button class="salvarJogo">
                💾 Salvar jogo
            </button>

        </div>

    `;


    // ==============================
    // ESTRELAS
    // ==============================

    const estrelas =
        document.querySelectorAll(".estrela");

    const textoNota =
        document.querySelector(".nota");

    let nota = 0;


    estrelas.forEach(
        function(estrela, indice) {

            estrela.addEventListener(
                "click",
                function() {

                    nota = indice + 1;


                    const nota10 =
                        nota * 2;


                    textoNota.textContent =
                        `Nota: ${nota10}/10`;


                    estrelas.forEach(
                        function(
                            estrela,
                            indiceEstrela
                        ) {

                            if (
                                indiceEstrela <= indice
                            ) {

                                estrela.style.color =
                                    "#ffd700";

                            } else {

                                estrela.style.color =
                                    "#555";

                            }

                        }
                    );

                }
            );

        }
    );


    // ==============================
    // STATUS
    // ==============================

    const status =
        document.querySelector(".status");


    // ==============================
    // BOTÃO SALVAR
    // ==============================

    const botaoSalvar =
        document.querySelector(".salvarJogo");


botaoSalvar.addEventListener(
    "click",
    function() {

        const jogoSalvo = {

            nome: jogo.name,

            capa: jogo.background_image,

            estrelas: nota,

            nota: nota * 2,

            status: status.value

        };


            // ==============================
            // VERIFICAR SE JÁ EXISTE
            // ==============================

            const jogoExistente =
                jogosSalvos.find(
                    function(item) {

                        return (
                            item.nome ===
                            jogoSalvo.nome
                        );

                    }
                );


            // ==============================
            // ATUALIZAR JOGO EXISTENTE
            // ==============================

            if (jogoExistente) {

                jogoExistente.estrelas =
                    jogoSalvo.estrelas;

                jogoExistente.nota =
                    jogoSalvo.nota;

                jogoExistente.status =
                    jogoSalvo.status;

            }


            // ==============================
            // ADICIONAR NOVO JOGO
            // ==============================

            else {

                jogosSalvos.push(jogoSalvo);

            }


            // ==============================
            // SALVAR NO NAVEGADOR
            // ==============================

            localStorage.setItem(
                "jogos",
                JSON.stringify(jogosSalvos)
            );


            // ==============================
            // ATUALIZAR BIBLIOTECA
            // ==============================

mostrarBiblioteca();
atualizarEstatisticas();


// Limpa a pesquisa

pesquisa.value = "";

resultados.innerHTML = "";


console.log("Jogo salvo!");
        }
    );

}

// ==============================
// ESTATÍSTICAS
// ==============================

function atualizarEstatisticas() {

    const total =
        jogosSalvos.length;

    const zerados =
        jogosSalvos.filter(function(jogo) {
            return jogo.status === "zerado";
        }).length;

    const jogando =
        jogosSalvos.filter(function(jogo) {
            return jogo.status === "jogando";
        }).length;

    const queroJogar =
        jogosSalvos.filter(function(jogo) {
            return jogo.status === "quero-jogar";
        }).length;


    let media = 0;

    if (total > 0) {

        const soma =
            jogosSalvos.reduce(function(total, jogo) {
                return total + jogo.nota;
            }, 0);

        media =
            soma / total;

    }


    totalJogos.textContent =
        total;

    jogosZerados.textContent =
        zerados;

    jogosJogando.textContent =
        jogando;

    jogosQueroJogar.textContent =
        queroJogar;

    mediaNotas.textContent =
        media.toFixed(1) + "/10";
}


// ==============================
// REMOVER DUPLICADOS
// ==============================

function removerDuplicados() {

    const jogosUnicos = [];


    jogosSalvos.forEach(
        function(jogo) {

            const jaExiste =
                jogosUnicos.find(
                    function(item) {

                        return (
                            item.nome ===
                            jogo.nome
                        );

                    }
                );


            if (!jaExiste) {

                jogosUnicos.push(jogo);

            }

        }
    );


    jogosSalvos =
        jogosUnicos;


    localStorage.setItem(
        "jogos",
        JSON.stringify(jogosSalvos)
    );

}


// ==============================
// MOSTRAR BIBLIOTECA
// ==============================

function mostrarBiblioteca() {

    biblioteca.innerHTML = "";


    const filtro =
        filtroStatus.value;


    const jogosFiltrados =
        jogosSalvos.filter(
            function(jogo) {

                if (filtro === "todos") {

                    return true;

                }


                return (
                    jogo.status ===
                    filtro
                );

            }
        );


    jogosFiltrados.forEach(
        function(jogo) {

            biblioteca.innerHTML += `

                <div class="card">

                    <img
                        src="${jogo.capa}"
                        alt="Capa de ${jogo.nome}"
                    >

                    <h2>${jogo.nome}</h2>


                    <div class="estrelasBiblioteca">

                        ${"★".repeat(jogo.estrelas)}

                        ${"☆".repeat(
                            5 - jogo.estrelas
                        )}

                    </div>


                    <p class="notaBiblioteca">

                        ${jogo.nota}/10

                    </p>


                    <p class="statusBiblioteca ${jogo.status}">

                        ${
                            jogo.status === "zerado"

                                ? "✅ Zerado"

                                : jogo.status === "jogando"

                                    ? "🎮 Jogando"

                                    : "📋 Quero jogar"
                        }

                    </p>


                    <div class="botoesCard">

                        <button
                            type="button"
                            class="removerJogo"
                            onclick="removerJogo('${jogo.nome.replace(/'/g, "\\'")}')"
                        >
                            🗑️ Remover
                        </button>


                        <button
                            class="editarJogo"
                            onclick="editarJogo('${jogo.nome}')"
                        >
                            ✏️ Editar
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


// ==============================
// FILTRO
// ==============================

filtroStatus.addEventListener(
    "change",
    function() {

        mostrarBiblioteca();

    }
);


// ==============================
// REMOVER JOGO
// ==============================

function removerJogo(nome) {

    const confirmar =
        confirm(
            `Tem certeza que deseja remover "${nome}" da sua biblioteca?`
        );


    jogosSalvos =
        jogosSalvos.filter(
            function(jogo) {

                return (
                    jogo.nome !==
                    nome
                );

            }
        );


    localStorage.setItem(
        "jogos",
        JSON.stringify(jogosSalvos)
    );


    mostrarBiblioteca();
    atualizarEstatisticas();

}


// ==============================
// EDITAR JOGO
// ==============================

function editarJogo(nome) {

    const jogo =
        jogosSalvos.find(
            function(jogo) {

                return (
                    jogo.nome ===
                    nome
                );

            }
        );


    if (!jogo) {

        return;

    }


    nomeJogoEdicao.textContent =
        jogo.nome;


    notaEdicao.value =
        jogo.nota;


    statusEdicao.value =
        jogo.status;


    janelaEdicao.style.display =
        "flex";

}


// ==============================
// SALVAR EDIÇÃO
// ==============================

salvarEdicao.addEventListener(
    "click",
    function() {

        const nome =
            nomeJogoEdicao.textContent;


        const jogo =
            jogosSalvos.find(
                function(jogo) {

                    return (
                        jogo.nome ===
                        nome
                    );

                }
            );


        if (!jogo) {

            return;

        }


        const novaNota =
            Number(notaEdicao.value);


        if (
            isNaN(novaNota) ||
            novaNota < 0 ||
            novaNota > 10
        ) {

            alert(
                "Digite uma nota entre 0 e 10."
            );

            return;

        }


        jogo.nota =
            novaNota;


        jogo.estrelas =
            novaNota / 2;


        jogo.status =
            statusEdicao.value;


        localStorage.setItem(
            "jogos",
            JSON.stringify(jogosSalvos)
        );


        janelaEdicao.style.display =
            "none";


        mostrarBiblioteca();
        atualizarEstatisticas();
    }
);


// ==============================
// CANCELAR EDIÇÃO
// ==============================

cancelarEdicao.addEventListener(
    "click",
    function() {

        janelaEdicao.style.display =
            "none";

    }
);


// ==============================
// INICIALIZAÇÃO
// ==============================

removerDuplicados();

mostrarBiblioteca();

atualizarEstatisticas();