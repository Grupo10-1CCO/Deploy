var sidebar = document.getElementById("sidebar");

function botaoMenu(){
    if(sidebar.style.display == "flex"){
        sidebar.style.display = "none";
        console.log("caiu em none");
    }else{
        sidebar.style.display = "flex";
        console.log("caiu em flex");
    }
}

function permissoesAcesso(){
    var cargo = sessionStorage.CARGO_USUARIO;

    if(cargo == 'Responsável'){
        liAnalise.style.display = 'flex';
        liScraper.style.display = 'flex';
        liFuncionarios.style.display = 'flex';
        liMetricas.style.display = 'flex';
    }else if(cargo == 'Gestor'){
        liAnalise.style.display = 'none';
        liScraper.style.display = 'none';
        liFuncionarios.style.display = 'flex';
        liMetricas.style.display = 'flex';
    }else if(cargo == 'Analista'){
        liAnalise.style.display = 'flex';
        liScraper.style.display = 'flex';
        liFuncionarios.style.display = 'none';
        liMetricas.style.display = 'none';
    }else if(cargo == 'Técnico'){
        liAnalise.style.display = 'none';
        liScraper.style.display = 'none';
        liFuncionarios.style.display = 'none';
        liMetricas.style.display = 'none';
    }else{
        alert('Falha na validação do cargo!');
        window.location = '../login.html';
    }
}

function guardar(idMaquina) {
    sessionStorage.ID_MAQUINA = idMaquina;
    sessionStorage.BOT_SELECIONADO = `maquina${idMaquina}`;
}

function selecionarBotao(idBotao) {

    var ulMaquinas = document.getElementById("ul_maquinas");
    let elementosFilhos = ulMaquinas.children;
    for(var i = 0; i < elementosFilhos.length; i++){
        elementosFilhos[i].classList.remove("item-selecionado");
    }
    var botaoSelecionado = document.getElementById(idBotao);
    botaoSelecionado.classList.add("item-selecionado");
}

var idEmpresa = sessionStorage.ID_EMPRESA
    fetch("/medidas/buscarServidores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idEmpresa: idEmpresa
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                
                resposta.json().then(json => {
                    
                        console.log(JSON.stringify(json));
                        console.log(json);

                    for (var index = 0; index < json.length; index++) {

                            idMaquina = json[index].idMaquina;
                            serialMaquina = json[index].serialMaquina;
                            nomeMaquina = json[index].nome;
                            fkEmpresa = json[index].fkEmpresa;
                            
                            var idBotao = `maquina${idMaquina}`;

                            var paginaAtual = window.location.href;

                            var link = '';

                            if(paginaAtual == "http://localhost:8080/dashboard/dashboard.html" || paginaAtual == "http://localhost:8080/dashboard/dashboard.html#"){
                                link = '#';
                            }else{
                                link = 'dashboard.html';
                            }
                            
                            ul_maquinas.innerHTML += `<li id="maquina${idMaquina}">
                            <a href='${link}' onclick="guardar(${idMaquina}), selecionarBotao('${idBotao}'), buscarInfoMaquina(${idMaquina}), gerar(${fkEmpresa},${idMaquina})"><img src="../assets/icons/server.png">${nomeMaquina}</a>
                        </li>`
                        }
                      
                })
            

            } 

        
        })