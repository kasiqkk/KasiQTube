const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'KasiQTube.html'));
});

app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format;

  if (!videoUrl || !['mp4', 'mp3'].includes(format)) {
    return res.status(400).send('Parâmetros inválidos.');
  }

  const outputDir = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const tempOutputFile = path.join(outputDir, `download.${format}`);
  const cookiesPath = 'C:\\Users\\caio\\Downloads\\KasiQTube-DownloaderYT\\cookies.txt';

  // 1. Primeiro, baixar o vídeo
  const ytCommand = format === 'mp3'
    ? `yt-dlp --cookies "${cookiesPath}" -f bestaudio --extract-audio --audio-format mp3 -o "${tempOutputFile}" "${videoUrl}"`
    : `yt-dlp --cookies "${cookiesPath}" -f bestvideo+bestaudio --merge-output-format ${format} -o "${tempOutputFile}" "${videoUrl}"`;

  exec(ytCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Erro ao baixar vídeo:', error);
      console.error('stderr:', stderr);
      return res.status(500).send('Erro ao processar o download.');
    }

    // 2. Depois, buscar o título do vídeo
    const titleCommand = `yt-dlp --cookies "${cookiesPath}" -e "${videoUrl}"`;

    exec(titleCommand, (titleError, titleStdout) => {
      if (titleError) {
        console.error('Erro ao obter o título do vídeo:', titleError);
        return res.status(500).send('Erro ao obter o título do vídeo.');
      }

      const videoTitle = titleStdout.trim().replace(/[\\\/:*?"<>|]/g, '');
      const newFileName = path.join(outputDir, `${videoTitle} - KasiQTube.${format}`);

      fs.rename(tempOutputFile, newFileName, (renameError) => {
        if (renameError) {
          console.error('Erro ao renomear o arquivo:', renameError);
          return res.status(500).send('Erro ao renomear o arquivo.');
        }

        res.download(newFileName, (downloadError) => {
          if (downloadError) {
            console.error('Erro ao enviar o arquivo:', downloadError);
          }
          fs.unlink(newFileName, () => {});
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
