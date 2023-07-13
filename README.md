# Api Code Samples

Un exemple API avec NodeJS et Express.<br>

## Instructions d'utilisation

Le projet est concu pour un VSCode Dev Container. Relancez le projet dans un DevContainer, et ouvrez un terminal.<br>
<br>
Avant de lancer le serveur il faut d'abord préparer la base de données :<br>

```bash
mycli -h dbms -u root < ./dbms/ddl/admin.sql
mycli -h dbms -u root < ./dbms/ddl/ddl.prod.sql
```

Pour insérer les tests:<br>

```bash
mycli -h dbms -u root < ./dbms/ddl/exercises.sql
```

On génère les clé pour le JWT:<br>

```bash
cd ./secrets/signing
ssh-keygen -t rsa -b 2048 -m PEM -f signing.key
openssl rsa -in signing.key -pubout -outform PEM -out signing.pub
cd ./../..
```

Ensuite, on peut lancer le serveur avec :<br>

```bash
npm run server
```

## Workflow:

POST http://localhost:5050/user/register<br>
```json
{
    "email": "gravity.neo@gmail.com",
    "full_name": "FEREGOTTO Romain",
    "group_id": 1
}
```

GET sur la réponse details: linkJwt et mettre le <b>actual</b> de la réponse dans le Authorization (Bearer Token)<br>

Ensuite, pour valider les tests :<br>

POST http://localhost:5050/production/exercise<br>

Body 1: <br>
ps: vous n'avez pas la clé ssh pour mon serveur donc ça ne fonctionnera pas correctement chez vous :)<br>

```json
{
    "name": "ssh",
    "test":{
        "host": "193.70.84.157",
        "username": "ubuntu",
        "port": 22
    }
}
```
Body 2: <br>
```json
{
    "name": "sgbdr",
    "test":{
        "host": "127.0.0.1",
        "username": "root",
        "password": "3652",
        "port": 3306
    }
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

## Partie administrateur

Pour la partie administrateur il faut d'abord se connecter avec les identifiants donnés sur la route ```POST /admin/login/```

Avec la payload suivante : 
```json
{
   "email": "votre@email.net",
   "password": "password"
}

```

Un JWT vous sera ensuite renvoyé et vous devrez le mettre dans votre authentification.

Suite à ça 4 routes vous seront accessibles :

- ```GET  admin/exercise_list/ ``` pour récupérer la liste des tous les exercices
- ```POST admin/exercise``` 
```json
    {
        "state": true,
        "name" : "nom de l'exercice"
    }
```
- ```GET  admin/results/ ``` pour récupérer tous les résultats des élèves, à savoir que le téléchargement du fichier xlsx a été écrit en front directement.
- ```POST admin/add_exercise_group/``` pour ajouter un challenge
```json
{
    "name": "nom du challenge"
}
```
à savoir qu'évidemment le nom ne peut être vide.