var imgStatus = document.getElementById("imgStatus");
var imgWordcloud = document.getElementById("imgWordcloud");

var h2Cloud = document.getElementById("statusScrapCloud");
var h2Status = document.getElementById("statusScrapStatus");

var botoesDownload = document.querySelectorAll('.btnDownload');

function reset(){
    imgStatus.setAttribute("src", "");
    imgWordcloud.setAttribute("src", "");

    botoesDownload.forEach(botao => {
        botao.style.display = 'none';
    });
}

function chamarApi(link){

    h2Cloud.style.display = 'block';
    h2Status.style.display = 'block';

    imgStatus.style.borderRadius = 'none';
    imgWordcloud.style.borderRadius = 'none';

    imgStatus.style.height = '35%';
    imgStatus.style.width = 'auto';
    imgWordcloud.style.height = '35%';
    imgWordcloud.style.width = 'auto';

    imgStatus.setAttribute("src", "../assets/loading_scrap2.gif");
    imgWordcloud.setAttribute("src", "../assets/loading_scrap2.gif");

    h2Cloud.innerHTML = "Realizando Scraping, por favor aguarde na página...";
    h2Status.innerHTML = "Realizando Scraping, por favor aguarde na página...";

    fetch(`/scraper/scraper/${link}`, {
        cache: 'no-store'
    }).then(function (retorno){
        if(retorno.status == 204) {

            botoesDownload.forEach(botao => {
                botao.style.display = 'flex';
            });

            h2Cloud.style.display = 'none';
            h2Status.style.display = 'none';

            imgStatus.style.height = '95%';
            imgStatus.style.width = 'auto';
            imgWordcloud.style.height = '95%';
            imgWordcloud.style.width = 'auto';

            imgStatus.style.borderRadius = '15px';
            imgWordcloud.style.borderRadius = '15px';

            imgStatus.setAttribute("src", "../js/caca-reclamacao/Plots/piestautus.png");
            imgWordcloud.setAttribute("src", "../js/caca-reclamacao/Plots/wordcloud.png");
        }else{
            alert("deu ruim ai")
            alert("Parte 1: " + retorno)
            alert("Parte 2: " + retorno.status)
        }
    })
}

//imgStatus
//imgWordcloud