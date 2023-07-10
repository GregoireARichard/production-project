

USE production;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255),
  `full_name` VARCHAR(255),

  UNIQUE INDEX `unique_email` (`email`)
);

CREATE TABLE IF NOT EXISTS `meta_user_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT,
  `type` VARCHAR(50),
  `host` VARCHAR(255),
  `port` INT,
  `username` VARCHAR(50),
  `password` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`)
);

CREATE TABLE IF NOT EXISTS `exercise_group` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `is_active` BOOLEAN,
    `name` VARCHAR(255),
    UNIQUE INDEX `unique_name` (`name`)
);

CREATE TABLE `exercise` (
  `id` INT AUTO_INCREMENT,
  `question_number` INT,
  `name` VARCHAR(255),
  `description` TEXT,
  `clue` VARCHAR(255),
  `command` TEXT DEFAULT NULL,
  `query` TEXT DEFAULT NULL,
  `group_id` INT,
  FOREIGN KEY (`group_id`) REFERENCES `exercise_group`(`id`),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_name` (`name`)
);

CREATE TABLE IF NOT EXISTS `user_exercise` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT,
  `last_exercice_validate_id` INT,
  `points` INT,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`),
  FOREIGN KEY (`last_exercice_validate_id`) REFERENCES `exercise`(`id`)
);

create user IF NOT EXISTS 'produsr'@'%.%.%.%' identified by 'prodpswd';
grant select, update, insert, delete on production.* to 'produsr'@'%.%.%.%';
flush privileges;