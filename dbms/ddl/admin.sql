CREATE DATABASE IF NOT EXISTS production;

USE production;

CREATE TABLE IF NOT EXISTS `admin`(
    `id` INT AUTO_INCREMENT,
    PRIMARY KEY (`id`),
    `email` VARCHAR(255),
    UNIQUE INDEX `unique_email` (`email`),
    `password` TEXT
);