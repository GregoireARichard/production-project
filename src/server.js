"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;
// Créer l'objet Express
const app = (0, express_1.default)();
// Créer un endpoint GET
app.get('/helo', (request, response, next) => {
    response.send("<h1>Hello world!</h1>");
});
// Server des fichiers statiques
app.use('/public', express_1.default.static((0, path_1.join)('assets')));
// Lancer le serveur
app.listen(PORT, () => {
    console.info("API Listening on port " + PORT);
});
