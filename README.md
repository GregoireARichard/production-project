# Api Code Samples

Un exemple API avec NodeJS et Express.

## Instructions d'utilisation

Le projet est concu pour un VSCode Dev Container. Relancez le projet dans un DevContainer, et ouvrez un terminal.

Avant de lancer le serveur il faut d'abord préparer la base de données :

```bash
mycli -h dbms -u root < ./dbms/ddl/admin.sql
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

Workflow:

POST http://localhost:5050/user/register
Body: {
    "email": "gravity.neo@gmail.com"
}

GET sur la réponse details: linkJwt et mettre le <b>actual</b> de la réponse dans le Authorization (Bearer Token)

Ensuite, pour valider les tests :

POST http://localhost:5050/production/ssh
Body 1: 
ps: vous n'avez pas la clé ssh pour mon serveur donc ça ne fonctionnera pas correctement chez vous :)
{
    "name": "ssh",
    "group_id": 1,
    "test":{
        "host": "193.70.84.157",
        "username": "ubuntu",
        "port": 22
    }
}

Body 2: 

{
    "name": "sgbdr",
    "group_id": 1,
    "test":{
        "host": "127.0.0.1",
        "username": "root",
        "password": "3652",
        "port": 3306
    }
}


Un export des tests pour Postman se trouve dans [./src/test/postman/api.postman_collection.json](./src/test/postman/api.postman_collection.json)