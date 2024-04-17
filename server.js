const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI


app.use(bodyParser.json());
app.use(cors())


mongoose.connect(DB_URI)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => console.log('Conectado ao MongoDB'));


const itemSchema = new mongoose.Schema({
  name: String,
  value: Number,
});
const Item = mongoose.model('Item', itemSchema);


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

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir item.' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
