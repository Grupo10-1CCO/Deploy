#!/usr/bin/env Rscript --vanilla

# CONSERTAR
setwd('E:/Users/Danyl/Documents/GitHub/Projeto SAMP/Deploy/public/js/caca-reclamacao')

library(tm)
library(wordcloud2)
library(webshot2)
library(ggplot2)
library(dplyr)
library(grDevices)

webshot::install_phantomjs()

words_scraper <- read.csv("words_scraper.csv")
status_scraper <- read.csv("status_scraper.csv")

palavras <- Corpus(VectorSource(words_scraper$Palavra))

dtm <- TermDocumentMatrix(palavras)
matrizPalavras <- as.matrix(dtm)
words <- sort(rowSums(matrizPalavras), decreasing = TRUE)

dfFreqPalavras <- data.frame(word = names(words), freq = words)

plotWordCloud <- wordcloud2(data=dfFreqPalavras, size=1, color='random-light', backgroundColor = 'black', rotateRatio = 0, shape = 'circle')

status_scraper <- status_scraper %>%
  mutate(prop = Total / sum(status_scraper$Total),
         label = scales::percent(prop, accuracy = 0.1)) %>%
  arrange(prop) %>%
  mutate(ypos = cumsum(prop)- 0.5*prop,
         Status = factor(Status, levels = Status[order(-(prop))], ordered = TRUE))


plotStatus <- ggplot(status_scraper, aes(x="", y=prop, fill=Status)) + 
                geom_bar(width = 1, stat = "identity", color="black", alpha=0.7) +
                coord_polar("y", start=0) +
                theme_void() +
                geom_text(aes(y = ypos, label = label), size=4, color = "black") +
                scale_fill_brewer(palette="Set1")

## Salvando WordCloud em html, em seguida tirando 'print' para png
library("htmlwidgets")
saveWidget(plotWordCloud,"Plots/CLOUD.html",selfcontained = F)
webshot("Plots/CLOUD.html","Plots/wordcloud.png", delay = 5)

## Criando png do Pie e Plotando o grafico
png(filename = "Plots/piestautus.png",
    width = 920, height = 740, units = "px", pointsize = 12,
    bg = "white")

plotStatus

dev.off()