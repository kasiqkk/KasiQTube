#!/bin/bash

# Atualiza e instala dependências do sistema
apt-get update && apt-get install -y wget python3-pip ffmpeg

# Instala yt-dlp via pip
pip3 install yt-dlp

# Garante que o comando yt-dlp funcione
ln -s /usr/local/bin/yt-dlp /usr/bin/yt-dlp

# Inicia sua aplicação Node.js
node server.js
