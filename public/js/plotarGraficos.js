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

function atualizarKpi(idEmpresa, idMaquina, fkComponente) {
    fetch(`/medidas/registrosTempoReal/${idEmpresa}/${idMaquina}/${fkComponente}`, {
        cache: 'no-store'
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (novoPonto) {
                console.log(`Novo dado recebido KPI: ${JSON.stringify(novoPonto)}`);


                nomeSplit = novoPonto[0].nomeComponente.substring(0, 3);

                //binchilin

                    if (nomeSplit == "CPU") {
                        // alert("AGUI: " + novoPonto[0].registro);
                        var tuplaCPU = novoPonto[0];
                        if (tuplaCPU.registro <= 10) {
                            mudacor = document.getElementById("coresId");
                            mudacor.style.backgroundColor = "lightblue";
                            //   alert("O retorno da tuplaCPU.registro  foi: "+tuplaCPU.registro)
                        } else if (tuplaCPU.registro > 10 && tuplaCPU.registro < 21) {
                            mudacor = document.getElementById("coresId");
                            mudacor.style.backgroundColor = "#0ab1e9";
                            //   alert("O retorno da tuplaCPU.registro  foi: "+tuplaCPU.registro)
                        } else if (tuplaCPU.registro >= 21 && tuplaCPU.registro < 61) {
                            mudacor = document.getElementById("coresId");
                            mudacor.style.backgroundColor = "#0ae97a";
                            //   alert("O retorno da tuplaCPU.registro  foi: "+tuplaCPU.registro)
                        } else if (tuplaCPU.registro >= 61 && tuplaCPU.registro < 81) {
                            mudacor = document.getElementById("coresId");
                            mudacor.style.backgroundColor = "#e9da0a";
                            //   alert("O retorno da tuplaCPU.registro  foi: "+tuplaCPU.registro)
                        } else {
                            mudacor = document.getElementById("coresId");
                            mudacor.style.backgroundColor = "#e90a0a";
                            //   alert("O retorno da tuplaCPU.registro  foi: "+tuplaCPU.registro)
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

    fetch(`/medidas/buscarComponentesMaquina/${idEmpresa}/${idMaquina}`, {cache: 'no-store'}).then(function (resposta) {
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
                    gerarGrafico(retorno[i].fkComponente);
                    atualizarKpi(idEmpresa, idMaquina, retorno[i].fkComponente);
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
                
                    if(quantidadeDiscos >= 2){
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
        var nomeSplit = nomeComponente.substring(0,3);

        if(nomeSplit == "CPU" || nomeSplit == "RAM" || nomeSplit == "Tem"){

            if(nomeSplit == "CPU"){
                var areaCpu = document.getElementById("divGraficoCpu");

                document.getElementById("graficoCpu").remove();
                var canvasCpu = document.createElement("canvas");
                canvasCpu.setAttribute("class", "cnvGrafico");
                canvasCpu.setAttribute("id", "graficoCpu");
                areaCpu.append(canvasCpu);
            }

            if(nomeSplit == "RAM"){
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
                                font:{
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
                                font:{
                                    size: 7
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white',
                                font:{
                                    size: 10
                                }
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                }
            };
        }else if (nomeSplit == "Dis"){

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

        if(nomeSplit == "CPU"){
            var graficoMon = new Chart(
                document.getElementById(`graficoCpu`),
                config,
            );

            setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);

        }else if(nomeSplit == "RAM"){
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
        }else if(nomeSplit == "Dis"){ 
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

function buscarInfoMaquina(idMaquina){
    fetch(`/medidas/infoMaquina/${idMaquina}`, {cache: 'no-store'}).then(function (retorno) {
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

                for(var i = 0; i < resposta.length; i++){
                    infoComponente = resposta[i];
                    nomeComponenteRetorno = infoComponente.nomeComponente.substring(0,3);
                    if(nomeComponenteRetorno == "CPU"){
                        var paragrafo = document.createElement("p");
                        paragrafo.innerHTML = "Processador: " + infoComponente.nomeComponente;
                        areaInfo.appendChild(paragrafo);
                    }else if(nomeComponenteRetorno == "RAM"){
                        var paragrafo = document.createElement("p");
                        paragrafo.innerHTML = "Memória RAM Total: " + infoComponente.tamanho + " GB";
                        areaInfo.appendChild(paragrafo);
                    }else if(nomeComponenteRetorno == "Dis"){
                        var paragrafo = document.createElement("p");
                        paragrafo.innerHTML = infoComponente.nomeComponente + " - Espaço Total de Disco: " + infoComponente.tamanho + " GB";
                        areaInfo.appendChild(paragrafo);
                    }
                }

            })
        }else{
            console.log("VAI TOMAR NO CUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
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

    cpuDados = cpuDados.reverse()
    momento = momento.reverse()
    ramDados = ramDados.reverse()


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
  
    console.log("ALFA: PPPPPPPPPP")
    console.log(beta)
  
    // valor de alfa
    var alfa = dadosTemp[0] - beta * dadosCpu[0]
    console.log("BETA: HHHHHHHHH")
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
    var regressao = [];
  
  //   alert("TESTANDO MANIPULAR: " + dadosCorrelacao['x'][3])
    
    var yval = 0
    for (let index = 0; index < dadosCorrelacao.length; index++) {
      testeaa = dadosCorrelacao[index]
      yval = alfa + beta * testeaa['x'];
      regressao.push({x: testeaa['x'], y: yval})
    }
    console.log("REGRESSÃO: WWWWWWWWWW")
    console.log(regressao)
  
    const mixedChart = new Chart(document.getElementById(`graficoTemperatura`), {
        data: {
            datasets: [{
                type: 'scatter',
                label: 'Correlação',
                data: dadosCorrelacao,
                backgroundColor: ["#6B6568"],
            }, {
                type: 'line',
                label: 'Linha de tendencia',
                data: regressao,
                backgroundColor: 'green',
                borderColor: 'green'
            }],
        },
        options: {}
    });
    
  }