const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear o corpo das requisições como JSON
app.use(bodyParser.json());

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/minhaapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => console.log('Conectado ao MongoDB'));

// Definir o esquema e modelo para os itens
const itemSchema = new mongoose.Schema({
  name: String,
  value: Number,
});
const Item = mongoose.model('Item', itemSchema);

// Rotas para manipular os itens
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar itens.' });
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar item.' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
