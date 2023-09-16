import { Sequelize, DataTypes } from 'sequelize';

// Initialisation de la base de données
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
});

// Définition du modèle de données pour les recettes
const Recette = sequelize.define('mormitan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.STRING, // Assurez-vous que le type est correct ici
  },
  time: {
    type: DataTypes.STRING,
  },
  note: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'mormitan',
  timestamps: false,
});


sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée avec succès');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
  });

// Fonction pour ajouter une nouvelle recette
export async function addTask(newData: { name: string, link: string, time: string, note: string }) {
  return Recette.create(newData);
}

export { sequelize, Recette };
