

USE production;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255),

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

CREATE IF NOT EXISTS TABLE `exercise` (
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

CREATE IF NOT EXISTS TABLE `user_exercise` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT,
  `last_exercice_validate_id` INT,
  `points` INT,
  FOREIGN KEY (`id_user`) REFERENCES `user`(`id`),
  FOREIGN KEY (`last_exercice_validate_id`) REFERENCES `exercise`(`id`)
);

INSERT INTO `exercise_group` (`id`, `is_active`, `name`) VALUES (NULL, '1', 'Production');


-----------Exercice-----------
INSERT INTO `exercise` (`id`, `question_number`, `name`, `description`, `clue`, `command`, `query`, `group_id`) VALUES (NULL, '1', 'SSH', 'Merci de me donner l\'accès à votre serveur avec la clé suivante et de me fournir les informations de connexion associé:<br><code>ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDRFaGoDfJYqNHC3Qx1bfTp7D9Uvy42D+VRIneJ7npz47AvVt1ReEUVyKDDxBpIMIOw9LLbzO/2AH3r9TI8wAS0p/kjdkduZVGfjwS3QXNA5bd6VZ0SqV3f23DGSr7b+GnZGSn6TpNvnccv8I6orlz/FqFi/FaHmqPik6/txWxcUyZKN5hMYn4+F4s0aYVfoaTyjJyeEMUSrIQxhqjodRmLdb00mBR/DjXV3V2MmOb12XwpQl8rRbN9xKxSaAQHZd2Kqn0ALFRBBiM6bugzFgwqg2yvNoG2TmPFvwHNSTSYhrhcnujJ93EN3T3kZ0M3dSUtgDm+LZRWgUbWxbkxqipdqET7dRPYlrz9juV4GhWpv4TNcdyjkOKH5hqX+uZMeWFM9QIbjWK8DcExNqYiu5rnGGm2DFXQxVp03yfs2jU9M7/aF4zq9tB8LGjrUCvfGFlU07YAldCthPxVMb3C+icJ3bXvajKK3Z+fIimW5tSLtTLU6drZQXYT7cvVZ5rZ21QvxzF7HX8amcmOKqMi/MiUJukEzd3we/yeIpHRzrA3ApBeTheqeT8riDDfktB0g6djpbYKSHBMi0h62sDnEeldx0+gJkUP5cwKYffQnMm4f9m1F6IuNfNHg34F95XJNQHRfhLvwdgCSzI8nBIsPpjgrZrYpORoTKeSTht+Tf17kw==</code>', 'Le fichier où doit être copié la clé publique est le suivant: <code>/home/<votre_utilisateur>/.ssh/authorized_keys</code>', NULL, NULL, '1');
INSERT INTO `exercise` (`id`, `question_number`, `name`, `description`, `clue`, `command`, `query`, `group_id`) VALUES (NULL, '2', 'SGBDR', 'Merci de fournir les informations de connexion à votre base de donnée MariaDB/Mysql sur votre serveur', 'La connexion à la base de donnée \'rgpd\' à échoué sur votre serveur.', NULL, NULL, '1');
-----------Exercice-----------

create user IF NOT EXISTS 'produsr'@'%.%.%.%' identified by 'prodpswd';
grant select, update, insert, delete on production.* to 'produsr'@'%.%.%.%';
flush privileges;