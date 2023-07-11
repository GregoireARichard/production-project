# Api Code Samples

Un exemple API avec NodeJS et Express.

## Instructions d'utilisation

Le projet est concu pour un VSCode Dev Container. Relancez le projet dans un DevContainer, et ouvrez un terminal.

Avant de lancer le serveur il faut d'abord préparer la base de données :

```bash
mycli -h dbms -u root < ./dbms/ddl/admin.sql
mycli -h dbms -u root < ./dbms/ddl/ddl.prod.sql
```

Pour insérer les tests:
```bash
mycli -h dbms -u root < ./dbms/ddl/exercises.sql
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

POST http://localhost:5050/production/exercise
Body 1: 
ps: vous n'avez pas la clé ssh pour mon serveur donc ça ne fonctionnera pas correctement chez vous :)
```json
{
    "name": "ssh",
    "group_id": 1,
    "test":{
        "host": "193.70.84.157",
        "username": "ubuntu",
        "port": 22
    }
}
```
Body 2: 
```json
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
```

Tous les autres Body:
```json
{
    "group_id": 1
}
```

## Exemple de réponse standard:
```json
{
    "error": {
        "title": "SSH Error",
        "message": "ls: cannot access 'command_file.sh': No such file or directory",
        "status_code": 500
    },
    "name": "SSH - command_file.sh",
    "description": "Veuillez créer un fichier command_file.sh à la racine de votre serveur",
    "clue": "Le fichier n'existe pas",
    "user_points": 4,
    "exercise_points": 2,
    "total_point": 20,
    "passed": {
        "exercises": [
            {
                "question_number": 1,
                "name": "SSH",
                "description": "Merci de me donner l'accès à votre serveur avec la clé suivante et de me fournir les informations de connexion associé:<br><code>Clé publique RSA</code>",
                "clue": "Le fichier où doit être copié la clé publique est le suivant: <code>/home/<votre_utilisateur>/.ssh/authorized_keys</code>",
                "points": 2,
                "group_id": 1
            },
            {
                "question_number": 2,
                "name": "SGBDR",
                "description": "Merci de fournir les informations de connexion à votre base de donnée MariaDB/Mysql sur votre serveur",
                "clue": "La connexion à la base de donnée 'rgpd' à échoué sur votre serveur.",
                "points": 2,
                "group_id": 1
            }
        ]
    }
}
```


Un export des tests pour Postman se trouve dans [./src/test/postman/api.postman_collection.json](./src/test/postman/api.postman_collection.json)