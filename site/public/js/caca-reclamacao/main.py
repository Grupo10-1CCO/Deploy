# Web Scraping do Site do Reclame Aqui | Danylo Dias Gomes
# Bibliotecas Utilizadas: selenium & bs4
# python -m pip install selenium
# python -m pip install bs4
# python -m pip install webdriver_manager

import os

# os.system("python3 -m pip install selenium")
# os.system("python3 -m pip install bs4")
# os.system("python3 -m pip install webdriver_manager")
# os.system("python3 -m pip install rpy2")

from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.wait import WebDriverWait as wait
from bs4 import BeautifulSoup
from os import path
from os import getcwd
import csv
from palavras_chave import palavras_chave
import platform
import subprocess
import sys

import rpy2
import rpy2.robjects as objetosr
import rpy2.robjects.packages as pacotesr
from rpy2.robjects.packages import importr
from rpy2.robjects.vectors import StrVector

link = str(sys.argv[1])

so = platform.system()

baser = importr('base')
utilsr = importr('utils')
utilsr.chooseCRANmirror(ind=1)
pacotes = ["tm", "wordcloud2", "webshot2", "ggplot2", "dplyr", "grDevices"]

# os.system("apt-get install libxml2-dev")
# os.system("apt-get install libcurl4-openssl-dev")
# os.system("apt-get install libssl-dev")

pacotes_nao_instalados = [pacote for pacote in pacotes if not pacotesr.isinstalled(pacote)]
if len(pacotes_nao_instalados) > 0:
    utilsr.install_packages(StrVector(pacotes_nao_instalados))
else:
    print('Tudo já está instalado!')

user_agente = ''

if so == 'Windows':
    user_agente = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
elif so == 'Linux':
    user_agente = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"

print(f"LINK AQ: {link}")

option = Options()
option.add_argument("--headless")
option.add_argument(f"user-agent={user_agente}")
driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=option)

# driver = webdriver.Chrome(ChromeDriverManager().install())

i = 1

titulos = []
textos = []

# Nao Respondidas
nr = 0
# Respondidas
r = 0
# Resolvido
rs = 0

