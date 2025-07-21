const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Nova rota para /simular-upload-controlnet
app.post('/simular-upload-controlnet', upload.any(), async (req, res) => {
  try {
    const imagensRecebidas = req.files;

    if (!imagensRecebidas || imagensRecebidas.length === 0) {
      return res.status(400).json({ erro: 'Nenhuma imagem recebida.' });
    }

    const resultados = imagensRecebidas.map((file, index) => 
      `https://fake.url/resultados/imagem${index + 1}.png`
    );

    return res.json({ resultados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao processar as imagens.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
