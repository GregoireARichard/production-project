CREATE DATABASE production;

USE production;

CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT,
  `email` VARCHAR(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `meta_user_info` (
  `id_user` INT,
  `type` VARCHAR(50),
  `host` VARCHAR(255),
  `port` INT,
  `username` VARCHAR(50),
  `password` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`)
);

CREATE TABLE `user_exercice` (
  `id_user` INT,
  `last_exercice_validate_id` INT,
  `points` INT,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`)
);

CREATE TABLE `exercise` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`id`)
);