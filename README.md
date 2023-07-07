# Api Code Samples

Un exemple API avec NodeJS et Express.

## Instructions d'utilisation

Le projet est concu pour un VSCode Dev Container. Relancez le projet dans un DevContainer, et ouvrez un terminal.

Avant de lancer le serveur il faut d'abord préparer la base de données :

```bash
mycli -h dbms -u root < ./dbms/ddl/ddl.prod.sql
```

On génère les clé pour le JWT:

```bash
cd ./secrets/signing
ssh-keygen -t rsa -b 2048 -m PEM -f signing.key
openssl rsa -in signing.key -pubout -outform PEM -out signing.pub
cd ./../..
```

Ensuite, on peut lancer le serveur avec :

```bash
npm run server
```

## Tests Postman

Un export des tests pour Postman se trouve dans [./src/test/postman/api.postman_collection.json](./src/test/postman/api.postman_collection.json)