while i <= 25:
    url_base = f"https://{link}&pagina={i}"
    driver.get(url=url_base)
    
    driver.get_screenshot_as_file("public/js/caca-reclamacao/screenshot.png")
    
    div_reclamacoes = driver.find_element(By.CLASS_NAME, "eFXbXn")

    cont_html = div_reclamacoes.get_attribute('outerHTML')
    sopa = BeautifulSoup(cont_html, 'html.parser')

    lista_reclamacao = sopa.find_all('div', class_ = 'bJdtis')
    
    lista_status = sopa.find_all('span', class_ = 'sc-1pe7b5t-4')

    # print(lista_reclamacao)

    for reclamacao in lista_reclamacao:
        titulo = reclamacao.select('a h4')
        texto = reclamacao.select('p')
        
        titulosUnicos = []
        textosUnicos = []
        
        tituloStr = str(titulo[0].get_text())
        palavrasTi = tituloStr.split()
        for palavra in palavrasTi:
            palavraTratada = palavra.lower()
            titulosUnicos.append(palavraTratada)

        textoStr = str(texto[0].get_text())
        palavrasTe = textoStr.split()
        for palavra in palavrasTe:
            palavraTratada = palavra.lower()
            textosUnicos.append(palavraTratada)
            
        for palavra in titulosUnicos:
            for x in palavras_chave:
                if palavra == x:
                    titulos.append(palavra)
                    
                    caminho = getcwd()
                    
                    if so == 'Windows':
                        # if path.isfile(f'{caminho}\words_scraper.csv'):
                        if path.isfile(f'{caminho}\public\js\caca-reclamacao\words_scraper.csv') and i != 1:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'a', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                        else:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'w', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                writer.writeheader()
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                    elif so == 'Linux':
                        # if path.isfile(f'{caminho}\words_scraper.csv'):
                        if path.isfile(f'{caminho}/site/public/js/caca-reclamacao/words_scraper.csv') and i != 1:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'a', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                        else:
                            with open('site/public/js/caca-reclamacao/words_scraper.csv', 'w', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                writer.writeheader()
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                
                    
                                            
        for palavra in textosUnicos:
            for x in palavras_chave:
                if palavra == x:
                    textos.append(palavra)
                    
                    caminho = getcwd()
                
                    if so == 'Windows':
                        # if path.isfile(f'{caminho}\words_scraper.csv'):
                        if path.isfile(f'{caminho}\public\js\caca-reclamacao\words_scraper.csv') and i != 1:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'a', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                        else:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'w', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                writer.writeheader()
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                    elif so == 'Linux':
                        # if path.isfile(f'{caminho}\words_scraper.csv'):
                        if path.isfile(f'{caminho}/public/js/caca-reclamacao/words_scraper.csv') and i != 1:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'a', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                        else:
                            with open('public/js/caca-reclamacao/words_scraper.csv', 'w', newline='', encoding='UTF8') as arquivo:
                                writer = csv.DictWriter(arquivo, fieldnames=['Palavra'])
                                writer.writeheader()
                                # writer.writerow({'Palavra': palavra})
                                writer.writerow({'Palavra': palavra})
                            
    for status in lista_status:
        txtStatus = status.get_text()
        if txtStatus == 'Resolvido':
            rs += 1
        elif txtStatus == 'Respondida':
            r += 1
        elif txtStatus == 'Não respondida':
            nr += 1
        
        
    i += 1
    
driver.close()

with open('site/public/js/caca-reclamacao/status_scraper.csv', 'w', newline='', encoding='UTF8') as arquivo:
    writer = csv.writer(arquivo)
    writer.writerow(['Status', 'Total'])
    writer.writerow(['Resolvidas', rs])
    writer.writerow(['Respondidas', r])
    writer.writerow(['Não Respondidas', nr])

# Novo teste com rpy2
tm = importr('tm')
wordcloud2 = importr('wordcloud2')
webshot2 = importr('webshot2')
ggplot = importr('ggplot2')
dplyr = importr('dplyr')
grDevices = importr('grDevices')

# import rpy2.robjects.lib.ggplot2 as ggplot2
# import rpy2.robjects.lib.dplyr as dplyr
# import rpy2.robjects.lib.grdevices as grDevices

testeweb = objetosr.r("webshot::install_phantomjs()")

words_scraper = objetosr.r("words_scraper <- read.csv('words_scraper.csv')")
status_scraper = objetosr.r("status_scraper <- read.csv('status_scraper.csv')")

palavras = objetosr.r("palavras <- Corpus(VectorSource(words_scraper$Palavra))")

dtm = objetosr.r("dtm <- TermDocumentMatrix(palavras)")
matrizPalavras = objetosr.r("matrizPalavras <- as.matrix(dtm)")
words = objetosr.r("sort(rowSums(matrizPalavras), decreasing = TRUE)")

dfFreqPalavras = objetosr.r("dfFreqPalavras <- data.frame(word = names(words), freq = words)")

plotWordCloud = objetosr.r("plotWordCloud <- wordcloud2(data=dfFreqPalavras, size=1, color='random-light', backgroundColor = 'black', rotateRatio = 0, shape = 'circle')")

status_scraper = objetosr.r("""status_scraper <- status_scraper %>%
  mutate(prop = Total / sum(status_scraper$Total),
         label = scales::percent(prop, accuracy = 0.1)) %>%
  arrange(prop) %>%
  mutate(ypos = cumsum(prop)- 0.5*prop,
         Status = factor(Status, levels = Status[order(-(prop))], ordered = TRUE))""")

plotStatus = objetosr.r("""plotStatus <- ggplot(status_scraper, aes(x="", y=prop, fill=Status)) + 
                geom_bar(width = 1, stat = "identity", color="black", alpha=0.7) +
                coord_polar("y", start=0) +
                theme_void() +
                geom_text(aes(y = ypos, label = label), size=4, color = "black") +
                scale_fill_brewer(palette="Set1")""")

htmlwidgets = importr('htmlwidgets')
saveWidget = objetosr.r("""saveWidget(plotWordCloud,"Plots/CLOUD.html",selfcontained = F)""")
webshot = objetosr.r("""webshot("Plots/CLOUD.html","Plots/wordcloud.png", delay = 5)""")

grDevices.png(filename = "Plots/piestautus.png",
    width = 920, height = 740, units = "px", pointsize = 12,
    bg = "white")

print(plotStatus)

grDevices.dev_off()

# Chamando script em R responsável por gerar a wordcloud
# subprocess.call(['Rscript', f'{caminho}/public/js/caca-reclamacao/script_word_cloud.R'])