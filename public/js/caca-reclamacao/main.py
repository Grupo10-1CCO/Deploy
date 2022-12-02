# Web Scraping do Site do Reclame Aqui | Danylo Dias Gomes
# Bibliotecas Utilizadas: selenium & bs4
# python -m pip install selenium
# python -m pip install bs4
# python -m pip install webdriver_manager

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
import cv2

link = str(sys.argv[1])

so = platform.system()

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

with open('public/js/caca-reclamacao/status_scraper.csv', 'w', newline='', encoding='UTF8') as arquivo:
    writer = csv.writer(arquivo)
    writer.writerow(['Status', 'Total'])
    writer.writerow(['Resolvidas', rs])
    writer.writerow(['Respondidas', r])
    writer.writerow(['Não Respondidas', nr])

# Chamando script em R responsável por gerar a wordcloud
subprocess.call(['Rscript', f'{caminho}/public/js/caca-reclamacao/script_word_cloud.R'])