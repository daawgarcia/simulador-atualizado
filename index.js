const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir CORS apenas do domínio da Esthetic Aligner
const corsOptions = {
  origin: 'https://estheticaligner.com.br',
  methods: ['POST'],
  credentials: true
};

app.use(cors(corsOptions));

// Pasta temporária para uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint principal para simulação com ControlNet
app.post('/simular-upload-controlnet', upload.any(), async (req, res) => {
  try {
    const imagens = req.files || [];
    if (imagens.length === 0) {
      return res.status(400).json({ erro: 'Nenhuma imagem recebida.' });
    }

    const resultados = [];
    for (const imagem of imagens) {
      const imageBuffer = fs.readFileSync(imagem.path);
      const base64Image = imageBuffer.toString('base64');

      const response = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: process.env.REPLICATE_MODEL_VERSION,
          input: {
            image: `data:image/jpeg;base64,${base64Image}`,
            prompt: "simule o resultado ortodôntico com alinhadores estéticos, dentes alinhados, corrigidos, posição natural",
            a_prompt: "dentes realistas, alinhamento preciso, boca humana, simulação precisa",
            n_prompt: "arte digital, pintura, imagem distorcida"
          }
        },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resultado = response.data?.urls?.get;
      if (resultado) resultados.push(resultado);

      // Limpa arquivos temporários
      fs.unlinkSync(imagem.path);
    }

    res.json({ resultados });
  } catch (error) {
    console.error('Erro na simulação:', error);
    res.status(500).json({ erro: 'Erro ao processar a simulação.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
