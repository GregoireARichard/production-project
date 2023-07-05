/*
Script de création de la base de données de test.
*/
create database IF NOT EXISTS test;

/* Créer l'utilisateur API */
create user IF NOT EXISTS 'api-dev'@'%.%.%.%' identified by 'api-dev-password';
grant select, update, insert, delete on test.* to 'api-dev'@'%.%.%.%';
flush privileges;