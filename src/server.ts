import Express, { NextFunction, Request, Response } from "express";
import { join } from 'path';
import { ROUTES_USER } from "../routes/IUser";

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

app.use('/user', ROUTES_USER)

// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);
