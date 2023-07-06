import Express, { json } from "express";
import swaggerUi from "swagger-ui-express";
import { DefaultErrorHandler } from "./middleware/error-handler.middleware";
import { RegisterRoutes } from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';


// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse le corps du message entrant comme du json
app.use(json());

app.use(cors());

app.use(cookieParser());

RegisterRoutes(app);

// Ajouter une route qui sert la documentation swagger
app.use(Express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);

// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);


