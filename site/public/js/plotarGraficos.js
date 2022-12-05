var quantidadeDiscos = 0;


// Mexer quando for fazer os links para maquinas
function plotarBotoes() {
    area_botoes.innerHTML = '';

    fetch("/medidas/resgatarMaquinas").then(function (resposta) {
        if (resposta.ok) {
            if (resposta == 204) {
                console.log("Retorno vazio de máquinas!");
            }
            resposta.json().then(function (resposta) {
                console.log("Máquinas recebidas: ", JSON.stringify(resposta));

                for (var i = 0; i < resposta.length; i++) {

                    var dadosMaquina = resposta[i];

                    var botao = document.createElement("button");
                    botao.setAttribute("id", `botaoMaquina${dadosMaquina.idMaquina}`);
                    botao.setAttribute("onClick", `gerar(1, ${dadosMaquina.idMaquina})`);
                    botao.innerHTML = `${dadosMaquina.nome}`;
                    document.getElementById("area_botoes").appendChild(botao);

                }
            })
        }
    })
}

var qtdeVoltas = 0;


var min = 0;
var max = 0;

function capturaMetrica(fkComponente) {
    fetch(`/medidas/buscarMetricaKpi/${fkComponente}`,
        { cache: 'no-store' }).then(function (respostaMetrica) {
            if (respostaMetrica.ok) {
                respostaMetrica.json().then(function (respostaMetrica) {
                    min = respostaMetrica[0].capturaMin;
                    max = respostaMetrica[0].capturaMax;
                })
            }
        });
}
function atualizarKpi(idEmpresa, idMaquina, fkComponente) {
    fetch(`/medidas/registrosTempoReal/${idEmpresa}/${idMaquina}/${fkComponente}`, {
        cache: 'no-store'
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (novoPonto) {
                console.log(`Novo dado recebido KPI: ${JSON.stringify(novoPonto)}`);


                nomeSplit = novoPonto[0].nomeComponente.substring(0, 3);

                //binchilin




                //binchinlin    
                var calculoEsq = max - min;
                var quartil1 = (calculoEsq * 25) / 100;
                quartil1 = quartil1 + min;
                var quartil2 = (calculoEsq * 50) / 100;
                quartil2 = quartil2 + min;
                var quartil3 = (calculoEsq * 75) / 100;
                quartil3 = quartil3 + min;
                if (nomeSplit == "CPU") {
                    // alert("AGUI: " + novoPonto[0].registro);
                    var tuplaCPU = novoPonto[0];
                    if (tuplaCPU.registro <= min) {
                        mudacor = document.getElementById("coresId");
                        mudacor.style.backgroundColor = "lightblue";
                        //  Muito BAIXO
                    } else if (tuplaCPU.registro > min && tuplaCPU.registro <= quartil1) {
                        mudacor = document.getElementById("coresId");
                        mudacor.style.backgroundColor = "#0ab1e9";
                        //   baixo
                    } else if (tuplaCPU.registro > quartil1 && tuplaCPU.registro <= quartil2) {
                        mudacor = document.getElementById("coresId");
                        mudacor.style.backgroundColor = "#0ae97a";
                        //   médio
                    } else if (tuplaCPU.registro > quartil2 && tuplaCPU.registro <= quartil3) {
                        mudacor = document.getElementById("coresId");
                        mudacor.style.backgroundColor = "#e9da0a";
                        //   alto
                    } else if (tuplaCPU.registro > quartil3 && tuplaCPU.registro <= max) {
                        mudacor = document.getElementById("coresId");
                        mudacor.style.backgroundColor = "#e90a0a";
                        //   perigo
                    } else {
                        mudacor = document.getElementById("coresId");
                        mudacor.style.backgroundColor = "#161616";
                        // neutrao 2.0 daquele jeitao que vc já sabe né ;)
                    }

                    if (qtdeVoltas > 1) {
                        clearTimeout(proximaAttCpu);
                    }
                    proximaAttCpu = setTimeout(() => atualizarKpi(idEmpresa, idMaquina, fkComponente), 5000);
                } else if (nomeSplit == "Tem") {
                    // alert("Temp: " + novoPonto[0].registro);
                    var tuplaTem = novoPonto[0];
                    if (tuplaTem.registro <= 10) {
                        mudacor = document.getElementById("coresId2");
                        mudacor.style.backgroundColor = "lightblue";
                        //   alert("O retorno da tuplaTem.registro  foi: "+tuplaTem.registro)
                    } else if (tuplaTem.registro > 10 && tuplaTem.registro < 21) {
                        mudacor = document.getElementById("coresId2");
                        mudacor.style.backgroundColor = "#0ab1e9";
                        //   alert("O retorno da tuplaTem.registro  foi: "+tuplaTem.registro)
                    } else if (tuplaTem.registro >= 21 && tuplaTem.registro < 61) {
                        mudacor = document.getElementById("coresId2");
                        mudacor.style.backgroundColor = "#0ae97a";
                        //   alert("O retorno da tuplaTem.registro  foi: "+tuplaTem.registro)
                    } else if (tuplaTem.registro >= 61 && tuplaTem.registro < 81) {
                        mudacor = document.getElementById("coresId2");
                        mudacor.style.backgroundColor = "#e9da0a";
                        //   alert("O retorno da tuplaTem.registro  foi: "+tuplaTem.registro)
                    } else {
                        mudacor = document.getElementById("coresId2");
                        mudacor.style.backgroundColor = "#e90a0a";
                        //   alert("O retorno da tuplaTem.registro  foi: "+tuplaTem.registro)
                    }
                    if (qtdeVoltas > 1) {
                        clearTimeout(proximaAttTem);
                    }

                    proximaAttTem = setTimeout(() => atualizarKpi(idEmpresa, idMaquina, fkComponente), 5000);
                }





            })
        } else {
            console.error('Nada foi encontrado!');
            proximaAtt = setTimeout(() => atualizarKpi(idEmpresa, idMaquina, fkComponente), 5000);
        }
    })
}

