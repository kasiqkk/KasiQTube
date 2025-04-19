#!/bin/bash

# Instala dependências do sistema
apt-get update && apt-get install -y wget python3-pip ffmpeg

# Instala yt-dlp globalmente
pip3 install yt-dlp

# Inicia sua aplicação Node.js
node server.js
