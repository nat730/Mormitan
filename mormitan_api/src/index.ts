import express from 'express';
import 'dotenv/config';
import { addTask, Recette } from './sequelize';
import cors from 'cors';
import bodyParser from 'body-parser';

const port = process.env.PORT ? parseInt(process.env.PORT as string) : 3000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ajout de données
app.post('/recipes', async (req, res) => {
  const newData = req.body;
  console.log('Données reçues :', newData);

  try {
    await addTask(newData);
    res.json({ message: 'Données ajoutées avec succès' });
    console.log('Recette :', Recette);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la tâche :', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche.' });
  }
});

// Récupération de données
app.get('/recipes', async (req, res) => {
  try {
    const data = await Recette.findAll();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  await Recette.destroy({
    where: {
      id: req.params.id
    },
  })
  res.send('ok')
})

// Synchronisation de la base de données et démarrage du serveur

const server = app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});