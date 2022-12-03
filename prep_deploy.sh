#!/usr/bin/env bash

apt-get -y install libcurl4-openssl-dev
apt-get -y install libxml2-dev
apt-get -y install libssl-dev
apt install libffi-dev

apt-get update
apt-get -y install software-properties-common

apt-get -y install python3-pip

apt install -y r-base

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

apt install -y ./google-chrome-stable_current_amd64.deb

python3 -m pip install selenium
python3 -m pip install bs4
python3 -m pip install webdriver_manager
python3 -m pip install rpy2