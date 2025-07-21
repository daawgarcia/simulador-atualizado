const express = require('express');
const cors = require('cors');
const app = express();
const simuladorRoute = require('./routes/simulador');

app.use(cors());
app.use(express.json());
app.use('/', simuladorRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