function gerar(idEmpresa, idMaquina) {
    qtdeVoltas++;


    // Mexer quando for fazer os links para maquinas
    // plotarBotoes();

    // area_grafico.innerHTML = '';

    // var titulo = document.createElement("h1");
    // titulo.innerHTML = `Monitoramento`;
    // area_grafico.appendChild(titulo);

    fetch(`/medidas/buscarComponentesMaquina/${idEmpresa}/${idMaquina}`, { cache: 'no-store' }).then(function (resposta) {
        if (resposta.ok) {
            quantidadeDiscos = 0;
            resposta.json().then(function (retorno) {
                console.log(`Dados recebidos dos componentes: ${JSON.stringify(retorno)}`);

                var areaDiscoGeral = document.getElementById("area_disco");
                var areaRam = document.getElementById("area_ram");
                areaDiscoGeral.innerHTML = "";

                areaRam.style.height = '55%';
                areaDiscoGeral.style.height = '40%';

                for (var i = 0; i < retorno.length; i++) {
                    capturaMetrica(retorno[i].fkComponente);
                    atualizarKpi(idEmpresa, idMaquina, retorno[i].fkComponente);
                    gerarGrafico(retorno[i].fkComponente);
                }
                // graficosMedia(idMaquina);

            })
        }
    });


    function gerarGrafico(idComponente) {
        fetch(`/medidas/ultimosRegistros/${idEmpresa}/${idMaquina}/${idComponente}`, {
            cache: 'no-store'
        }).then(function (resposta) {
            if (resposta.ok) {
                var areaDiscoGeral = document.getElementById("area_disco");
                var areaRam = document.getElementById("area_ram");
                resposta.json().then(function (retorno) {
                    console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                    configurarGraficoMon(retorno, idComponente);


                    console.log("Valor final disco: " + quantidadeDiscos);

                    if (quantidadeDiscos >= 2) {
                        areaDiscoGeral.classList.remove("disco_rede");
                        areaDiscoGeral.classList.add("disco_rede2");

                        areaRam.style.height = '40%';
                        areaDiscoGeral.style.height = '55%';

                        var divsDisco = document.querySelectorAll('.disco');

                        var alturaIdeal = 100 / quantidadeDiscos;
                        alturaIdeal = alturaIdeal - 1;

                        divsDisco.forEach(caixaDisco => {
                            caixaDisco.style.height = `${alturaIdeal}%`;
                        });
                    }
                });

            } else {
                console.error('Nada foi encontrado!');
            }
        });
    }

    function configurarGraficoMon(retorno, idComponente) {



        // var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        // gradient.addColorStop(0, 'rgba(214, 31, 31, 0.5)');   
        // gradient.addColorStop(1, 'rgba(214, 31, 31, 0)');

        var nomeComponente = retorno[0].nomeComponente;
        if(nomeComponente == 'redeDwnl' || nomeComponente == 'redeUpld'){
           plotarGraficoVelocidadeInternet(nomeComponente, retorno[0].idMaquina) 
        }
        
        var nomeSplit = nomeComponente.substring(0, 3);

        if (nomeSplit == "CPU" || nomeSplit == "RAM" || nomeSplit == "Tem") {

            if (nomeSplit == "CPU") {
                var areaCpu = document.getElementById("divGraficoCpu");

                document.getElementById("graficoCpu").remove();
                var canvasCpu = document.createElement("canvas");
                canvasCpu.setAttribute("class", "cnvGrafico");
                canvasCpu.setAttribute("id", "graficoCpu");
                areaCpu.append(canvasCpu);
            }

            if (nomeSplit == "RAM") {
                var areaRam = document.getElementById("divGraficoRam");

                document.getElementById("graficoRam").remove();
                var canvasRam = document.createElement("canvas");
                canvasRam.setAttribute("class", "cnvGrafico");
                canvasRam.setAttribute("id", "graficoRam");
                areaRam.append(canvasRam);
            }

            if (nomeSplit == "Tem") {
                var areaTemp = document.getElementById("divGraficoTemp");

                document.getElementById("graficoTemp").remove();
                var canvasTemp = document.createElement("canvas");
                canvasTemp.setAttribute("class", "cnvGrafico");
                canvasTemp.setAttribute("id", "graficoTemp");
                areaTemp.append(canvasTemp);
            }

            var vetorData = [];
            var vetorRegistro = [];

            for (var i = 0; i < retorno.length; i++) {
                var tupla = retorno[i];
                vetorData.push(tupla.momento);
                vetorRegistro.push(tupla.registro);
            }

            var data = {
                labels: vetorData,
                datasets: [{
                    label: `${retorno[0].nomeComponente} | Unidade de Medida: ${retorno[0].unidadeMedida}`,
                    backgroundColor: 'rgba(255, 250, 250, 0.8)',
                    borderColor: 'rgba(255, 250, 250, 0.8)',
                    data: vetorRegistro,
                    fill: true,
                    tension: 0.5
                }]
            }

            var config = {
                type: 'line',
                data: data,
                backgroundColor: '#1E1E1E',
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: 'white',
                                font: {
                                    size: 10
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: 'white',
                                font: {
                                    size: 7
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white',
                                font: {
                                    size: 10
                                }
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                }
            };
        } else if (nomeSplit == "Dis") {

            quantidadeDiscos++;

            console.log("Estou aumentando aqui: " + quantidadeDiscos);

            var areaDiscoGeral = document.getElementById("area_disco");

            var divDisco = document.createElement("div");
            var tituloUsoDisco = document.createElement("h3");
            var divGrafDisco = document.createElement("div");
            var canvasGrafDisco = document.createElement("canvas");

            divDisco.setAttribute("class", "disco");
            divDisco.setAttribute("id", `div_disco${retorno[0].fkComponente}`);

            tituloUsoDisco.innerHTML = `Uso do ${retorno[0].nomeComponente}`;

            divGrafDisco.setAttribute("class", "divGrafico");
            divGrafDisco.setAttribute("id", `divGraficoDisco${retorno[0].fkComponente}`);

            canvasGrafDisco.setAttribute("class", "cnvGrafico");
            canvasGrafDisco.setAttribute("id", `graficoDisco${retorno[0].fkComponente}`);

            divGrafDisco.appendChild(canvasGrafDisco);
            divDisco.appendChild(tituloUsoDisco);
            divDisco.appendChild(divGrafDisco);
            areaDiscoGeral.append(divDisco);

            var areaDisco = document.getElementById(`divGraficoDisco${retorno[0].fkComponente}`);

            document.getElementById(`graficoDisco${retorno[0].fkComponente}`).remove();
            var canvasDisco = document.createElement("canvas");
            canvasDisco.setAttribute("class", "cnvGrafico");
            canvasDisco.setAttribute("id", `graficoDisco${retorno[0].fkComponente}`);
            areaDisco.append(canvasDisco);

            var data = {
                labels: ['Usado', 'Livre'],
                datasets: [{
                    label: `Teste`,
                    backgroundColor: ['rgba(77, 158, 65, 0.58)', 'rgba(255, 250, 250, 0.8)'],
                    borderColor: ['rgb(77, 158, 65', 'rgb(255, 250, 250)'],
                    hoverBackgroundColor: ['rgb(77, 158, 65)', 'rgb(255, 250, 250)'],
                    data: [retorno[0].registro, 100 - retorno[0].registro]
                }]
            }

            var config = {
                type: 'pie',
                data: data,
                backgroundColor: '#1E1E1E',
                options: {
                    plugins: {
                        legend: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                text: 'Uso do Disco'
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                }
            };
        }

        var h3Nome = document.createElement("h3");
        h3Nome.innerHTML = retorno[0].nomeComponente;

        if (nomeSplit == "CPU") {
            var graficoMon = new Chart(
                document.getElementById(`graficoCpu`),
                config,
            );

            setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);

        } else if (nomeSplit == "RAM") {
            var graficoMon = new Chart(
                document.getElementById(`graficoRam`),
                config,
            );

            setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);

        } else if (nomeSplit == "Tem") {
            var graficoMon = new Chart(
                document.getElementById(`graficoTemp`),
                config,
            );

            setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);
        } else if (nomeSplit == "Dis") {
            var graficoMon = new Chart(
                document.getElementById(`graficoDisco${retorno[0].fkComponente}`),
                config,
            );
        }

        // var div = document.createElement("div");
        // var canva = document.createElement("canvas");
        // canva.setAttribute('id', `grafico${retorno[0].fkComponente}`);
        // div.append(h3Nome);
        // div.appendChild(canva);
        // document.getElementById("area_grafico").appendChild(div);

        // var graficoMon = new Chart(
        //     document.getElementById(`grafico${retorno[0].fkComponente}`),
        //     config,
        // );

        function atualizarGrafico(idEmpresa, idMaquina, fkComponente, data) {
            fetch(`/medidas/registrosTempoReal/${idEmpresa}/${idMaquina}/${fkComponente}`, {
                cache: 'no-store'
            }).then(function (resposta) {
                if (resposta.ok) {
                    resposta.json().then(function (novoPonto) {
                        console.log(`Novo dado recebido: ${JSON.stringify(novoPonto)}`);
                        console.log(`Dados atuais do gŕafico: ${data}`);

                        console.log("ME AJUDA SENHOR: " + data.datasets.length);

                        data.labels.shift();
                        data.labels.push(novoPonto[0].momento);

                        data.datasets[0].data.shift();
                        data.datasets[0].data.push(novoPonto[0].registro);

                        graficoMon.update('none');

                        proximaAtt = setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);
                    })
                } else {
                    console.error('Nada foi encontrado!');
                    proximaAtt = setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);
                }
            })
        }

    }

}

