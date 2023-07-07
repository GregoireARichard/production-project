CREATE DATABASE IF NOT EXISTS production;

USE production;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255),
<<<<<<< HEAD
  UNIQUE INDEX `unique_email` (`email`)
);

CREATE TABLE IF NOT EXISTS `meta_user_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
=======
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_email` (`email`)
);
CREATE TABLE `meta_user_info` (
>>>>>>> 6b162e21d9cf5a9249b7139713ce1a407acbf1db
  `id_user` INT,
  `type` VARCHAR(50),
  `host` VARCHAR(255),
  `port` INT,
  `username` VARCHAR(50),
  `password` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`)
);
<<<<<<< HEAD

CREATE TABLE IF NOT EXISTS `exercise` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `user_exercise` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT,
  `last_exercice_validate_id` INT,
  `points` INT,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`),
  FOREIGN KEY (`last_exercice_validate_id`) REFERENCES `exercise`(`id`)
);


=======
CREATE TABLE `exercise` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`id`)
);

>>>>>>> 6b162e21d9cf5a9249b7139713ce1a407acbf1db
create user IF NOT EXISTS 'produsr'@'%.%.%.%' identified by 'prodpswd';
grant select, update, insert, delete on production.* to 'produsr'@'%.%.%.%';
flush privileges;