function graficosMedia(idMaquina) {
    var selecionado = idMaquina.value;
    fetch("/medidas/mediaUsoComponente").then(function (retorno) {
        if (retorno.ok) {
            if (retorno == 204) {
                console.log("Retorno vazio de máquinas!");
            }
            retorno.json().then(function (resposta) {
                console.log("Médias Recebidas: ", JSON.stringify(resposta));

                plotarGraficoMedia(resposta, selecionado);
            });
        }
    });
    fetch(`/medidas/correlacaoTempCPU/${selecionado}`).then(function (retorno) {
        if (retorno.ok) {
            if (retorno == 204) {
                console.log(
                    "Retorno vazio de máquinas (Correlação Temperatura com CPU)!"
                );
            }
            retorno.json().then(function (resposta) {
                console.log("Médias Recebidas: ", JSON.stringify(resposta));

                // plotarGraficoMedia(resposta, selecionado);
                plotarGraficoCorrelacaoTempCPU(resposta, selecionado);
            });
        }
    });
}

function plotarGraficoMedia(retorno, idMaquina) {
    for (var i = 0; i < retorno.length; i++) {
        console.log("RETORNO: plotarGraficoMedia");
        console.log(retorno);
        if (idMaquina == retorno[i].idMaquina) {
            var nomeComponente = retorno[i].nomeComponente;
            var nomeSplit = nomeComponente.substring(0, 3);

            if (nomeSplit == "CPU") {
                var areaCpu = document.getElementById("divGraficoCpu");

                document.getElementById("graficoCpu").remove();
                var canvasCpu = document.createElement("canvas");
                canvasCpu.setAttribute("class", "cnvGrafico");
                canvasCpu.setAttribute("id", "graficoCpu");
                areaCpu.append(canvasCpu);
            }

            if (nomeSplit == "RAM") {
                var areaRam = document.getElementById("divGraficoRam");

                document.getElementById("graficoRam").remove();
                var canvasRam = document.createElement("canvas");
                canvasRam.setAttribute("class", "cnvGrafico");
                canvasRam.setAttribute("id", "graficoRam");
                areaRam.append(canvasRam);
            }

            if (nomeSplit == "Dis") {
                var areaDisco = document.getElementById("divGraficoDisco");

                document.getElementById("graficoDisco").remove();
                var canvasDisco = document.createElement("canvas");
                canvasDisco.setAttribute("class", "cnvGrafico");
                canvasDisco.setAttribute("id", "graficoDisco");
                areaDisco.append(canvasDisco);
            }

            if (nomeSplit == "CPU" || nomeSplit == "RAM") {
                const dataMedia = {
                    labels: ["Média de Uso (%)", "Média não sendo usada (%)"],
                    datasets: [
                        {
                            label: `Média Registro ${retorno[i].nomeComponente}`,
                            data: [retorno[i].MediaUso, 100 - retorno[i].MediaUso],
                            backgroundColor: ["#4d9e4194", "#6B6568"],
                            hoverOffset: 4,
                        },
                    ],
                };

                const config = {
                    type: "doughnut",
                    data: dataMedia,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        elements: {
                            arc: {
                                borderWidth: 0,
                            },
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: "white",
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
                        },
                    },
                };

                if (nomeSplit == "CPU") {
                    var graficoMon = new Chart(
                        document.getElementById(`graficoCpu`),
                        config
                    );

                    // function getCPU(nomeSplit) {
                    //     return retorno.MediaUso
                    // }
                } else if (nomeSplit == "RAM") {
                    var graficoMon = new Chart(
                        document.getElementById(`graficoRam`),
                        config
                    );
                }
            } else if (nomeSplit == "Dis") {
                const dataMedia = {
                    labels: ["Média Usada do Disco (%)", "Média Espaço Livre (%)"],
                    datasets: [
                        {
                            label: `Média Registro ${retorno[i].nomeComponente}`,
                            data: [retorno[i].MediaUso, 100 - retorno[i].MediaUso],
                            backgroundColor: ["#4d9e4194", "#6B6568"],
                            hoverOffset: 4,
                        },
                    ],
                };

                const config = {
                    type: "doughnut",
                    data: dataMedia,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        elements: {
                            arc: {
                                borderWidth: 0,
                            },
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: "white",
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
                        },
                    },
                };

                var graficoMon = new Chart(
                    document.getElementById(`graficoDisco`),
                    config
                );
            }
        }
    }
}

function buscarInfoMaquina(idMaquina) {
    fetch(`/medidas/infoMaquina/${idMaquina}`, { cache: 'no-store' }).then(function (retorno) {
        if (retorno.ok) {
            if (retorno == 204) {
                console.log("Retorno vazio de informação da máquina!");
            }
            retorno.json().then(function (resposta) {
                console.log("Informação da máquina recebida: ", JSON.stringify(resposta));
                var areaInfo = document.getElementById("info_maquina");
                areaInfo.innerHTML = "";
                var h2Titulo = document.createElement("h2");
                h2Titulo.innerHTML = "Informações da Máquina";
                areaInfo.appendChild(h2Titulo);

                for (var i = 0; i < resposta.length; i++) {
                    infoComponente = resposta[i];
                    nomeComponenteRetorno = infoComponente.nomeComponente.substring(0, 3);
                    if (nomeComponenteRetorno == "CPU") {
                        var paragrafo = document.createElement("p");
                        paragrafo.innerHTML = "Processador: " + infoComponente.nomeComponente;
                        areaInfo.appendChild(paragrafo);
                    } else if (nomeComponenteRetorno == "RAM") {
                        var paragrafo = document.createElement("p");
                        paragrafo.innerHTML = "Memória RAM Total: " + infoComponente.tamanho + " GB";
                        areaInfo.appendChild(paragrafo);
                    } else if (nomeComponenteRetorno == "Dis") {
                        var paragrafo = document.createElement("p");
                        paragrafo.innerHTML = infoComponente.nomeComponente + " - Espaço Total de Disco: " + infoComponente.tamanho + " GB";
                        areaInfo.appendChild(paragrafo);
                    }
                }

            })
        } else {
            console.log("")
        }
    })
}


function buscarComponentesUser(idUsuario, idMaquina) {


    fetch(`/medidas/buscarComponentesMaquinaPorUser/${idUsuario}/${idMaquina}`,
        { cache: 'no-store' }).then(function (resposta) {
            if (resposta.ok) {

                resposta.json().then(function (resposta) {
                    console.log(`Dados recebidos dos componentes: ${JSON.stringify(resposta)}`);


                    gerarGraficoUser(idUsuario, resposta[0].idComponente, resposta[1].idComponente);
                    gerarGraficoQtdPorUser(idUsuario, idMaquina);


                    //plotarGraficoUser(cpu, ram)
                    // graficosMedia(idMaquina);

                })
            }
        });


}

function plotarGraficoUser(cpu, ram) {
    var cpuDados = [];
    var momento = [];
    var ramDados = [];

    for (let i = 0; i < cpu.length; i++) {
        cpuDados.push(cpu[i].registro)
        momento.push((cpu[i].momento))
        ramDados.push(ram[i].registro)
    }



    const data = {
        labels: momento,
        datasets: [{
            label: 'CPU',
            backgroundColor: 'white',
            borderColor: 'white',
            data: cpuDados,
        },
        {
            label: 'RAM',
            backgroundColor: 'white',
            borderColor: 'white',
            data: ramDados,
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                arc: {
                    borderWidth: 0
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    };

    const myChart = new Chart(
        document.getElementById('grafico_valor_dados'),
        config
    );

}

function plotarGraficoQtdPorUser(retorno) {
    var qtdDados = [];
    var dia = [];

    for (let i = 0; i < retorno.length; i++) {
        qtdDados.push(retorno[i].qtdDados)
        dia.push((retorno[i].dia))

    }


    const data = {
        labels: dia,
        datasets: [{
            label: 'Quantidade',
            backgroundColor: 'white',
            borderColor: 'white',
            data: qtdDados,
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                arc: {
                    borderWidth: 0
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    };

    const myChart = new Chart(
        document.getElementById('grafico_qtd_dados'),
        config
    );
}

function gerarGraficoUser(idUsuario, idComponenteCPU, idComponenteRAM) {

    var ram;
    var cpu;

    fetch(`/medidas/ultimosRegistrosUser/${idUsuario}/${idMaquina}/${idComponenteCPU}`, {
        cache: 'no-store'
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (retorno) {
                console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                console.log(retorno)
                cpu = retorno
                fetch(`/medidas/ultimosRegistrosUser/${idUsuario}/${idMaquina}/${idComponenteRAM}`, {
                    cache: 'no-store'
                }).then(function (resposta) {
                    if (resposta.ok) {
                        resposta.json().then(function (retorno) {
                            console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                            console.log(retorno)
                            ram = retorno
                            setTimeout(plotarGraficoUser, 1, cpu, ram)
                        });

                    } else {
                        console.error('Nada foi encontrado!');
                    }
                });

            });

        } else {
            console.error('Nada foi encontrado!');
        }
    });


}

function gerarGraficoQtdPorUser(idUsuario, idMaquina) {



    fetch(`/medidas/qtdRegistrosPorUser/${idUsuario}/${idMaquina}`, {
        cache: 'no-store'
    }).then(function (resposta) {
        console.log('aaaaa' + resposta.ok)
        if (resposta.ok) {
            resposta.json().then(function (retorno) {
                console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                console.log(retorno)
                tempoAtividade.innerHTML = retorno.length
                plotarGraficoQtdPorUser(retorno)


            });

        } else {
            console.error('Nada foi encontrado!');
        }
    });


}

function plotarGraficoCorrelacaoTempCPU(retorno, idMaquina) {
    var dadosCpu = [];
    var dadosTemp = [];
    for (var i = 0; i < retorno.length; i++) {
      console.log("RETORNO: plotarCorrelacaoTempCPU");
      console.log(retorno);
      if (idMaquina == retorno[i].idMaquina) {
        var nomeComponente = retorno[i].nomeComponente;
        var nomeSplit = nomeComponente.substring(0, 3);
  
        if (nomeSplit == "Tem") {
          console.log(dadosTemp);
  
          dadosTemp.push(retorno[i].registro);
        } else if (nomeSplit == "CPU") {
          console.log(dadosCpu);
          dadosCpu.push(retorno[i].registro);
        }
      }
    }
    var areaTemperatura = document.getElementById("divGraficoTemperatura");
    document.getElementById("graficoTemperatura").remove();
    var canvasTemperatura = document.createElement("canvas");
    canvasTemperatura.setAttribute("class", "cnvGrafico");
    canvasTemperatura.setAttribute("id", "graficoTemperatura");
    areaTemperatura.append(canvasTemperatura);
  
    var dadosCorrelacao = [];
  
    // Y = AX + B
    // x = cpu
    // y = temperatura
    // n = retorno.lenght
    // var a = dadosCorrelacao.length *
  
    // ∑ x (somatória de X)
    var somatoriaX = 0;
    for (let index = 0; index < dadosCpu.length; index++) {
      somatoriaX += dadosCpu[index]
    }
    console.log("∑ x : " + somatoriaX)
  
    // ∑ y (somatória de Y)
    var somatoriaY = 0;
    for (let index = 0; index < dadosTemp.length; index++) {
      somatoriaY += dadosTemp[index]
    }
    console.log("∑ y : " + somatoriaY)
  
    // ∑ xy (somatória de XY)
    var somaXY = 0
    for(let index = 0; index < dadosTemp.length; index++){
      somaXY += dadosCpu[index] * dadosTemp[index]
    }
    console.log("∑ xy : " + somaXY)
  
    // ∑ x ** 2 
    var xQuadrado = 0;
    for (let index = 0; index < dadosCpu.length; index++) {
      xQuadrado += (dadosCpu[index] ** 2)
    }
    console.log("∑ X ** 2: " + xQuadrado)
  
    // (∑ x) ** 2
    var xQuadradoElavadoA2 = xQuadrado ** 2
    console.log("(∑ X) ** 2: " + xQuadradoElavadoA2)
    
    // n = quantidade de amaostras
    // retorno.length
  
    // valor de beta
    var beta = (somaXY - (somatoriaX * somatoriaY / dadosCpu.length)) / (xQuadrado - (somatoriaX ** 2 / dadosCpu.length))
  
    console.log("BETA: PPPPPPPPPP")
    console.log(beta)
  
    // valor de alfa
    var alfa = dadosTemp[0] - beta * dadosCpu[0]
    console.log("ALFA: HHHHHHHHH")
    console.log(alfa)
  
    
    // Y = AX + B
    
    for (var index = 0; index < dadosCpu.length; index++) {
      var input = {
        x: dadosCpu[index],
        y: dadosTemp[index],
      };
      dadosCorrelacao.push(input);
    }
    console.log("Dados Correlacao: ");
    console.log(dadosCorrelacao);
  
    // regressão linear
    var regressaoY = [];
    var regressaoX = [];
  
  
  //   alert("TESTANDO MANIPULAR: " + dadosCorrelacao['x'][3])
    
    var yVal = 0
    for (let index = 0; index < dadosCorrelacao.length; index++) {
      xVal = dadosCorrelacao[index]
      yVal = alfa + beta * xVal['x'];
      regressaoY.push(yVal.toFixed(0))
      regressaoX.push(xVal['x'])
  
    }
    console.log("REGRESSÃO: WWWWWWWWWW")
    console.log(regressaoY)
    console.log(regressaoX)
  
  //   const mixedChart = new Chart(document.getElementById(`graficoTemperatura`), {
  //     data: {
  //         datasets: [{
  //             type: 'line',
  //             label: 'Linha de tendencia',
  //             data: regressaoY,
  //             backgroundColor: 'green',
  //             borderColor: 'green'
  //         }],
  //     },
  //     options: {}
  // });
  
  const dataTemp = {
    labels: regressaoX,
    datasets: [{
      label: 'Linha de tendencia',
      data: regressaoY,
      fill: false,
      backgroundColor: 'green',
      borderColor: 'green',
      tension: 0.1
    }]
  };
  
  const config2 = {
    type: 'line',
    data: dataTemp,
  };
  
  var graficoMon = new Chart(
    document.getElementById(`graficoTemperatura`),
    config2
  );
    
  }

    // Projeto Leo (Velocidade Internet)

var valorDwnl = 0;
var valorUpld = 0;

function plotarGraficoVelocidadeInternet(nomeComponente, idMaquina) {
  fetch(`/medidas/redeDownload/${nomeComponente}/${idMaquina}`, {
    cache: 'no-store'
  }).then(function(retornoDwnl) {
    if (retornoDwnl.ok) {
      retornoDwnl.json().then(function(resposta) {
        console.log("novo dado recebido" + JSON.stringify(resposta))
        if(resposta[0].nomeComponente == 'redeDwnl'){
            valorDwnl = resposta[0].registro
        } else{
            valorUpld = resposta[0].registro
        }
        
        let chartConfig = {
            type: 'gauge',
            theme: 'classic',
            alpha: 1,
            backgroundColor: '#161616',
            // refresh: {
            //     type: 'feed',
            //     transport: 'js',
            //     url: attVelocidadeInternetDwnld(nomeComponente, idMaquina),
            //     interval: 200,
            //     maxTicks: 20,
            //     adjustScale: true,
            //     resetTimeout: 60,
            //   },
            plot: {
              tooltip: {
                backgroundColor: 'black',
              },
              backgroundColor: '#161616',
            },
            plotarea: {
              margin: '0 0 0 0',
            },
            scale: {
              sizeFactor: 1.25,
              offsetY: '60px',
            },
            scaleR: {
              values: '0:100:10',
              backgroundColor: '#1616,#fff',
              borderColor: '#b3b3b3',
              borderWidth: '2px',
              ring: {
                offsetR: '130px',
                rules: [
                  {
                    backgroundColor: '#FB0A02',
                    rule: '%v >=0 && %v < 20',
                  },
                  {
        
                    backgroundColor: '#EC7928',
                    rule: '%v >= 20 && %v < 40',
                  },
                  {
                    backgroundColor: '#FAC100',
                    rule: '%v >= 40 && %v < 60',
                  },
                  {
                    backgroundColor: '#B1AD00',
                    rule: '%v >= 60 && %v < 80',
                  },
                  {
                    backgroundColor: '#348D00',
                    rule: '%v >= 80',
                  },
                ],
                size: '10px',
              },
            },
            labels: [
              {
                id: 'lbl1',
                text: 'Muito rápido', 
                tooltip: {
                  text: '< 80 <br>Mbps',
                  backgroundColor: '#237b00',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#348D00',
                offsetX: '160px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl2',
                text: 'Rápido',
                tooltip: {
                  text: '> 60 < 80<br>Mbps',
                  backgroundColor: '#a09c00',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#B1AD00',
                offsetX: '80px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl3',
                text: 'Médio',
                tooltip: {
                  text: '> 40 < 60<br>Mbps',
                  backgroundColor: '#e9b000',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#FAC100',
                offsetX: '0px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl4',
                text: 'Lento',
                tooltip: {
                  text: '> 20 < 40<br>Mbps',
                  backgroundColor: '#da6817',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#EC7928',
                offsetX: '-80px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl5',
                text: 'Muito lento',
                tooltip: {
                  text: '< 20<br>Mbps',
                  backgroundColor: '#ea0901',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#FB0A02',
                offsetX: '-160px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
            ],
            series: [
              {
                values: [valorDwnl],
                animation: {
                  effect: 'ANIMATION_EXPAND_VERTICAL',
                  method: 'ANIMATION_REGULAR_EASE_OUT',
                  speed: 2500,
                },
              },
            ],
          };
          let chartConfig1 = {
            type: 'gauge',
            theme: 'classic',
            alpha: 1,
            backgroundColor: '#161616',
            // refresh: {
            //     type: 'feed',
            //     transport: 'js',
            //     url: attVelocidadeInternetDwnld(nomeComponente, idMaquina),
            //     interval: 200,
            //     maxTicks: 20,
            //     adjustScale: true,
            //     resetTimeout: 60,
            //   },
            plot: {
              tooltip: {
                backgroundColor: 'black',
              },
              backgroundColor: '#161616',
            },
            plotarea: {
              margin: '0 0 0 0',
            },
            scale: {
              sizeFactor: 1.25,
              offsetY: '60px',
            },
            scaleR: {
              values: '0:100:10',
              backgroundColor: '#1616,#fff',
              borderColor: '#b3b3b3',
              borderWidth: '2px',
              ring: {
                offsetR: '130px',
                rules: [
                  {
                    backgroundColor: '#FB0A02',
                    rule: '%v >=0 && %v < 20',
                  },
                  {
        
                    backgroundColor: '#EC7928',
                    rule: '%v >= 20 && %v < 40',
                  },
                  {
                    backgroundColor: '#FAC100',
                    rule: '%v >= 40 && %v < 60',
                  },
                  {
                    backgroundColor: '#B1AD00',
                    rule: '%v >= 60 && %v < 80',
                  },
                  {
                    backgroundColor: '#348D00',
                    rule: '%v >= 80',
                  },
                ],
                size: '10px',
              },
            },
            labels: [
              {
                id: 'lbl1',
                text: 'Muito rápido', 
                tooltip: {
                  text: '< 80 <br>Mbps',
                  backgroundColor: '#237b00',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#348D00',
                offsetX: '160px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl2',
                text: 'Rápido',
                tooltip: {
                  text: '> 60 < 80<br>Mbps',
                  backgroundColor: '#a09c00',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#B1AD00',
                offsetX: '80px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl3',
                text: 'Médio',
                tooltip: {
                  text: '> 40 < 60<br>Mbps',
                  backgroundColor: '#e9b000',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#FAC100',
                offsetX: '0px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl4',
                text: 'Lento',
                tooltip: {
                  text: '> 20 < 40<br>Mbps',
                  backgroundColor: '#da6817',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#EC7928',
                offsetX: '-80px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
              {
                id: 'lbl5',
                text: 'Muito lento',
                tooltip: {
                  text: '< 20<br>Mbps',
                  backgroundColor: '#ea0901',
                  padding: '10px',
                  shadow: false,
                },
                anchor: 'c',
                backgroundColor: '#FB0A02',
                offsetX: '-160px',
                padding: '10px',
                textAlign: 'center',
                width: '80px',
                x: '50%',
                y: '90%',
              },
            ],
            series: [
              {
                values: [valorUpld],
                animation: {
                  effect: 'ANIMATION_EXPAND_VERTICAL',
                  method: 'ANIMATION_REGULAR_EASE_OUT',
                  speed: 2500,
                },
              },
            ],
          };
          zingchart.render({
            id: 'graficoInternetDw',
            data: chartConfig,
            height: '50%',
            width: '90%',
          });
          zingchart.render({
            id: 'graficoInternetUp',
            data: chartConfig1,
            height: '50%',
            width: '90%',
          });

          setInterval(() => {
            // let colors = ['#00AE4D', '#E2D51A', '#FB301E'];
            // let Marker = (bgColor, ceiling) => {
            //   return {
            //     type: 'area',
            //     range: [0, ceiling],
            //     backgroundColor: bgColor,
            //     alpha: 0.95,
            //   };
            // };
            let output0 = 0;
            let output1 = 0;
            fetch(`/medidas/redeDownload/${nomeComponente}/${idMaquina}`, {
                cache: 'no-store'
              }).then(function(retornoDwnl) {
                if (retornoDwnl.ok) {
                  retornoDwnl.json().then(function(resposta) {
                    console.log("novo dado recebido" + JSON.stringify(resposta))
                    if(resposta[0].nomeComponente == 'redeDwnl'){
                        valorDwnl = resposta[0].registro
                    } else{
                        valorUpld = resposta[0].registro
                    }
                    output0 = valorDwnl
                    output1 = valorUpld
                    console.log(output0)
                    zingchart.exec('graficoInternetDw', 'appendseriesdata', {
                        graphid: 0,
                        plotindex: 0,
                        update: false,
                        data: {
                          values: [output0],
                        },
                      });
                      zingchart.exec('graficoInternetUp', 'appendseriesdata', {
                        graphid: 0,
                        plotindex: 0,
                        update: false,
                        data: {
                          values: [output1],
                        },
                      });
                     
                      // 2) update guage markers
                    //   zingchart.exec('graficoInternet', 'modify', {
                    //     graphid: 0,
                    //     update: false,
                    //     data: {
                    //       scaleR: {
                    //         markers: [Marker(colors[0], output0)],
                    //       },
                    //     },
                    //   });
                     
                      // batch update all chart modifications
                      zingchart.exec('graficoInternetDw', 'update');
                      zingchart.exec('graficoInternetUp', 'update');
                })
              }
              });
            // 1) update gauge values

          }, 5000);
    })
  }
  });
}
